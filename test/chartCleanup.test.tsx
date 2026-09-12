import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import MarketActivityChart from "@/components/MarketActivityChart";

const { mockDispose, mockResize, mockObserve, mockDisconnect, mockSetOption, mockInit } = vi.hoisted(() => ({
    mockDispose: vi.fn(),
    mockResize: vi.fn(),
    mockObserve: vi.fn(),
    mockDisconnect: vi.fn(),
    mockSetOption: vi.fn(),
    mockInit: vi.fn(() => ({
        setOption: mockSetOption,
        resize: mockResize,
        dispose: mockDispose,
    })),
}));

vi.mock("echarts", () => ({
    default: { init: mockInit },
    init: mockInit,
}));

describe("chart cleanup", () => {
    beforeEach(() => {
        class MockResizeObserver {
            observe = mockObserve;
            disconnect = mockDisconnect;
        }

        vi.stubGlobal("ResizeObserver", MockResizeObserver);
        mockDispose.mockReset();
        mockResize.mockReset();
        mockObserve.mockReset();
        mockDisconnect.mockReset();
        mockSetOption.mockReset();
        mockInit.mockReset();
        mockInit.mockImplementation(() => ({
            setOption: mockSetOption,
            resize: mockResize,
            dispose: mockDispose,
        }));
    });

    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it("disconnects the resize observer and disposes the chart on unmount", () => {
        const { unmount } = render(<div />);
        const { unmount: unmountChart } = render(<MarketActivityChart coinName="Bitcoin" />);

        expect(mockInit).toHaveBeenCalledTimes(1);
        expect(mockObserve).toHaveBeenCalledTimes(1);

        unmountChart();

        expect(mockDisconnect).toHaveBeenCalledTimes(1);
        expect(mockDispose).toHaveBeenCalledTimes(1);

        unmount();
    });
});

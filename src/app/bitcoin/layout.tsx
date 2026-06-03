import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bitcoin",
    description: "Bitcoin's page of description",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}
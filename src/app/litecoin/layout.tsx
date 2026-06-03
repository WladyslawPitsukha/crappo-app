import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Litecoin",
    description: "Litecoin's page of description",
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
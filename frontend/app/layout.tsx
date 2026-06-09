import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Blind Watermark Web",
	description: "基于频域的数字盲水印工具",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="zh-CN"
			className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
		>
			<body className="min-h-full flex flex-col bg-background text-foreground">
				<Navbar />
				<main className="flex-1 pt-4 sm:pt-16 pb-20 sm:pb-0">{children}</main>
			</body>
		</html>
	);
}

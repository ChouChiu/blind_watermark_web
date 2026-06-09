import { ExternalLink } from "lucide-react";
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
				<main className="flex-1 pt-4 sm:pt-16 pb-20 sm:pb-8">{children}</main>
				<footer className="fixed bottom-[4.5rem] sm:bottom-2 inset-x-0 z-40 py-1.5 text-center text-xs text-muted-foreground/50">
					<div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4">
						<a
							href="https://github.com/guofei9987/blind_watermark"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 hover:text-muted-foreground transition-colors"
						>
							<ExternalLink className="size-3" />
							guofei9987/blind_watermark
						</a>
						<span className="hidden sm:inline">·</span>
						<a
							href="https://github.com/ChouChiu/blind_watermark_web"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 hover:text-muted-foreground transition-colors"
						>
							<ExternalLink className="size-3" />
							ChouChiu/blind_watermark_web
						</a>
					</div>
				</footer>
			</body>
		</html>
	);
}

"use client";

import { Eye, Home, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
	{ href: "/", label: "首页", icon: Home },
	{ href: "/embed", label: "嵌入", icon: Shield },
	{ href: "/extract", label: "提取", icon: Eye },
];

export function Navbar() {
	const pathname = usePathname();

	return (
		<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
			<div className="flex items-center gap-1 rounded-full bg-card/80 px-2 py-1.5 ring-1 ring-white/[0.06] shadow-xl shadow-black/30 backdrop-blur-xl">
				{links.map((link) => {
					const Icon = link.icon;
					const isActive = pathname === link.href;
					return (
						<Link
							key={link.href}
							href={link.href}
							className={cn(
								"flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-all duration-200",
								isActive
									? "bg-muted text-foreground font-medium"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
							)}
						>
							<Icon className="size-3.5" />
							{link.label}
						</Link>
					);
				})}
			</div>
		</nav>
	);
}

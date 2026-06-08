import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
	isLoading: boolean;
	className?: string;
}

export function LoadingOverlay({ isLoading, className }: LoadingOverlayProps) {
	if (!isLoading) return null;

	return (
		<div
			className={cn(
				"absolute inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl",
				className,
			)}
		>
			<Loader2 className="size-6 animate-spin text-foreground" />
		</div>
	);
}

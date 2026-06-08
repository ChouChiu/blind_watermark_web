"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
	src: string | File | null;
	alt?: string;
	className?: string;
}

export function ImagePreview({
	src,
	alt = "Preview",
	className,
}: ImagePreviewProps) {
	const [objectUrl, setObjectUrl] = useState<string | null>(null);

	useEffect(() => {
		if (src instanceof File) {
			const url = URL.createObjectURL(src);
			setObjectUrl(url);
			return () => URL.revokeObjectURL(url);
		}
		setObjectUrl(null);
	}, [src]);

	if (!src) return null;

	const displayUrl = src instanceof File ? objectUrl : src;
	if (!displayUrl) return null;

	return (
		<div
			className={cn(
				"flex items-center justify-center rounded-xl border border-white/[0.06] bg-muted/10 p-2 overflow-hidden",
				className,
			)}
		>
			{/* biome-ignore lint/performance/noImgElement: next/image cannot handle blob URLs from user uploads */}
			<img
				src={displayUrl}
				alt={alt}
				className="max-h-[400px] max-w-full rounded-lg object-contain"
			/>
		</div>
	);
}

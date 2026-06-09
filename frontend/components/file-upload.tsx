"use client";

import { Upload, X } from "lucide-react";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
	onFileSelect: (file: File) => void;
	accept?: string;
	label?: string;
	file: File | null;
	className?: string;
}

function formatSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
	onFileSelect,
	accept = "image/*",
	label = "点击或拖拽上传图片",
	file,
	className,
}: FileUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const dropped = e.dataTransfer.files[0];
			if (dropped) onFileSelect(dropped);
		},
		[onFileSelect],
	);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const selected = e.target.files?.[0];
			if (selected) onFileSelect(selected);
		},
		[onFileSelect],
	);

	const handleClear = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			if (inputRef.current) inputRef.current.value = "";
			const emptyFile = new File([], "", { type: "" });
			onFileSelect(emptyFile);
		},
		[onFileSelect],
	);

	return (
		// biome-ignore lint/a11y/useSemanticElements: drop zone contains interactive children (clear button)
		<div
			role="button"
			tabIndex={0}
			className={cn(
				"relative flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] bg-muted/10 px-4 sm:px-6 py-6 sm:py-10 text-center transition-all duration-200 hover:border-white/[0.2] hover:bg-muted/20 cursor-pointer shadow-inner shadow-black/10",
				className,
			)}
			onDragOver={(e) => e.preventDefault()}
			onDrop={handleDrop}
			onClick={() => inputRef.current?.click()}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					inputRef.current?.click();
				}
			}}
		>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				onChange={handleChange}
				className="hidden"
			/>
			{file?.name ? (
				<div className="flex flex-col items-center gap-2">
					<p className="text-sm font-medium text-foreground truncate max-w-full">
						{file.name}
					</p>
					<p className="text-xs text-muted-foreground">
						{formatSize(file.size)}
					</p>
					<button
						type="button"
						onClick={handleClear}
						className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
					>
						<X className="size-4" />
					</button>
				</div>
			) : (
				<>
					<Upload className="mb-3 size-6 text-muted-foreground" />
					<p className="text-sm text-muted-foreground">{label}</p>
				</>
			)}
		</div>
	);
}

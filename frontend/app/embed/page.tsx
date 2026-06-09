"use client";

import { Download } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CapacityIndicator } from "@/components/capacity-indicator";
import { CompareSlider } from "@/components/compare-slider";
import { FileUpload } from "@/components/file-upload";
import { ImagePreview } from "@/components/image-preview";
import { LoadingOverlay } from "@/components/loading-overlay";
import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { embedWatermark, getCapacity } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function EmbedPage() {
	const [mode, setMode] = useState<"str" | "img">("str");
	const [image, setImage] = useState<File | null>(null);
	const [watermarkText, setWatermarkText] = useState("");
	const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
	const [passwordImg, setPasswordImg] = useState(1);
	const [passwordWm, setPasswordWm] = useState(1);
	const [outputFormat, setOutputFormat] = useState<"png" | "jpg">("png");

	const [capacity, setCapacity] = useState<number | null>(null);
	const [usedBits, setUsedBits] = useState<number | undefined>(undefined);

	const [resultImage, setResultImage] = useState<string | null>(null);
	const [wmBitLength, setWmBitLength] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(
		null,
	);

	useEffect(() => {
		if (!image) {
			setCapacity(null);
			setOriginalPreviewUrl(null);
			return;
		}
		const url = URL.createObjectURL(image);
		setOriginalPreviewUrl(url);

		getCapacity({ image, passwordImg }).then((res) => {
			if (res.success) setCapacity(res.capacity);
		});

		return () => URL.revokeObjectURL(url);
	}, [image, passwordImg]);

	useEffect(() => {
		if (mode === "str" && watermarkText) {
			const hex = Array.from(new TextEncoder().encode(watermarkText))
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");
			const bits = parseInt(hex, 16).toString(2).length;
			setUsedBits(bits);
		} else {
			setUsedBits(undefined);
		}
	}, [watermarkText, mode]);

	const handleEmbed = useCallback(async () => {
		if (!image) return;
		if (mode === "str" && !watermarkText.trim()) return;
		if (mode === "img" && !watermarkImage) return;

		setIsLoading(true);
		setError(null);
		setResultImage(null);

		try {
			const result = await embedWatermark({
				image,
				watermarkText: mode === "str" ? watermarkText : undefined,
				watermarkImage:
					mode === "img" && watermarkImage ? watermarkImage : undefined,
				passwordImg,
				passwordWm,
				mode,
				outputFormat,
			});

			if (result.success) {
				setResultImage(`data:image/${result.format};base64,${result.image}`);
				setWmBitLength(result.wm_bit_length);
			} else {
				setError(result.error || "嵌入失败");
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "请求失败，请检查后端服务");
		} finally {
			setIsLoading(false);
		}
	}, [
		image,
		mode,
		watermarkText,
		watermarkImage,
		passwordImg,
		passwordWm,
		outputFormat,
	]);

	const handleDownload = useCallback(() => {
		if (!resultImage) return;
		const a = document.createElement("a");
		a.href = resultImage;
		a.download = `watermarked.${outputFormat}`;
		a.click();
	}, [resultImage, outputFormat]);

	return (
		<div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
			<div className="mb-6 sm:mb-8 animate-page-enter">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					嵌入水印
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					将信息隐秘嵌入图片，肉眼不可察觉
				</p>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Left: Controls */}
				<div className="flex flex-col gap-5 animate-slide-from-left">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">水印模式</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex rounded-lg border border-input p-0.5">
								<button
									type="button"
									onClick={() => setMode("str")}
									className={cn(
										"flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
										mode === "str"
											? "bg-muted text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									字符串
								</button>
								<button
									type="button"
									onClick={() => setMode("img")}
									className={cn(
										"flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
										mode === "img"
											? "bg-muted text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									图片
								</button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">原始图片</CardTitle>
						</CardHeader>
						<CardContent>
							<FileUpload
								file={image}
								onFileSelect={(f) => {
									setImage(f.name ? f : null);
									setResultImage(null);
								}}
								accept="image/*"
								label="拖拽或点击上传原始图片"
							/>
							{capacity !== null && (
								<div className="mt-3">
									<CapacityIndicator capacity={capacity} usedBits={usedBits} />
								</div>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">水印内容</CardTitle>
						</CardHeader>
						<CardContent>
							{mode === "str" ? (
								<Textarea
									placeholder="输入要嵌入的文本水印"
									value={watermarkText}
									onChange={(e) => setWatermarkText(e.target.value)}
									rows={3}
								/>
							) : (
								<FileUpload
									file={watermarkImage}
									onFileSelect={(f) => setWatermarkImage(f.name ? f : null)}
									accept="image/*"
									label="拖拽或点击上传水印图片"
								/>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">加密设置</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<PasswordField
								label="图片密码"
								value={passwordImg}
								onChange={setPasswordImg}
							/>
							<PasswordField
								label="水印密码"
								value={passwordWm}
								onChange={setPasswordWm}
							/>
							<div className="flex flex-col gap-1.5">
								<Label>输出格式</Label>
								<div className="flex rounded-lg border border-input p-0.5">
									<button
										type="button"
										onClick={() => setOutputFormat("png")}
										className={cn(
											"flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
											outputFormat === "png"
												? "bg-muted text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										PNG
									</button>
									<button
										type="button"
										onClick={() => setOutputFormat("jpg")}
										className={cn(
											"flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
											outputFormat === "jpg"
												? "bg-muted text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										JPG
									</button>
								</div>
							</div>
						</CardContent>
					</Card>

					<Button
						onClick={handleEmbed}
						disabled={
							!image ||
							isLoading ||
							(mode === "str" && !watermarkText.trim()) ||
							(mode === "img" && !watermarkImage) ||
							(capacity !== null &&
								usedBits !== undefined &&
								usedBits > capacity)
						}
						className="w-full h-10 text-sm font-medium"
					>
						{isLoading ? "处理中..." : "开始嵌入"}
					</Button>

					{error && <p className="text-sm text-destructive">{error}</p>}
				</div>

				{/* Right: Preview */}
				<div className="flex flex-col gap-5 lg:sticky lg:top-20 lg:self-start animate-slide-from-right">
					{image && (
						<Card>
							<CardHeader>
								<CardTitle className="text-base">原始图片</CardTitle>
							</CardHeader>
							<CardContent>
								<ImagePreview src={image} alt="Original" />
							</CardContent>
						</Card>
					)}

					{resultImage && (
						<>
							<Card className="relative">
								<LoadingOverlay isLoading={isLoading} />
								<CardHeader className="flex flex-row items-center justify-between">
									<CardTitle className="text-base">嵌入结果</CardTitle>
									{wmBitLength !== null && (
										<span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
											{wmBitLength} bits
										</span>
									)}
								</CardHeader>
								<CardContent>
									<ImagePreview src={resultImage} alt="Watermarked" />
								</CardContent>
							</Card>

							{originalPreviewUrl && (
								<Card>
									<CardHeader>
										<CardTitle className="text-base">对比</CardTitle>
									</CardHeader>
									<CardContent>
										<CompareSlider
											beforeSrc={originalPreviewUrl}
											afterSrc={resultImage}
										/>
									</CardContent>
								</Card>
							)}

							<Button
								variant="outline"
								onClick={handleDownload}
								className="w-full"
							>
								<Download className="mr-2 size-4" />
								下载嵌入图片
							</Button>

							{wmBitLength !== null && (
								<div className="rounded-xl bg-card/50 p-4 ring-1 ring-white/[0.04]">
									<p className="text-sm text-muted-foreground">
										提取时需要此参数:
									</p>
									<p className="mt-1 font-mono text-sm text-foreground">
										比特长度: {wmBitLength}
									</p>
								</div>
							)}
						</>
					)}

					{!resultImage && !image && (
						<div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-card/30 p-8 sm:p-16">
							<p className="text-sm text-muted-foreground/60">
								预览将显示在此处
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

"use client";

import { Check, Copy, Download } from "lucide-react";
import { useCallback, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { ImagePreview } from "@/components/image-preview";
import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractWatermark } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ExtractPage() {
	const [mode, setMode] = useState<"str" | "img" | "bit">("str");
	const [image, setImage] = useState<File | null>(null);
	const [passwordImg, setPasswordImg] = useState(1);
	const [passwordWm, setPasswordWm] = useState(1);

	const [wmShape, setWmShape] = useState<number>(0);
	const [wmShapeW, setWmShapeW] = useState<number>(0);
	const [wmShapeH, setWmShapeH] = useState<number>(0);

	const [result, setResult] = useState<string | null>(null);
	const [resultBits, setResultBits] = useState<number[] | null>(null);
	const [resultMode, setResultMode] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);

	const handleExtract = useCallback(async () => {
		if (!image) return;
		if (mode === "str" && (!wmShape || wmShape <= 0)) return;
		if (
			mode === "img" &&
			(!wmShapeW || wmShapeW <= 0 || !wmShapeH || wmShapeH <= 0)
		)
			return;
		if (mode === "bit" && (!wmShape || wmShape <= 0)) return;

		setIsLoading(true);
		setError(null);
		setResult(null);
		setResultBits(null);

		try {
			const params: Parameters<typeof extractWatermark>[0] = {
				image,
				passwordImg,
				passwordWm,
				mode,
			};
			if (mode === "str" || mode === "bit") {
				params.wmShape = wmShape;
			}
			if (mode === "img") {
				params.wmShapeW = wmShapeW;
				params.wmShapeH = wmShapeH;
			}

			const res = await extractWatermark(params);

			if (res.success) {
				setResultMode(res.mode || mode);
				if (res.mode === "str" || mode === "str") {
					setResult(res.watermark || null);
				} else if (res.mode === "img" || mode === "img") {
					setResult(
						res.watermark ? `data:image/png;base64,${res.watermark}` : null,
					);
				} else if (res.mode === "bit" || mode === "bit") {
					setResultBits(res.bits || null);
					setResult(null);
				}
			} else {
				setError(res.error || "提取失败");
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "请求失败，请检查后端服务");
		} finally {
			setIsLoading(false);
		}
	}, [image, mode, passwordImg, passwordWm, wmShape, wmShapeW, wmShapeH]);

	const handleCopy = useCallback(() => {
		if (!result) return;
		navigator.clipboard.writeText(result);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [result]);

	const handleDownloadImage = useCallback(() => {
		if (!result || resultMode !== "img") return;
		const a = document.createElement("a");
		a.href = result;
		a.download = "extracted_watermark.png";
		a.click();
	}, [result, resultMode]);

	return (
		<div className="mx-auto max-w-5xl px-6 py-10">
			<div className="mb-8 animate-page-enter">
				<h1 className="text-2xl font-semibold tracking-tight text-foreground">
					提取水印
				</h1>
				<p className="mt-1 text-sm text-muted-foreground">
					从含水印图片中提取隐藏信息
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
								{(["str", "img", "bit"] as const).map((v) => (
									<button
										key={v}
										type="button"
										onClick={() => setMode(v)}
										className={cn(
											"flex-1 rounded-md py-1.5 text-sm font-medium transition-colors",
											mode === v
												? "bg-muted text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										{{ str: "字符串", img: "图片", bit: "二进制" }[v]}
									</button>
								))}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">含水印图片</CardTitle>
						</CardHeader>
						<CardContent>
							<FileUpload
								file={image}
								onFileSelect={(f) => {
									setImage(f.name ? f : null);
									setResult(null);
									setResultBits(null);
								}}
								accept="image/*"
								label="拖拽或点击上传含水印图片"
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="text-base">水印参数</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							{(mode === "str" || mode === "bit") && (
								<div className="flex flex-col gap-1.5">
									<Label>
										{mode === "str" ? "比特长度 (wm_shape)" : "比特数量"}
									</Label>
									<Input
										type="number"
										min={1}
										placeholder="嵌入时返回的比特长度"
										value={wmShape || ""}
										onChange={(e) => setWmShape(Number(e.target.value))}
									/>
									<p className="text-xs text-muted-foreground">
										{mode === "str"
											? "使用嵌入时返回的比特长度值"
											: "输入要提取的比特数量"}
									</p>
								</div>
							)}
							{mode === "img" && (
								<>
									<div className="flex flex-col gap-1.5">
										<Label>水印图片宽度</Label>
										<Input
											type="number"
											min={1}
											placeholder="如 128"
											value={wmShapeW || ""}
											onChange={(e) => setWmShapeW(Number(e.target.value))}
										/>
									</div>
									<div className="flex flex-col gap-1.5">
										<Label>水印图片高度</Label>
										<Input
											type="number"
											min={1}
											placeholder="如 128"
											value={wmShapeH || ""}
											onChange={(e) => setWmShapeH(Number(e.target.value))}
										/>
									</div>
								</>
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
						</CardContent>
					</Card>

					<Button
						onClick={handleExtract}
						disabled={
							!image ||
							isLoading ||
							(mode === "str" && (!wmShape || wmShape <= 0)) ||
							(mode === "img" &&
								(!wmShapeW || wmShapeW <= 0 || !wmShapeH || wmShapeH <= 0)) ||
							(mode === "bit" && (!wmShape || wmShape <= 0))
						}
						className="w-full h-10 text-sm font-medium"
					>
						{isLoading ? "处理中..." : "开始提取"}
					</Button>

					{error && <p className="text-sm text-destructive">{error}</p>}
				</div>

				{/* Right: Result */}
				<div className="flex flex-col gap-5 lg:sticky lg:top-20 lg:self-start animate-slide-from-right">
					{image && (
						<Card>
							<CardHeader>
								<CardTitle className="text-base">输入图片</CardTitle>
							</CardHeader>
							<CardContent>
								<ImagePreview src={image} alt="Input" />
							</CardContent>
						</Card>
					)}

					{result && resultMode === "str" && (
						<Card>
							<CardHeader className="flex flex-row items-center justify-between">
								<CardTitle className="text-base">提取结果</CardTitle>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleCopy}
									className="size-8 p-0"
								>
									{copied ? (
										<Check className="size-4" />
									) : (
										<Copy className="size-4" />
									)}
								</Button>
							</CardHeader>
							<CardContent>
								<div className="rounded-xl border border-white/[0.06] bg-muted/20 p-4">
									<p className="whitespace-pre-wrap break-all font-mono text-sm text-foreground">
										{result}
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{result && resultMode === "img" && (
						<>
							<Card>
								<CardHeader>
									<CardTitle className="text-base">提取的水印图片</CardTitle>
								</CardHeader>
								<CardContent>
									<ImagePreview src={result} alt="Extracted watermark" />
								</CardContent>
							</Card>
							<Button
								variant="outline"
								onClick={handleDownloadImage}
								className="w-full"
							>
								<Download className="mr-2 size-4" />
								下载水印图片
							</Button>
						</>
					)}

					{resultBits && resultMode === "bit" && (
						<Card>
							<CardHeader>
								<CardTitle className="text-base">提取的二进制数据</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="rounded-xl border border-white/[0.06] bg-muted/20 p-4">
									<p className="break-all font-mono text-sm text-foreground">
										[{resultBits.join(", ")}]
									</p>
									<p className="mt-2 text-xs text-muted-foreground">
										共 {resultBits.length} 个比特
									</p>
								</div>
							</CardContent>
						</Card>
					)}

					{!result && !resultBits && !isLoading && (
						<div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-card/30 p-16">
							<p className="text-sm text-muted-foreground/60">
								提取结果将显示在此处
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

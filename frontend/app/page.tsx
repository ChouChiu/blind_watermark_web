import { Eye, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-16 sm:py-24">
			<div className="mx-auto max-w-3xl text-center">
				<div className="animate-fade-in-up">
					<h1 className="text-3xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
						Blind Watermark Web
					</h1>
					<p className="mt-5 text-lg text-muted-foreground">
						基于频域的数字盲水印工具
					</p>
					<p className="mt-2 text-sm text-muted-foreground/70">
						将信息隐秘嵌入图片，肉眼不可察觉，支持抗攻击提取
					</p>
				</div>

				<div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
					<Link
						href="/embed"
						className="group relative flex flex-col items-center gap-4 rounded-2xl bg-card p-6 sm:p-10 ring-1 ring-white/[0.06] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:ring-white/[0.12] hover:shadow-xl animate-slide-from-left"
					>
						<div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-white/[0.06] transition-colors group-hover:bg-muted">
							<Shield className="size-7 text-muted-foreground transition-colors group-hover:text-foreground" />
						</div>
						<span className="text-lg font-semibold text-foreground">
							嵌入水印
						</span>
						<span className="text-sm text-muted-foreground">
							将文本或图片水印嵌入原始图片
						</span>
					</Link>

					<Link
						href="/extract"
						className="group relative flex flex-col items-center gap-4 rounded-2xl bg-card p-6 sm:p-10 ring-1 ring-white/[0.06] shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:ring-white/[0.12] hover:shadow-xl animate-slide-from-right"
					>
						<div className="flex size-14 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-white/[0.06] transition-colors group-hover:bg-muted">
							<Eye className="size-7 text-muted-foreground transition-colors group-hover:text-foreground" />
						</div>
						<span className="text-lg font-semibold text-foreground">
							提取水印
						</span>
						<span className="text-sm text-muted-foreground">
							从含水印图片中提取隐藏信息
						</span>
					</Link>
				</div>

				<div className="mt-16 grid grid-cols-3 gap-2 sm:gap-4 animate-slide-from-bottom">
					<div className="flex flex-col items-center gap-2 rounded-xl bg-card/50 p-3 sm:p-5 ring-1 ring-white/[0.04]">
						<p className="text-xs sm:text-sm font-medium text-foreground">
							字符串
						</p>
						<p className="text-xs text-muted-foreground">嵌入文本信息</p>
					</div>
					<div className="flex flex-col items-center gap-2 rounded-xl bg-card/50 p-3 sm:p-5 ring-1 ring-white/[0.04]">
						<p className="text-xs sm:text-sm font-medium text-foreground">
							图片
						</p>
						<p className="text-xs text-muted-foreground">嵌入图片水印</p>
					</div>
					<div className="flex flex-col items-center gap-2 rounded-xl bg-card/50 p-3 sm:p-5 ring-1 ring-white/[0.04]">
						<p className="text-xs sm:text-sm font-medium text-foreground">
							二进制
						</p>
						<p className="text-xs text-muted-foreground">嵌入比特数据</p>
					</div>
				</div>

				<p className="mt-10 text-xs text-muted-foreground/50 animate-fade-in-up-delay-3">
					基于 DCT + SVD 频域算法，抗旋转、裁剪、缩放、椒盐噪声等攻击
				</p>
			</div>
		</div>
	);
}

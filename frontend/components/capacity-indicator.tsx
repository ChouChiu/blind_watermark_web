import { cn } from "@/lib/utils";

interface CapacityIndicatorProps {
	capacity: number;
	usedBits?: number;
	className?: string;
}

export function CapacityIndicator({
	capacity,
	usedBits,
	className,
}: CapacityIndicatorProps) {
	const isOver = usedBits !== undefined && usedBits > capacity;

	return (
		<div className={cn("flex flex-col gap-1", className)}>
			<p className="text-sm text-muted-foreground">
				水印容量: {capacity.toLocaleString()} bits
			</p>
			{usedBits !== undefined && (
				<p
					className={cn(
						"text-sm",
						isOver ? "text-destructive font-medium" : "text-muted-foreground",
					)}
				>
					{isOver
						? `超出容量: 需要 ${usedBits.toLocaleString()} bits，超出 ${(usedBits - capacity).toLocaleString()} bits`
						: `已使用: ${usedBits.toLocaleString()} / ${capacity.toLocaleString()} bits`}
				</p>
			)}
		</div>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordFieldProps {
	label: string;
	value: number;
	onChange: (v: number) => void;
	className?: string;
}

export function PasswordField({
	label,
	value,
	onChange,
	className,
}: PasswordFieldProps) {
	const inputId = `password-${label}`;
	const handleRandom = () => {
		onChange(Math.floor(Math.random() * 1000000) + 1);
	};

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<label htmlFor={inputId} className="text-sm font-medium text-foreground">
				{label}
			</label>
			<div className="flex gap-2">
				<input
					id={inputId}
					type="number"
					min={1}
					value={value}
					onChange={(e) => onChange(Number(e.target.value))}
					className="h-8 w-full rounded-lg border border-white/[0.08] bg-muted/20 px-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 transition-colors"
				/>
				<Button
					variant="outline"
					size="sm"
					onClick={handleRandom}
					type="button"
				>
					随机生成
				</Button>
			</div>
		</div>
	);
}

"use client";

import {
	ReactCompareSlider,
	ReactCompareSliderImage,
} from "react-compare-slider";

interface CompareSliderProps {
	beforeSrc: string;
	afterSrc: string;
}

export function CompareSlider({ beforeSrc, afterSrc }: CompareSliderProps) {
	return (
		<ReactCompareSlider
			itemOne={<ReactCompareSliderImage src={beforeSrc} alt="Original" />}
			itemTwo={<ReactCompareSliderImage src={afterSrc} alt="Processed" />}
			className="rounded-xl overflow-hidden border border-white/[0.06]"
		/>
	);
}

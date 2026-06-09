const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface EmbedParams {
	image: File;
	watermarkText?: string;
	watermarkImage?: File;
	passwordImg: number;
	passwordWm: number;
	mode: "str" | "img";
	outputFormat: "png" | "jpg";
}

export interface EmbedResult {
	success: boolean;
	image: string;
	wm_bit_length: number;
	format: string;
	error?: string;
}

export interface ExtractParams {
	image: File;
	passwordImg: number;
	passwordWm: number;
	mode: "str" | "img" | "bit";
	wmShape?: number;
	wmShapeW?: number;
	wmShapeH?: number;
}

export interface ExtractResult {
	success: boolean;
	mode?: string;
	watermark?: string;
	bits?: number[];
	error?: string;
}

export interface CapacityResult {
	success: boolean;
	capacity: number;
	error?: string;
}

export async function embedWatermark(
	params: EmbedParams,
): Promise<EmbedResult> {
	const formData = new FormData();
	formData.append("image", params.image);
	if (params.watermarkText)
		formData.append("watermark_text", params.watermarkText);
	if (params.watermarkImage)
		formData.append("watermark_image", params.watermarkImage);
	formData.append("password_img", String(params.passwordImg));
	formData.append("password_wm", String(params.passwordWm));
	formData.append("mode", params.mode);
	formData.append("output_format", params.outputFormat);

	const res = await fetch(`${API_BASE}/api/embed`, {
		method: "POST",
		body: formData,
	});
	return res.json();
}

export async function extractWatermark(
	params: ExtractParams,
): Promise<ExtractResult> {
	const formData = new FormData();
	formData.append("image", params.image);
	formData.append("password_img", String(params.passwordImg));
	formData.append("password_wm", String(params.passwordWm));
	formData.append("mode", params.mode);
	if (params.wmShape !== undefined)
		formData.append("wm_shape", String(params.wmShape));
	if (params.wmShapeW !== undefined)
		formData.append("wm_shape_w", String(params.wmShapeW));
	if (params.wmShapeH !== undefined)
		formData.append("wm_shape_h", String(params.wmShapeH));

	const res = await fetch(`${API_BASE}/api/extract`, {
		method: "POST",
		body: formData,
	});
	return res.json();
}

export async function getCapacity(params: {
	image: File;
	passwordImg: number;
}): Promise<CapacityResult> {
	const formData = new FormData();
	formData.append("image", params.image);
	formData.append("password_img", String(params.passwordImg));

	const res = await fetch(`${API_BASE}/api/capacity`, {
		method: "POST",
		body: formData,
	});
	return res.json();
}

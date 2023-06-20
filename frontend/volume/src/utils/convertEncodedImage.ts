import * as I from "src/types/Interfaces";

export function convertEncodedImage(image: string) {
	return "data:/img/png;base64," + image;
}

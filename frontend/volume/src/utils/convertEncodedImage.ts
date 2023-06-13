import * as I from "src/types/Interfaces";

export function convertEncodedImage(image: I.Avatar) {
	return "data:/img/png;base64," + image.file;
}

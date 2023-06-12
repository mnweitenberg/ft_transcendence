import * as I from "src/types/Interfaces";

export function ConvertImg(image: I.Avatar) {
	const output = "data:/img/png;base64," + image.file;
	return output;
}

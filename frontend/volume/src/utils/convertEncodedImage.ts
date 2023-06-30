export function convertEncodedImage(imageFile: string) {
	if (!imageFile || imageFile.length < 10) return "/img/no_profile_picture.jpg";
	return "data:/img/png;base64," + imageFile;
}

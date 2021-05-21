import { Base64 } from "js-base64";

export const validateEmail = (email) => {
	const rgExEmail =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return rgExEmail.test(String(email).toLowerCase());
};

export const EncriptPassword = (email, password) => {
	let plainText = email + "-" + password;
	return Base64.encode(plainText);
};

export const EncriptText = (value) => {
	if (typeof value !== "string") {
		return Base64.encode(JSON.stringify(value));
	}
	return Base64.encode(value);
};

export const DecriptText = (cipherText) => {
	return Base64.decode(cipherText);
};

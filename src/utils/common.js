import { Base64 } from "js-base64";
import { toString } from "lodash";
import XLSX from "xlsx";

export const dateFormat = "DD/MM/YYYY";
export const dateTimeFormat = "DD/MM/YYYY - HH:mm";

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

export const ExportExcel = (data, fileName, nameSheet) => {
	try {
		const dotFile = ".xlsx";
		if (
			typeof data === "undefined" ||
			typeof fileName === "undefined" ||
			typeof nameSheet === "undefined"
		) {
			alert("Phải nhận đủ 3 tham số: dữ liệu, tên file, tên sheet");
		}

		if (typeof data !== "object") {
			alert("Dữ liệu đầu vào phải là một array hoặc object");
			return;
		}

		const ws = XLSX.utils.json_to_sheet(data);
		let wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, toString(nameSheet));

		XLSX.writeFile(wb, fileName + dotFile);
	} catch (error) {
		alert(error.message);
	}
};

export const multiDataCreatedOrDeleted = async (
	instanceAPI,
	arrayData,
	callbacks
) => {
	const { callbackOnSuccess, callbackOnFail } = callbacks;
	let success = 0;
	let fail = 0;
	let total = arrayData.length;

	for (let i = 0; i < total; i++) {
		const response = await instanceAPI(arrayData[i]);
		if (response.error === false && response.status === 200) {
			success++;
		} else {
			fail++;
		}
	}

	if (success + fail === total) {
		if (fail === total) {
			await callbackOnFail({ fail, total });
		} else {
			await callbackOnSuccess({ success, total });
		}
	}
};

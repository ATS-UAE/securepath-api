export const stringifyQuery = (data: object) => {
	return Object.entries(data).reduce<string>((acc, item, index, entries) => {
		const [key, value] = item;
		let accumulator = acc;
		if (value instanceof Array) {
			value.forEach((field, fieldIndex) => {
				accumulator += `${key}${encodeURIComponent(
					"[]"
				)}=${encodeURIComponent(field)}${
					fieldIndex === field.length - 1 ? "" : "&"
				}`;
			});
		} else {
			accumulator += `${key}=${encodeURIComponent(value)}${
				index === entries.length - 1 ? "" : "&"
			}`;
		}

		return accumulator;
	}, "");
};

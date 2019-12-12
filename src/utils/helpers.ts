export const stringifyQuery = (data: object) => {
	return Object.entries(data).reduce<string>((acc, item, index, entries) => {
		const [key, value] = item;

		if (value instanceof Array) {
			for (const [index, item] of value.entries()) {
				acc += `${key}${encodeURIComponent("[]")}=${encodeURIComponent(item)}${
					index === value.length - 1 ? "" : "&"
				}`;
			}
		} else {
			acc += `${key}=${encodeURIComponent(value)}${
				index === entries.length - 1 ? "" : "&"
			}`;
		}

		return acc;
	}, "");
};

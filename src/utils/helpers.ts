export const stringifyQuery = (data: object) => {
	return Object.entries(data).reduce<string>((acc, item, index, entries) => {
		const [key, value] = item;

		acc += `${key}=${encodeURIComponent(value)}${
			index === entries.length - 1 ? "" : "&"
		}`;

		return acc;
	}, "");
};

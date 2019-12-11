export const stringifyQuery = (data: object) => {
	return Object.entries(data).reduce<string>((acc, item) => {
		const [key, value] = item;

		acc += `${key}=${encodeURIComponent(value)}`;

		return acc;
	}, "");
};

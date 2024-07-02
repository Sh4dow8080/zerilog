export default function stringifier(value: any, space?: number): string {
	return JSON.stringify(value, createReplacer(), space);
}

function createReplacer() {
	const ancestors = [];
	return function (_: string, value: unknown) {
		if (typeof value === "bigint") {
			return `${value}n`;
		}

        if (typeof value === "symbol") {
            return value.toString();
        }

        if (value instanceof Set) {
            return Array.from(value);
        }

        if (value instanceof Map) {
            return Object.fromEntries(value);
        }

        if (value instanceof Error) {
            return {
                message: value.message,
                name: value.name,
                stack: value.stack,
                ...value,
            };
        }

		if (typeof value !== "object" || value === null) {
			return value;
		}

		while (ancestors.length > 0 && ancestors.at(-1) !== this)
			ancestors.pop();

		if (ancestors.includes(value)) return "[Circular]";

		ancestors.push(value);
		return value;
	};
}

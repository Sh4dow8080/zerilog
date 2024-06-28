export class LogEventMessage {
	public readonly renderedMessage: string;
	public readonly context = new Map<string, unknown>();
	constructor(
		public readonly message: string,
		public readonly args: unknown[],
		readonly serializer: (value: unknown) => string
	) {
		const { renderedMessage: _renderedMessage, params } = formatAndGetKeys(
			{
				format: message,
				serializer: this.serializer,
			},
			...this.args
		);

		this.renderedMessage = _renderedMessage;
		this.context = params;
	}
}

interface Result {
	message: string;
	renderedMessage: string;
	params: Map<string, unknown>;
}

export function LogEventMessageDefaultSerializer(value: unknown): string {
	if (typeof value === "object")
		return `${value?.constructor.name} ${JSON.stringify(value)}`;

	return String(value);
}

type FormatOrOptions =
	| string
	| {
			format: string;
			serializer: (value: unknown) => string;
	  };

function formatAndGetKeys(
	formatOrOptions: FormatOrOptions,
	...params: unknown[]
): Result {
	const format =
		typeof formatOrOptions === "string"
			? formatOrOptions
			: formatOrOptions.format;
	const serializer =
		typeof formatOrOptions === "string"
			? LogEventMessageDefaultSerializer
			: formatOrOptions.serializer;

	const regex = /\{([^\}]+)\}/g;
	const paramsObject: Map<string, unknown> = new Map();
	let renderedMessage = "";
	let lastIndex = 0;
	let paramIndex = 0;

	let match: RegExpExecArray;
	while (
		(match = regex.exec(format)) !== null &&
		paramIndex < params.length
	) {
		const key = match[1];
		const paramValue = params[paramIndex];
		const renderedValue = serializer(paramValue);
		paramsObject.set(key, paramValue);

		renderedMessage += format.slice(lastIndex, match.index) + renderedValue;
		lastIndex = regex.lastIndex;
		paramIndex++;
	}

	renderedMessage += format.slice(lastIndex);

	return {
		message: format,
		renderedMessage,
		params: paramsObject,
	};
}

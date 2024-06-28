import { LogEvent } from "../../zerilog/src/LogEvent";
import { ILogZink } from '../../zerilog/src/ILogZink';
import { LogEventLevel } from "../../zerilog/src/LogEventLevel";
export default class ConsoleZink implements ILogZink {
	log(event: LogEvent): void {
		const context = combineContexts(event.context, event.message.context);

		console.log(
			formatLevel(event.level),
			event.message.renderedMessage,
			context
		);
	}
}

function combineContexts(
	...contexts: LogEvent["context"][]
): LogEvent["context"] {
	const combinedContext = new Map<string, any>();

	for (const context of contexts) {
		for (const [key, value] of context) {
			combinedContext.set(key, value);
		}
	}

	return combinedContext;
}

function formatLevel(_level: LogEvent["level"]): string {
	let level: string;

	switch (_level) {
		case LogEventLevel.Debug:
			level = "debug";
			break;
		case LogEventLevel.Information:
			level = "info";
			break;
		case LogEventLevel.Warning:
			level = "warn";
			break;
		case LogEventLevel.Error:
			level = "error";
			break;
		case LogEventLevel.Fatal:
			level = "fatal";
			break;
	}

	return `[${level.toLocaleUpperCase()}]`;
}

import { LogEventLevel } from "./LogEventLevel";
import { type LogEventMessage } from "./LogEventMessage";

export class LogEvent {
	constructor(
		public readonly level: LogEventLevel,
		public readonly message: LogEventMessage,
		public readonly context: Map<string, any>
	) {}

	public static fromLogEvent(event: LogEvent): LogEvent {
		return new LogEvent(event.level, event.message, event.context);
	}
}

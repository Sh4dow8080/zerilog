import { LogEvent } from "./LogEvent";

export interface ILogEnricher {
	enrich(event: LogEvent): LogEvent;
}

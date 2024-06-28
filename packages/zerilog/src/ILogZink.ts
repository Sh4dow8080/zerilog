import { LogEvent } from "./LogEvent";

export interface ILogZink {
	log(event: LogEvent): void;
}

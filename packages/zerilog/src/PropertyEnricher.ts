import { ILogEnricher } from "./ILogEnricher";
import { LogEvent } from "./LogEvent";

export class PropertyEnricher implements ILogEnricher {
	constructor(private readonly name: string, private readonly value: any) {}
	enrich(event: LogEvent): LogEvent {
		const cloned = LogEvent.fromLogEvent(event);
		cloned.context.set(this.name, this.value);

		return cloned;
	}
}

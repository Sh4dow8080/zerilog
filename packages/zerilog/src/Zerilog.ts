import { ILogEnricher } from "./ILogEnricher";
import { ILogZink } from "./ILogZink";
import { LogEvent } from "./LogEvent";
import { LogEventLevel } from "./LogEventLevel";
import {
	LogEventMessage,
	LogEventMessageDefaultSerializer,
} from "./LogEventMessage";
import { LogEventLevelResolver } from "./MinimumLevelConfiguration";

export class Zerilog {
	constructor(
		private readonly zinks: ILogZink[],
		private readonly enrichers: ILogEnricher[],
		private readonly minimumLevelResolver: LogEventLevelResolver,
		private readonly context: Map<string, any> = new Map()
	) {}

	private createEnrichedEvent(
		level: LogEventLevel,
		format: string,
		...args: any[]
	): LogEvent {
		let event = new LogEvent(
			level,
			new LogEventMessage(format, args, LogEventMessageDefaultSerializer),
			this.context
		);

		for (const enricher of this.enrichers) {
			event = enricher.enrich(event);
		}

		return event;
	}

	private log(level: LogEventLevel, format: string, ...args: any[]): void {
		let event = this.createEnrichedEvent(level, format, ...args);

		const minimumLevel = this.minimumLevelResolver(event);
		if (level < minimumLevel) return;

		for (const zink of this.zinks) {
			zink.log(event);
		}
	}

	public verbose = (message: string, ...args: any[]) =>
		this.log(LogEventLevel.Verbose, message, ...args);
	public debug = (message: string, ...args: any[]) =>
		this.log(LogEventLevel.Debug, message, ...args);
	public information = (message: string, ...args: any[]) =>
		this.log(LogEventLevel.Information, message, ...args);
	public warning = (message: string, ...args: any[]) =>
		this.log(LogEventLevel.Warning, message, ...args);
	public error = (message: string, ...args: any[]) =>
		this.log(LogEventLevel.Error, message, ...args);
	public fatal = (message: string, ...args: any[]) =>
		this.log(LogEventLevel.Fatal, message, ...args);
	public write = (level: LogEventLevel, message: string, ...args: any[]) =>
		this.log(level, message, ...args);

	public forContext(name: string, value: any) {
		const newContext = new Map(this.context);
		newContext.set(name, value);
		return new Zerilog(
			this.zinks,
			this.enrichers,
			this.minimumLevelResolver,
			newContext
		);
	}
}

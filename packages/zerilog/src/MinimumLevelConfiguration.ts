import { LogEvent } from "./LogEvent";
import { LogEventLevel } from "./LogEventLevel";
import { LoggerConfiguration } from "./LoggerConfiguration";

export type LogEventLevelResolver = (logEvent: LogEvent) => LogEventLevel;

export class MinimumLevelConfiguration {
	constructor(
		private loggerConfiguration: LoggerConfiguration,
		private onSetMinimumLevel: (resolver: LogEventLevelResolver) => void
	) {}

	public set(level: LogEventLevel) {
		this.onSetMinimumLevel((_) => level);

		return this.loggerConfiguration;
	}

	public verbose = () => this.set(LogEventLevel.Verbose);
	public debug = () => this.set(LogEventLevel.Debug);
	public information = () => this.set(LogEventLevel.Information);
	public warning = () => this.set(LogEventLevel.Warning);
	public error = () => this.set(LogEventLevel.Error);
	public fatal = () => this.set(LogEventLevel.Fatal);

	public dynamic(levelResolver: LogEventLevelResolver) {
		this.onSetMinimumLevel(levelResolver);
	}
}

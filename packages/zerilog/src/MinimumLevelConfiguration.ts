import { LogEvent } from "./LogEvent";
import { LogEventLevel } from "./LogEventLevel";
import { LoggerConfiguration } from "./LoggerConfiguration";

export type LogEventLevelResolver = (logEvent: LogEvent) => LogEventLevel;

export class MinimumLevelConfiguration {
	constructor(
		private loggerConfiguration: LoggerConfiguration,
		private onSetMinimumLevel: (resolver: LogEventLevelResolver) => void
	) {}

	private _set(level: LogEventLevel) {
		this.onSetMinimumLevel((_) => level);

		return this.loggerConfiguration;
	}

	public verbose = () => this._set(LogEventLevel.Verbose);
	public debug = () => this._set(LogEventLevel.Debug);
	public information = () => this._set(LogEventLevel.Information);
	public warning = () => this._set(LogEventLevel.Warning);
	public error = () => this._set(LogEventLevel.Error);
	public fatal = () => this._set(LogEventLevel.Fatal);
	public set(level: LogEventLevel) {
		return this._set(level);
	}

	public dynamic(levelResolver: LogEventLevelResolver) {
		this.onSetMinimumLevel(levelResolver);
	}
}

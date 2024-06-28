import { EnrichConfiguration } from "./EnrichConfiguration";
import { ILogEnricher } from "./ILogEnricher";
import { ILogZink } from "./ILogZink";
import { LogEventLevel } from "./LogEventLevel";
import {
	LogEventLevelResolver,
	MinimumLevelConfiguration,
} from "./MinimumLevelConfiguration";
import { WriteToConfiguration } from "./WriteToConfiguration";
import { Zerilog } from "./Zerilog";

export class LoggerConfiguration {
	private _zinks: ILogZink[] = [];
	private _enrichers: ILogEnricher[] = [];
	private _minimumLevelResolver: LogEventLevelResolver = () =>
		LogEventLevel.Information;

	public readonly writeTo = new WriteToConfiguration(this, (zink) =>
		this._zinks.push(zink)
	);
	public readonly minimumLevel = Object.freeze(
		new MinimumLevelConfiguration(
			this,
			(levelResolver) => (this._minimumLevelResolver = levelResolver)
		)
	);
	public readonly enrich = new EnrichConfiguration(this, (enricher) =>
		this._enrichers.push(enricher)
	);

	public createLogger = (): Zerilog =>
		new Zerilog(this._zinks, this._enrichers, this._minimumLevelResolver);
}

import { ILogEnricher } from "./ILogEnricher";
import { LoggerConfiguration } from "./LoggerConfiguration";
import { PropertyEnricher } from "./PropertyEnricher";

export class EnrichConfiguration {
	constructor(
		private readonly loggerConfiguration: LoggerConfiguration,
		private readonly onAddEnricher: (enricher: ILogEnricher) => void
	) {}

	public with(enricher: ILogEnricher): LoggerConfiguration {
		this.onAddEnricher(enricher);

		return this.loggerConfiguration;
	}

	public withProperty(name: string, value: any): LoggerConfiguration {
		this.onAddEnricher(new PropertyEnricher(name, value));

		return this.loggerConfiguration;
	}
}

import { ILogZink } from "./ILogZink";
import { LoggerConfiguration } from "./LoggerConfiguration";

export class WriteToConfiguration {
	constructor(
		private loggerConfiguration: LoggerConfiguration,
		private onAddZink: (zink: ILogZink) => void
	) {}

	public zink(zink: ILogZink) {
		this.onAddZink(zink);

		return this.loggerConfiguration;
	}
}

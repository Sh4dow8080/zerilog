import { ILogZink, LogEvent } from "zerilog";

export default class HumioZink implements ILogZink {
	private batch: LogEvent[] = [];
	private timer: NodeJS.Timeout | undefined;

	private get configuration(): HumioZinkConfiguration {
		return {
			url: "https://cloud.humio.com",
			batchSizeLimit: 50,
			batchTimeout: 5000,
			...this._configuration,
		};
	}

	constructor(private readonly _configuration: HumioZinkConfiguration) {
		this.timer = setInterval(() => {
			this.sendBatch();
		}, this.configuration.batchTimeout);
	}

	log(event: LogEvent): void {
		this.batch.push(event);

		if (this.batch.length < this.configuration.batchSizeLimit) return;

		this.sendBatch();
	}

	private async sendBatch(): Promise<void> {
		if (this.batch.length === 0) return;

		console.log("Sending batch", this.batch);

		this.batch = [];
	}

	[Symbol.dispose]() {
		if (this.timer) {
			clearInterval(this.timer);
		}

		this.sendBatch();
	}
}

interface HumioZinkConfiguration {
	ingestToken: string;
	tags?: Record<string, string>;

	// If you are using the community edition, you need to set this to "https://cloud.community.humio.com"
	url?: "https://cloud.humio.com" | "https://cloud.community.humio.com";

	// The maximum number of logs that can be sent in a single batch
	batchSizeLimit?: number;

	// The frequency at which the batch is sent to Humio
	batchTimeout?: number;
}

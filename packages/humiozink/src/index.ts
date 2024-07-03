import { ILogZink, LogEvent, LogEventLevel } from "zerilog";
import { HumioEvent } from "./HumioEvent";
import { HumioZinkConfiguration } from "./HumioZinkConfiguration";
import stringifier from "./stringifier";

export default class HumioZink implements ILogZink {
	private batch: HumioEvent[] = [];
	private timer: NodeJS.Timeout | undefined;

	private get configuration(): HumioZinkConfiguration {
		return {
			url: "https://cloud.humio.com",
			batchSizeLimit: 50,
			batchTimeout: 5000,
			tags: {},
			...this._configuration,
		};
	}

	constructor(private readonly _configuration: HumioZinkConfiguration) {
		this.timer = setInterval(() => {
			this.sendBatch();
		}, this.configuration.batchTimeout);
	}

	log(event: LogEvent): void {
		const humioEvent = this.createEvent(event);
		this.batch.push(humioEvent);

		if (this.batch.length < this.configuration.batchSizeLimit) return;

		this.sendBatch();
	}

	private createEvent(event: LogEvent): HumioEvent {
		const context = combineMaps(event.context, event.message.context);
		const eventContext = new Map<string, any>([
			["Level", LogEventLevel[event.level]],
			["Message", event.message.message],
			["RenderedMessage", event.message.renderedMessage],

			["Properties", context],
		]);
		return HumioEvent.now(eventContext);
	}

	private async sendBatch(): Promise<void> {
		if (this.batch.length === 0) return;

		const request = stringifier([
			{
				events: this.batch,
				tags: this.configuration.tags,
			},
		]);
		const response = await fetch(
			this.configuration.url + "/api/v1/ingest/humio-structured",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.configuration.ingestToken}`,
				},
				body: request,
				keepalive: true,
			}
		);

		if (!response.ok) {
			console.error("[Zerilog/HumioZink] Failed to send batch", response);
			return;
		}

		this.batch = [];
	}

	[Symbol.dispose]() {
		if (this.timer) {
			clearInterval(this.timer);
		}

		this.sendBatch();
	}
}

function combineMaps(...maps: Map<string, any>[]): Map<string, any> {
	const combinedMap = new Map<string, any>();

	for (const map of maps) {
		for (const [key, value] of map) {
			combinedMap.set(key, value);
		}
	}

	return combinedMap;
}
type Primitive = string | number | boolean | null | undefined;

export interface HumioZinkConfiguration {
	ingestToken: string;
	tags?: Record<string, Primitive>;

	// If you are using the community edition, you need to set this to "https://cloud.community.humio.com"
	url?: "https://cloud.humio.com" | "https://cloud.community.humio.com";

	// The maximum number of logs that can be sent in a single batch
	batchSizeLimit?: number;

	// The frequency at which the batch is sent to Humio
	batchTimeout?: number;

	// The maximum number of times a failed event will be retried before being dropped
	maxRetries?: number;
}

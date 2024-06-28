export class HumioEvent {
	constructor(
		public readonly timestamp: Date,
		public readonly attributes: Map<string, any>
	) {}

	public static now(attributes: Map<string, any>): HumioEvent {
		return new HumioEvent(new Date(), attributes);
	}

	toJSON(): Record<string, any> {
		return {
			timestamp: this.timestamp.toISOString(),
			attributes: Object.fromEntries(this.attributes),
		};
	}
}

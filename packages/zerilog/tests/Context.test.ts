import { LoggerConfiguration } from "../src";
const loggerFn = jest.fn();

beforeEach(() => {
	loggerFn.mockClear();
	loggerFn.mockReset();
});

it("Should not modify the original context", () => {
	// Arrange & Act
	const logger = new LoggerConfiguration().writeTo
		.zink({
			log: loggerFn,
		})
		.minimumLevel.verbose()
		.createLogger();

	logger.forContext("name", "john").verbose("verbose");

	expect(((logger as any).context as Map<string, any>).size).toBe(0);
	expect(loggerFn).toHaveBeenCalledTimes(1);
	expect(loggerFn).toHaveBeenCalledWith(
		expect.objectContaining({
			context: new Map([["name", "john"]]),
		})
	);
});

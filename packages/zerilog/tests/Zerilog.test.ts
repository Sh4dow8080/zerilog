import { LogEvent } from "../src/LogEvent";
import { LogEventMessage } from "../src/LogEventMessage";
import { LoggerConfiguration } from "../src/LoggerConfiguration";

const consoleLogSpy = jest.fn();

beforeEach(() => {
	consoleLogSpy.mockClear();
	consoleLogSpy.mockReset();
});

it("Should log all levels when minimum level is verbose", () => {
	const logger = new LoggerConfiguration().writeTo
		.zink({
			log: consoleLogSpy,
		})
		.minimumLevel.verbose()
		.createLogger();

	logger.verbose("verbose");
	logger.debug("debug");
	logger.information("information");
	logger.warning("warning");
	logger.error("error");
	logger.fatal("fatal");

	expect(consoleLogSpy).toHaveBeenCalledTimes(6);
});

it("Should only log messages above the minimum level", () => {
	const logger = new LoggerConfiguration().writeTo
		.zink({
			log: consoleLogSpy,
		})
		.minimumLevel.warning()
		.createLogger();

	logger.verbose("verbose");
	logger.debug("debug");
	logger.information("information");
	logger.warning("warning");
	logger.error("error");
	logger.fatal("fatal");

	// Check that only the messages above the minimum level were logged
	expect(consoleLogSpy).toHaveBeenCalledTimes(3);
});

it("Should correctly format the message", () => {
    // Arrange
	let logEventMessage: LogEventMessage;
	const logger = new LoggerConfiguration().writeTo
		.zink({
			log: (_logEvent) => {
				logEventMessage = _logEvent.message;
			},
		})
		.minimumLevel.verbose()
		.createLogger();

    // Act
	logger.verbose(
		"This ia a string with {Name} and {City}",
		"John",
		"Chicago"
	);

    // Assert
	expect(logEventMessage.renderedMessage).toBe(
		"This ia a string with John and Chicago"
	);
	expect(logEventMessage.context.has("Name")).toBe(true);
	expect(logEventMessage.context.has("City")).toBe(true);

	expect(logEventMessage.context.get("Name")).toBe("John");
	expect(logEventMessage.context.get("City")).toBe("Chicago");
});

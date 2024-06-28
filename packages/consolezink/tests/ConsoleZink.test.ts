import { LogEvent } from "../../zerilog/src/LogEvent";
import { LogEventLevel } from "../../zerilog/src/LogEventLevel";
import {
	LogEventMessage,
	LogEventMessageDefaultSerializer,
} from "../../zerilog/src/LogEventMessage";
import ConsoleZink from "../src/index";
it("Should log a message", () => {
	// Arrange
	const consoleSpy = jest.spyOn(console, "log");
	const consoleZink = new ConsoleZink();
	const event = new LogEvent(
		LogEventLevel.Information,
		new LogEventMessage(
			"Hello {Name}!",
			["John"],
			LogEventMessageDefaultSerializer
		),
		new Map([["Age", 42]])
	);
	
	// Act
	consoleZink.log(event);

	// Assert
	expect(consoleSpy).toHaveBeenCalledWith(
		"[INFO]",
		"Hello John!",
		new Map<string, any>([
			["Age", 42],
			["Name", "John"],
		])
	);
});

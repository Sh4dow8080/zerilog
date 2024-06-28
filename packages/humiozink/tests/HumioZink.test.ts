import { LogEvent, LogEventLevel } from "zerilog";
import {
	LogEventMessage,
	LogEventMessageDefaultSerializer,
} from "zerilog/lib/LogEventMessage";
import HumioZink from "../src/index";

jest.useFakeTimers();
jest.spyOn(global, "setInterval");

it("Should send a batch of events", () => {
	// override fetch to return a successful response
	const fetchSpy = jest.spyOn(global, "fetch");
	fetchSpy.mockImplementation(() => Promise.resolve(new Response()));

	// Arrange
	const humioZink = new HumioZink({
		ingestToken: "1234567890",
		url: "https://cloud.humio.com",
		batchSizeLimit: 0,
	});

	const event1 = new LogEvent(
		LogEventLevel.Information,
		new LogEventMessage(
			"Hello {Name}!",
			["John"],
			LogEventMessageDefaultSerializer
		),
		new Map([["Age", 42]])
	);

	// Act
	humioZink.log(event1);

	// Assert
	expect(fetchSpy).toHaveBeenCalledWith(
		"https://cloud.humio.com/api/v1/ingest/humio-structured",
		expect.objectContaining({
			method: "POST",
			headers: expect.objectContaining({
				"Content-Type": "application/json",
				"Authorization": "Bearer 1234567890",
			}),
			body: expect.stringContaining("Hello John!"),
		})
	);

	// Assert that the sendBatch method was scheduled to be called every 5000 milliseconds
	expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);
});

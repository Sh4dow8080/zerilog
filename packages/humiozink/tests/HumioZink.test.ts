import { LogEvent, LogEventLevel } from "zerilog";
import {
	LogEventMessage,
	LogEventMessageDefaultSerializer,
} from "zerilog/lib/LogEventMessage";
import HumioZink from "../src/index";

jest.useFakeTimers();
jest.spyOn(global, "setInterval");

function createLogEvent(message: string = "Hello {Name}!", args: any[] = ["John"]): LogEvent {
	return new LogEvent(
		LogEventLevel.Information,
		new LogEventMessage(message, args, LogEventMessageDefaultSerializer),
		new Map([["Age", 42]])
	);
}

let fetchSpy: jest.SpyInstance;

beforeEach(() => {
	fetchSpy = jest.spyOn(global, "fetch");
	fetchSpy.mockImplementation(() => Promise.resolve(new Response()));
});

afterEach(() => {
	fetchSpy.mockRestore();
});

it("Should send a batch of events", () => {
	const humioZink = new HumioZink({
		ingestToken: "1234567890",
		url: "https://cloud.humio.com",
		batchSizeLimit: 0,
	});

	humioZink.log(createLogEvent());

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

	expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 5000);
});

it("Should not send duplicate events when sendBatch is called concurrently", async () => {
	// Make fetch slow so concurrent calls overlap
	fetchSpy.mockImplementation(
		() => new Promise((resolve) => setTimeout(() => resolve(new Response()), 100))
	);

	const humioZink = new HumioZink({
		ingestToken: "token",
		url: "https://cloud.humio.com",
		batchSizeLimit: 50,
	});

	humioZink.log(createLogEvent());

	// Trigger sendBatch via timer, then trigger again before the first completes
	jest.advanceTimersByTime(5000);
	jest.advanceTimersByTime(5000);

	// Let all promises resolve
	await jest.advanceTimersByTimeAsync(200);

	// Fetch should only have been called once — second call sees empty batch
	expect(fetchSpy).toHaveBeenCalledTimes(1);
});

it("Should requeue events on failed response", async () => {
	fetchSpy
		.mockImplementationOnce(() => Promise.resolve(new Response(null, { status: 500 })))
		.mockImplementationOnce(() => Promise.resolve(new Response()));

	const humioZink = new HumioZink({
		ingestToken: "token",
		url: "https://cloud.humio.com",
		batchSizeLimit: 50,
	});

	humioZink.log(createLogEvent());

	// First send — fails, events requeued
	jest.advanceTimersByTime(5000);
	await Promise.resolve();

	// Second send — succeeds with requeued events
	jest.advanceTimersByTime(5000);
	await Promise.resolve();

	expect(fetchSpy).toHaveBeenCalledTimes(2);
	expect(fetchSpy.mock.calls[1][1].body).toContain("Hello John!");
});

it("Should requeue events on network error", async () => {
	fetchSpy
		.mockImplementationOnce(() => Promise.reject(new Error("Network error")))
		.mockImplementationOnce(() => Promise.resolve(new Response()));

	const humioZink = new HumioZink({
		ingestToken: "token",
		url: "https://cloud.humio.com",
		batchSizeLimit: 50,
	});

	humioZink.log(createLogEvent());

	jest.advanceTimersByTime(5000);
	await Promise.resolve();

	jest.advanceTimersByTime(5000);
	await Promise.resolve();

	expect(fetchSpy).toHaveBeenCalledTimes(2);
});

it("Should drop events after max retries", async () => {
	fetchSpy.mockImplementation(() => Promise.resolve(new Response(null, { status: 500 })));

	const warnSpy = jest.spyOn(console, "warn").mockImplementation();
	const errorSpy = jest.spyOn(console, "error").mockImplementation();

	const humioZink = new HumioZink({
		ingestToken: "token",
		url: "https://cloud.humio.com",
		batchSizeLimit: 50,
		maxRetries: 2,
	});

	humioZink.log(createLogEvent());

	// Retry 1
	jest.advanceTimersByTime(5000);
	await Promise.resolve();

	// Retry 2
	jest.advanceTimersByTime(5000);
	await Promise.resolve();

	// Retry 3 — exceeds maxRetries of 2, events should be dropped
	jest.advanceTimersByTime(5000);
	await Promise.resolve();

	expect(warnSpy).toHaveBeenCalledWith(
		expect.stringContaining("Dropped 1 events after max retries")
	);

	// Next tick — batch should be empty, no more fetch calls
	const callCount = fetchSpy.mock.calls.length;
	jest.advanceTimersByTime(5000);
	await Promise.resolve();

	expect(fetchSpy).toHaveBeenCalledTimes(callCount);

	warnSpy.mockRestore();
	errorSpy.mockRestore();
});

# 🚀Zerilog

Zerilog is a TypeScript logging framework inspired by Serilog, designed to provide a flexible and structured logging solution for TypeScript applications. It simplifies the process of logging, offering rich features and customization options to suit various logging needs.

## Features

-   🏗️ **Structured Logging**: Log messages with structured data to easily filter and search logs.
-   🚰 **Multiple "Zinks"**: Output logs to different destinations (console, file, HTTP, etc.).
-   ⚙️ **Configurable Enrichers**: Enrich log events with additional contextual information.
-   📊 **Support for Logging Levels**: Control the verbosity of logs with different logging levels (e.g., debug, info, warn, error).
-   📝 **Template-Based Messages**: Use template-based messages for consistent and readable logs.
-   🔄 **Asynchronous Logging**: Efficiently handle logging in asynchronous environments.

## Getting Started

To get started with Zerilog, install the package using npm:

```bash
npm install zerilog
yarn add zerilog
pnpm add zerilog
```

## Usage

Here's a quick example to get you started:

```ts
import { LoggerConfiguration } from "zerilog";

// A simple console zink to log events to the console.
// npm install @zerilog/consolezink
import ConsoleZink from "@zerilog/consolezink";

const logger = new LoggerConfiguration()
	.writeTo.sink(new ConsoleZink())
	.createLogger();

logger.information("Hello World");
logger.information("Support for {Variable} strings!", "Formatted");
```

## Implementing a Custom Zink

Zerilog allows you to define custom "zinks" (destinations for your logs). Here's a simple example of a console zink:

```ts
import { ILogZink, LogEvent } from "zerilog";

class ConsoleZink implements ILogZink {
	log(event: LogEvent): void {
		console.log(event.message.renderedMessage);
	}
}
```

## Contact

-   [Discord](https://discord.com/users/251026389371846656)
-   [Github](https://github.com/sh4dow8080)

## Acknowledgements

-   Heavily inspired by `Serilog`.

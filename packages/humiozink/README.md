# 🚀 @zerilog/humiozink

A zink for logging to `humio` using `zerilog`

## Getting Started

To get started with @zerilog/humiozink, install the package using npm:

```bash
npm install zerilog @zerilog/humiozink
pnpm add zerilog @zerilog/humiozink
yarn add zerilog @zerilog/humiozink
```

## Usage

Here's a quick example to get you started:
```ts
import { LoggerConfiguration } from 'zerilog'
import HumioZink from '@zerilog/humiozink'

const logger = new LoggerConfiguration()
                .writeTo.sink(new HumioZink({
                    ingestToken: "YOUR_INGEST_TOKEN"
                }))
                .createLogger();

logger.information("Hello World");
```

## Contact

- [Discord](https://discord.com/users/251026389371846656)
- [Github](https://github.com/sh4dow8080)
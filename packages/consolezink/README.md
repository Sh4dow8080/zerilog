# 🚀 @zerilog/consolezink

A simple console zink for `zerilog`.

## Getting Started

To get started with @zerilog/consolezink, install the package using npm:

```bash
npm install zerilog @zerilog/consolezink
pnpm add zerilog @zerilog/consolezink
yarn add zerilog @zerilog/consolezink
```

## Usage

Here's a quick example to get you started:
```ts
import { LoggerConfiguration } from 'zerilog'
import ConsoleZink from '@zerilog/consolezink'

const logger = new LoggerConfiguration()
                .writeTo.sink(new ConsoleZink())
                .createLogger();

logger.information("Hello World");
```

## Contact

- [Discord](https://discord.com/users/251026389371846656)
- [Github](https://github.com/sh4dow8080)
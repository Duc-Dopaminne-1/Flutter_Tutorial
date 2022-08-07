class Logger {
  log = (...params: any) => {
    console.log(params);
  };

  error = (...params: any) => {
    console.error(...params);
  };

  warn = (...params: any) => {
    console.warn(...params);
  };
}

const logger = new Logger();

export { logger, logger as default };

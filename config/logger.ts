import env from "#start/env";
import { defineConfig, targets } from "@adonisjs/core/logger";

const loggerConfig = defineConfig({
  default: "app",

  /**
   * The loggers object can be used to define multiple loggers.
   * By default, we configure only one logger (named "app").
   */
  loggers: {
    app: {
      enabled: true,
      name: "app",
      level: env.get("LOG_LEVEL"),
      transport: {
        targets: targets()
          // Write JSON logs to stdout in all environments
          .push(targets.file({ destination: 1 }))
          .toArray(),
      },
    },
  },
});

export default loggerConfig;

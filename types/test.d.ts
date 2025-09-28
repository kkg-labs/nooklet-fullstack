import "@japa/runner";
import type { ApiClient } from "@japa/api-client";

declare module "@japa/runner" {
  interface TestContext {
    client: ApiClient;
  }

  interface Group {
    each: {
      setup: (callback: () => Promise<(() => Promise<void>) | void>) => void;
    };
  }
}

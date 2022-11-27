export interface SetupApiSpecOptions {
  /** Where the docs page will be available through. Defaults to `/api`. */
  path?: string;
  /** Docs page title. */
  pageTitle?: string;
}

/**
 * A subset of `swagger-ui` options. Check out all the available options here:
 * {@link https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md}
 * while `@nestjs/swagger` lib do not define them.
 */
export interface SwaggerOptions {
  // ============================= Plugin system ============================= //
  /** An array of plugin functions to use in Swagger UI. */
  plugins: (() => unknown)[];

  // ================================ Display ================================ //
  /**
   * Controls the default expansion setting for the operations and tags.
   * It can be:
   * - `'list'` (expands only the tags)
   * - `'full'` (expands the tags and operations) or
   * - `'none'` (expands nothing).
   * Default: `'list'`
   */
  docExpansion?: 'list' | 'full' | 'none';

  /**
   * The default expansion depth for models (set to -1 completely hide the models)
   * Default: `1`.
   */
  defaultModelsExpandDepth?: number;

  /**
   * The default expansion depth for the model on the model-example section.
   * Default: `1`.
   */
  defaultModelExpandDepth?: number;

  /**
   * Controls how the model is shown when the API is first rendered.
   * (The user can always switch the rendering for a given model by clicking
   * the 'Model' and 'Example Value' links.)
   */
  defaultModelRendering: 'example' | 'model';

  /**
   * Controls the display of operationId in operations list.
   * Default: `false`
   */
  displayOperationId?: boolean;

  /**
   * Controls the display of the request duration (in milliseconds) for
   * "Try it out" requests.
   * Default: `false`
   */
  displayRequestDuration?: boolean;

  /**
   * Apply a sort to the operation list of each API. It can be `'alpha'`
   * (sort by paths alphanumerically), `'method'` (sort by HTTP method) or a
   * funciton.
   * Default is the order returned by the server unchanged.
   */
  operationsSorter?: 'alpha' | 'method' | (<T>(tagA: T, tagB: T) => number);

  /**
   * Provides a mechanism to be notified when Swagger UI has finished rendering
   * a newly provided definition.
   */
  onComplete?: () => void;

  /**
   * Apply a sort to the tag list of each API. It can be `'alpha'`
   * (sort by paths alphanumerically) or a function.
   * Two tag name strings are passed to the sorter for each pass.
   * Default is the order determined by Swagger UI.
   */
  tagsSorter?: 'alpha' | (<T>(tagA: T, tagB: T) => number);

  /** Activate syntax highlighting of payloads and curl command. */
  syntaxHighlight:
    | false
    | {
        /** Default: `true` */
        activate?: boolean;
        /** Default: `'agate'` */
        theme?: 'agate' | 'arta' | 'monokai' | 'nord' | 'obsidian' | 'tomorrow-night';
      };

  // ================================ Network ================================ //
  /**
   * Enables passing credentials, as defined in the Fetch standard, in CORS
   * requests that are sent by the browser.
   * Default: `false`
   */
  withCredentials?: boolean;
}

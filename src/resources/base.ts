import { StellarDsError } from '../errors.js';
import type { HttpClient, HttpRequest, HttpResult, ProjectRequestOptions, RequestOptions } from '../http.js';

/** What resources need from the client. */
export interface ClientContext {
  readonly http: HttpClient;
  readonly defaultProject: string | undefined;
}

export abstract class Resource {
  constructor(protected readonly ctx: ClientContext) {}

  protected project(options?: ProjectRequestOptions): string {
    const project = options?.project ?? this.ctx.defaultProject;
    if (!project) {
      throw new StellarDsError('No project id: pass { project } or set the `project` option on the client', { kind: 'config' });
    }
    return project;
  }

  protected send<T>(req: Omit<HttpRequest, 'signal' | 'timeoutMs'>, options?: RequestOptions): Promise<HttpResult<T>> {
    return this.ctx.http.send<T>({ ...req, signal: options?.signal, timeoutMs: options?.timeoutMs });
  }

  protected async data<T>(req: Omit<HttpRequest, 'signal' | 'timeoutMs'>, options?: RequestOptions): Promise<T> {
    return (await this.send<T>(req, options)).data;
  }

  /** For calls that act inside a project: adds `project` to the query string. */
  protected async inProject<T>(
    req: Omit<HttpRequest, 'signal' | 'timeoutMs'>,
    options?: ProjectRequestOptions,
    projectParam = 'project',
  ): Promise<T> {
    return this.data<T>({ ...req, query: { [projectParam]: this.project(options), ...req.query } }, options);
  }
}

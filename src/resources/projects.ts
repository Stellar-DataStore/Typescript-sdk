import type { ProjectRequestOptions, RequestOptions } from '../http.js';
import type {
  HttpLogEntry,
  OAuthDesign,
  OAuthDesignRequest,
  Project,
  ProjectInvitation,
  ProjectRequest,
  ProjectUsers,
  ProjectUsersParams,
  ProjectTier,
} from '../types.js';
import { Resource } from './base.js';

const PATH = '/v1/schema/project';

export class ProjectsResource extends Resource {
  /** Every project you have access to. */
  list(options?: RequestOptions): Promise<Project[]> {
    return this.data({ method: 'GET', path: PATH }, options);
  }

  /** One project; the client's default project when `project` is left out. */
  get(project?: string, options?: RequestOptions): Promise<Project> {
    return this.inProject({ method: 'GET', path: PATH }, { ...options, project: project ?? this.ctx.defaultProject });
  }

  create(request: ProjectRequest, options?: RequestOptions): Promise<Project> {
    return this.data({ method: 'POST', path: PATH, json: request }, options);
  }

  update(request: ProjectRequest, options?: ProjectRequestOptions): Promise<Project> {
    return this.inProject({ method: 'PUT', path: PATH, json: request }, options);
  }

  /** Deletes the project and all its data. `ownerId` lets an administrator delete someone else's project. */
  async delete(options?: ProjectRequestOptions & { ownerId?: string }): Promise<void> {
    await this.inProject({ method: 'DELETE', path: PATH, query: { ownerId: options?.ownerId } }, options);
  }

  /** Members of the project, optionally sorted and paged. */
  users(params: ProjectUsersParams = {}, options?: ProjectRequestOptions): Promise<ProjectUsers> {
    return this.inProject({ method: 'GET', path: `${PATH}/users`, query: { ...params } }, options);
  }

  userCount(options?: ProjectRequestOptions): Promise<number> {
    return this.inProject({ method: 'GET', path: `${PATH}/user-count` }, options);
  }

  invitedUsers(params: ProjectUsersParams = {}, options?: ProjectRequestOptions): Promise<ProjectInvitation[]> {
    return this.inProject({ method: 'GET', path: `${PATH}/invited-users`, query: { ...params } }, options);
  }

  /** Projects in which you have application access. */
  appAccess(options?: RequestOptions): Promise<Project[]> {
    return this.data({ method: 'GET', path: `${PATH}/app-access` }, options);
  }

  /** The HTTP request log of the project for one day. */
  log(logDate: Date | string, options?: ProjectRequestOptions): Promise<HttpLogEntry[]> {
    const date = typeof logDate === 'string' ? logDate : logDate.toISOString();
    return this.inProject({ method: 'GET', path: `${PATH}/project-log`, query: { logDate: date } }, options, 'id');
  }

  /** The design of the project's OAuth sign-in page. */
  getOAuthDesign(options?: ProjectRequestOptions): Promise<OAuthDesign> {
    return this.inProject({ method: 'GET', path: `${PATH}/oauth-design` }, options, 'projectid');
  }

  /** Saves the design of the project's OAuth sign-in page. `designId` is the `id` of the current design. */
  updateOAuthDesign(designId: string, design: OAuthDesignRequest, options?: ProjectRequestOptions): Promise<OAuthDesign> {
    return this.inProject(
      { method: 'POST', path: `${PATH}/oauth-design`, query: { id: designId }, json: design },
      options,
    );
  }
}

export class ProjectTiersResource extends Resource {
  /** The limits of the project's tier. */
  get(options?: ProjectRequestOptions): Promise<ProjectTier> {
    return this.inProject({ method: 'GET', path: '/v1/project-tier' }, options);
  }

  /** The project's current usage, in the same shape as the limits. */
  current(options?: ProjectRequestOptions): Promise<ProjectTier> {
    return this.inProject({ method: 'GET', path: '/v1/project-tier/current' }, options);
  }
}

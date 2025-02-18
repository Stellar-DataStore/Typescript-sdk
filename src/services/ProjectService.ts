import config from "../config";

export class ProjectService {
  constructor(private authToken: string) {}

  public async getProjectTier(projectId: string): Promise<any> {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/project-tier?project=${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error listing projects");
      }

      return await response.json();
    } catch (error) {
      console.error("Error listing projects", error);
      throw error;
    }
  }

  public async getProjectTierCurrent(projectId: string): Promise<any> {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/project-tier?project=${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error listing projects");
      }

      return await response.json();
    } catch (error) {
      console.error("Error listing projects", error);
      throw error;
    }
  }

  public async listProjects(): Promise<any> {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/project`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error listing projects");
      }

      return await response.json();
    } catch (error) {
      console.error("Error listing projects", error);
      throw error;
    }
  }

  public async updateProject(
    projectId: string,
    projectDetails: any
  ): Promise<any> {
    const updatedData = {
      name: projectDetails.name,
      description: projectDetails.description,
      isMultitenant: true,
    };

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/project?project=${projectId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating project");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating project", error);
      throw error;
    }
  }
}
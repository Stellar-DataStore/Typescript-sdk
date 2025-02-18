import config from "../config";

export class AuthService {
  async login(
    clientId: string,
    clientSecret: string,
    grantType: string = "client_credentials"
  ): Promise<string> {
    const params = new URLSearchParams();
    params.append("grant_type", grantType);
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/oauth/token`,
        {
          method: "POST",
          body: params,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("Login Error:", error);
      throw new Error("Failed to login");
    }
  }

  // Method to revoke an OAuth token
  async revokeToken(token: string) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/oauth/revoke`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token }),
        }
      );

      if (!response.ok) {
        throw new Error("Error revoking token");
      }

      console.log("Token revoked successfully");
      return await response.json();
    } catch (error) {
      console.error("Error revoking token:", error);
      throw error;
    }
  }

  /** User **/
  async getUserDetails(token: string) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching user details");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }

  async updateUserDetails(token: string, userDetails: any) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/user`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating user details");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating user details:", error);
      throw error;
    }
  }

  async deleteUserAccount(token: string) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/user`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting user account");
      }

      return await response.json();
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  }

  // Fetches user permissions
  async getUserPermissions(projectId: any, token: string) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/user/permissions?projectId=${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching user permissions");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      throw error;
    }
  }
}
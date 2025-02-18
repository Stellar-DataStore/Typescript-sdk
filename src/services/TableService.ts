import config from "../config";

export class TableService {
  private authToken: string;
  private projectId: string;

  constructor(authToken: string, projectId: string) {
    this.authToken = authToken;
    this.projectId = projectId;
  }

  /** Table **/
  async getTables(projectId: string) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/table?project=${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching table data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching table data:", error);
      throw error;
    }
  }

  async createTable(projectId: string, tableData: any) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/table?project=${projectId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: tableData.name,
            description: tableData.description,
            isMultitenant: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error creating table");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating table:", error);
      throw error;
    }
  }

  async updateTable(projectId: string, tableId: string, updatedData: any) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/table?project=${projectId}&table=${tableId}`,
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
        throw new Error("Error updating table");
      }

      console.log("Table updated successfully", await response.json());
      return await response.json();
    } catch (error) {
      console.error("Error updating table:", error);
      throw error;
    }
  }

  async deleteTable(projectId: string, tableId: string) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/table?project=${projectId}&table=${tableId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting table");
      }

      console.log("Table deleted successfully", await response.json());
      return await response.json();
    } catch (error) {
      console.error("Error deleting table:", error);
      throw error;
    }
  }

  /** Data **/
  async getTableData(projectId: string, tableId: number) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/data/table?project=${projectId}&table=${tableId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching table data");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching table data:", error);
      throw error;
    }
  }

  async addRecords(projectId: string, tableId: string, records: any[]) {
    try {
      const url = `${config.apiBaseUrl}/v1/data/table?project=${projectId}&table=${tableId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records }),
      });

      if (!response.ok) {
        throw new Error("Error adding records");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding records:", error);
      throw error;
    }
  }

  async deleteRecords(projectId: string, tableId: number, recordId: number) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/data/table?project=${projectId}&table=${tableId}&record=${recordId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting records");
      }
    } catch (error) {
      console.error("Error deleting records:", error);
      throw error;
    }
  }

  async updateRecords(
    projectId: string,
    tableId: number,
    idList: any[],
    record: any[]
  ) {
    try {
      const requestBody = {
        idList: idList,
        record: record,
      };

      const response = await fetch(
        `${config.apiBaseUrl}/v1/data/table?project=${projectId}&table=${tableId}&force=false`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating records");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating records:", error);
      throw error;
    }
  }

  async downloadBlob(
    projectId: string,
    tableId: number,
    recordId: number,
    fieldName: string
  ) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/data/table/blob?project=${projectId}&table=${tableId}&record=${recordId}&field=${fieldName}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error downloading blob");
      }

      return await response.blob();
    } catch (error) {
      console.error("Error downloading blob:", error);
      throw error;
    }
  }

  async uploadBlob(
    projectId: string,
    tableId: number,
    recordId: number,
    fieldName: string,
    file: File
  ) {
    const formData = new FormData();
    formData.append("data", file);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/data/table/blob?project=${projectId}&table=${tableId}&record=${recordId}&field=${fieldName}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error uploading blob");
      }

      return await response.json();
    } catch (error) {
      console.error("Error uploading blob:", error);
      throw error;
    }
  }

  async clearTable(projectId: string, tableId: number) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/data/table/clear?project=${projectId}&table=${tableId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error clearing table");
      }
    } catch (error) {
      console.error("Error clearing table:", error);
      throw error;
    }
  }

  /** Fields **/
  async getTableFields(projectId: string, tableId: number) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/table/field?project=${projectId}&table=${tableId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error fetching table fields");
      }

      return (await response.json()).data; // Adjust based on the actual API response structure
    } catch (error) {
      console.error("Error fetching table fields:", error);
      throw error;
    }
  }

  async addField(projectId: string, tableId: number, fieldData: any) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/table/field?project=${projectId}&table=${tableId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fieldData),
        }
      );

      if (!response.ok) {
        throw new Error("Error adding field");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding field:", error);
      throw error;
    }
  }

  async updateField(
    projectId: string,
    tableId: number,
    fieldDetails: any,
    fieldId: number
  ) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/table/field?project=${projectId}&table=${tableId}&field=${fieldId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fieldDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating field");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating field:", error);
      throw error;
    }
  }

  async deleteField(projectId: string, tableId: number, fieldId: number) {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/v1/schema/table/field?project=${projectId}&table=${tableId}&field=${fieldId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting field");
      }
    } catch (error) {
      console.error("Error deleting field:", error);
      throw error;
    }
  }
}

export default TableService;
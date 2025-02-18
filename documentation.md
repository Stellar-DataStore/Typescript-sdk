Sure, here is the documentation in Markdown format for the TableService.ts file:

# TableService

The `TableService` class provides methods to interact with the table-related endpoints of the Stellar DataStore API.

## Constructor

### `constructor(authToken: string, projectId: string)`

Creates an instance of the `TableService` class.

- `authToken` (string): The authentication token.
- `projectId` (string): The project ID.

## Methods

### `getTables(projectId: string): Promise<any>`

Fetches the list of tables for the specified project.

- `projectId` (string): The project ID.
- Returns: A promise that resolves to the list of tables.

### `createTable(projectId: string, tableData: any): Promise<any>`

Creates a new table in the specified project.

- `projectId` (string): The project ID.
- `tableData` (any): The data for the new table.
- Returns: A promise that resolves to the created table.

### `updateTable(projectId: string, tableId: string, updatedData: any): Promise<any>`

Updates an existing table in the specified project.

- `projectId` (string): The project ID.
- `tableId` (string): The table ID.
- `updatedData` (any): The updated data for the table.
- Returns: A promise that resolves to the updated table.

### `deleteTable(projectId: string, tableId: string): Promise<any>`

Deletes a table from the specified project.

- `projectId` (string): The project ID.
- `tableId` (string): The table ID.
- Returns: A promise that resolves to the deletion result.

### `getTableData(projectId: string, tableId: number): Promise<any>`

Fetches the data for a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- Returns: A promise that resolves to the table data.

### `addRecords(projectId: string, tableId: string, records: any[]): Promise<any>`

Adds records to a specific table.

- `projectId` (string): The project ID.
- `tableId` (string): The table ID.
- `records` (any[]): The records to add.
- Returns: A promise that resolves to the added records.

### `deleteRecords(projectId: string, tableId: number, recordId: number): Promise<void>`

Deletes records from a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- `recordId` (number): The record ID.
- Returns: A promise that resolves to void.

### `updateRecords(projectId: string, tableId: number, idList: any[], record: any[]): Promise<any>`

Updates records in a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- `idList` (any[]): The list of IDs to update.
- `record` (any[]): The updated record data.
- Returns: A promise that resolves to the updated records.

### `downloadBlob(projectId: string, tableId: number, recordId: number, fieldName: string): Promise<Blob>`

Downloads a blob from a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- `recordId` (number): The record ID.
- `fieldName` (string): The field name.
- Returns: A promise that resolves to the downloaded blob.

### `uploadBlob(projectId: string, tableId: number, recordId: number, fieldName: string, file: File): Promise<any>`

Uploads a blob to a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- `recordId` (number): The record ID.
- `fieldName` (string): The field name.
- `file` (File): The file to upload.
- Returns: A promise that resolves to the uploaded blob.

### `clearTable(projectId: string, tableId: number): Promise<void>`

Clears all data from a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- Returns: A promise that resolves to void.

### `getTableFields(projectId: string, tableId: number): Promise<any>`

Fetches the fields of a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- Returns: A promise that resolves to the table fields.

### `addField(projectId: string, tableId: number, fieldData: any): Promise<any>`

Adds a field to a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- `fieldData` (any): The data for the new field.
- Returns: A promise that resolves to the added field.

### `updateField(projectId: string, tableId: number, fieldDetails: any, fieldId: number): Promise<any>`

Updates a field in a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- `fieldDetails` (any): The updated field data.
- `fieldId` (number): The field ID.
- Returns: A promise that resolves to the updated field.

### `deleteField(projectId: string, tableId: number, fieldId: number): Promise<void>`

Deletes a field from a specific table.

- `projectId` (string): The project ID.
- `tableId` (number): The table ID.
- `fieldId` (number): The field ID.
- Returns: A promise that resolves to void.
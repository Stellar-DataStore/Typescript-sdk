# stellar_data_store

StellarDataStore - Typescript client for stellar_data_store
The Stellar DataStore service is your instantly available, secure and worry-free cloud data storage service. Sign-up now and minutes later, you can start putting your data in the cloud.

### Usage

```
import { ProjectService } from '@stellards_typescript_sdk';

const projectService = new ProjectService(authToken);

const request = {};

const response = await projectService.listProjects();
console.log(response.data);

```

Making API Calls
With the SDK authenticated, you can now start making API requests to interact with StellarDS data.

GET request
To fetch a list of tables from our database, use the following code:
```
import { TableService } from 'stellards_typescript_sdk';  
  
const tableService = new TableService(config.authToken, config.projectId);  
let response = await tableService.getTables(projectId);  
```

POST request
To add a record to a table is as simple as using the following code:

```
await tableService.addRecords(projectId, tableId, [newRecord]);  
```
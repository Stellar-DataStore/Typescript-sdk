# StellarDS_TSSDk.DataApi

All URIs are relative to *https://api.stellards.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1DataTableBlobGet**](DataApi.md#v1DataTableBlobGet) | **GET** /v1/data/table/blob | Download a file from a blob field as a stream.
[**v1DataTableBlobPost**](DataApi.md#v1DataTableBlobPost) | **POST** /v1/data/table/blob | Upload a file to a blob field.
[**v1DataTableClearDelete**](DataApi.md#v1DataTableClearDelete) | **DELETE** /v1/data/table/clear | Deletes all records from the given table.
[**v1DataTableDelete**](DataApi.md#v1DataTableDelete) | **DELETE** /v1/data/table | Deletes records from the given table.
[**v1DataTableDeletePost**](DataApi.md#v1DataTableDeletePost) | **POST** /v1/data/table/delete | Deletes records from the given table.
[**v1DataTableGet**](DataApi.md#v1DataTableGet) | **GET** /v1/data/table | Gets the records for a given table.
[**v1DataTablePost**](DataApi.md#v1DataTablePost) | **POST** /v1/data/table | Adds records to the given table.
[**v1DataTablePut**](DataApi.md#v1DataTablePut) | **PUT** /v1/data/table | Updates records in the given table based on the values in record.


# **v1DataTableBlobGet**
> Stream v1DataTableBlobGet()


### Example


```typescript
import { createConfiguration, DataApi } from '@StellarDS_TSSDk/api-client';
import type { DataApiV1DataTableBlobGetRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new DataApi(configuration);

const request: DataApiV1DataTableBlobGetRequest = {
    // The project containing the table.
  project: "project_example",
    // The table containing the records.
  table: 1,
    // The record to be queried.
  record: 1,
    // The field of the record.
  field: "field_example",
};

const data = await apiInstance.v1DataTableBlobGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table containing the records. | defaults to undefined
 **record** | [**number**] | The record to be queried. | defaults to undefined
 **field** | [**string**] | The field of the record. | defaults to undefined


### Return type

**Stream**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Returns the queried records. |  -  |
**400** | If the queries provided could not be parsed. |  -  |
**404** | If the given tables,  could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1DataTableBlobPost**
> Stream v1DataTableBlobPost()


### Example


```typescript
import { createConfiguration, DataApi } from '@StellarDS_TSSDk/api-client';
import type { DataApiV1DataTableBlobPostRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new DataApi(configuration);

const request: DataApiV1DataTableBlobPostRequest = {
    // The project containing the table.
  project: "project_example",
    // The table containing the records.
  table: 1,
    // The record to be queried.
  record: 1,
    // The field of the record.
  field: "field_example",
  
  data: { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
};

const data = await apiInstance.v1DataTableBlobPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table containing the records. | defaults to undefined
 **record** | [**number**] | The record to be queried. | defaults to undefined
 **field** | [**string**] | The field of the record. | defaults to undefined
 **data** | [**HttpFile**] |  | (optional) defaults to undefined


### Return type

**Stream**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Returns the queried records. |  -  |
**400** | If the queries provided could not be parsed. |  -  |
**404** | If the given tables,  could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1DataTableClearDelete**
> void v1DataTableClearDelete()


### Example


```typescript
import { createConfiguration, DataApi } from '@StellarDS_TSSDk/api-client';
import type { DataApiV1DataTableClearDeleteRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new DataApi(configuration);

const request: DataApiV1DataTableClearDeleteRequest = {
    // The project containing the table.
  project: "project_example",
    // The table to delete from.
  table: 1,
};

const data = await apiInstance.v1DataTableClearDelete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table to delete from. | defaults to undefined


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**404** | If the given table could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**200** |  |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1DataTableDelete**
> void v1DataTableDelete()


### Example


```typescript
import { createConfiguration, DataApi } from '@StellarDS_TSSDk/api-client';
import type { DataApiV1DataTableDeleteRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new DataApi(configuration);

const request: DataApiV1DataTableDeleteRequest = {
    // The project containing the table.
  project: "project_example",
    // Id of table where you want to delete a record.
  table: 1,
    // record id to delete. (optional)
  record: 1,
};

const data = await apiInstance.v1DataTableDelete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | Id of table where you want to delete a record. | defaults to undefined
 **record** | [**number**] | record id to delete. | (optional) defaults to undefined


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**404** | If the given table could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**200** |  |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1DataTableDeletePost**
> void v1DataTableDeletePost()


### Example


```typescript
import { createConfiguration, DataApi } from '@StellarDS_TSSDk/api-client';
import type { DataApiV1DataTableDeletePostRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new DataApi(configuration);

const request: DataApiV1DataTableDeletePostRequest = {
    // The project containing the table.
  project: "project_example",
    // The table to delete from.
  table: 1,
    // An array of ids (optional)
  requestBody: [
    "requestBody_example",
  ],
};

const data = await apiInstance.v1DataTableDeletePost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **requestBody** | **Array<string>**| An array of ids |
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table to delete from. | defaults to undefined


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**404** | If the given table could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**200** |  |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1DataTableGet**
> AbstractObjectQueryResult v1DataTableGet()


### Example


```typescript
import { createConfiguration, DataApi } from '@StellarDS_TSSDk/api-client';
import type { DataApiV1DataTableGetRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new DataApi(configuration);

const request: DataApiV1DataTableGetRequest = {
    // The project containing the table.
  project: "project_example",
    // Id of the table containing the records.
  table: 1,
    // The offset of the records. (optional)
  offset: 1,
    // The amount of records. (optional)
  take: 1,
    // The join queries to apply. (optional)
  joinQuery: "JoinQuery_example",
    // The where queries to apply. (optional)
  whereQuery: "WhereQuery_example",
    // The sort queries to apply. (optional)
  sortQuery: "SortQuery_example",
    //  (optional)
  distinct: false,
    //  (optional)
  select: "select_example",
};

const data = await apiInstance.v1DataTableGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | Id of the table containing the records. | defaults to undefined
 **offset** | [**number**] | The offset of the records. | (optional) defaults to undefined
 **take** | [**number**] | The amount of records. | (optional) defaults to undefined
 **joinQuery** | [**string**] | The join queries to apply. | (optional) defaults to undefined
 **whereQuery** | [**string**] | The where queries to apply. | (optional) defaults to undefined
 **sortQuery** | [**string**] | The sort queries to apply. | (optional) defaults to undefined
 **distinct** | [**boolean**] |  | (optional) defaults to false
 **select** | [**string**] |  | (optional) defaults to undefined


### Return type

**AbstractObjectQueryResult**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Returns the queried records. |  -  |
**400** | If the queries provided could not be parsed. |  -  |
**404** | If the given tables or fields could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1DataTablePost**
> AbstractObjectQueryResult v1DataTablePost()


### Example


```typescript
import { createConfiguration, DataApi } from '@StellarDS_TSSDk/api-client';
import type { DataApiV1DataTablePostRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new DataApi(configuration);

const request: DataApiV1DataTablePostRequest = {
    // The project containing the table.
  project: "project_example",
    // The table to be added to.
  table: 1,
    //  (optional)
  createRecordRequest: {
    records: [
      {
        "key": null,
      },
    ],
  },
};

const data = await apiInstance.v1DataTablePost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **createRecordRequest** | **CreateRecordRequest**|  |
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table to be added to. | defaults to undefined


### Return type

**AbstractObjectQueryResult**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Returns the newly created records. |  -  |
**404** | If the given tables or fields could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1DataTablePut**
> AbstractObjectQueryResult v1DataTablePut()


### Example


```typescript
import { createConfiguration, DataApi } from '@StellarDS_TSSDk/api-client';
import type { DataApiV1DataTablePutRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new DataApi(configuration);

const request: DataApiV1DataTablePutRequest = {
    // The project containing the table.
  project: "project_example",
    // The table to be updated in.
  table: 1,
    // If you are certain you want to update all your records in case no ids were included. (optional)
  force: false,
    //  (optional)
  updateRecordRequest: {
    idList: [
      null,
    ],
    record: {
      "key": null,
    },
  },
};

const data = await apiInstance.v1DataTablePut(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **updateRecordRequest** | **UpdateRecordRequest**|  |
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table to be updated in. | defaults to undefined
 **force** | [**boolean**] | If you are certain you want to update all your records in case no ids were included. | (optional) defaults to false


### Return type

**AbstractObjectQueryResult**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Returns the updated records. |  -  |
**404** | If the given tables or fields could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



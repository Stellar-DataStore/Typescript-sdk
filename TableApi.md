# StellarDS_TSSDk.TableApi

All URIs are relative to *https://api.stellards.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1SchemaTableDelete**](TableApi.md#v1SchemaTableDelete) | **DELETE** /v1/schema/table | Deletes a table from the database.
[**v1SchemaTableGet**](TableApi.md#v1SchemaTableGet) | **GET** /v1/schema/table | Gets table(s) from the logged in user.
[**v1SchemaTablePost**](TableApi.md#v1SchemaTablePost) | **POST** /v1/schema/table | Creates a new table in the database.
[**v1SchemaTablePut**](TableApi.md#v1SchemaTablePut) | **PUT** /v1/schema/table | Updates a table in the database.


# **v1SchemaTableDelete**
> void v1SchemaTableDelete()


### Example


```typescript
import { createConfiguration, TableApi } from '@StellarDS_TSSDk/api-client';
import type { TableApiV1SchemaTableDeleteRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new TableApi(configuration);

const request: TableApiV1SchemaTableDeleteRequest = {
    // The project containing the table.
  project: "project_example",
    // The table to be deleted.
  table: 1,
};

const data = await apiInstance.v1SchemaTableDelete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table to be deleted. | defaults to undefined


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**404** | If the given table could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**200** |  |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1SchemaTableGet**
> IServiceResult v1SchemaTableGet()


### Example


```typescript
import { createConfiguration, TableApi } from '@StellarDS_TSSDk/api-client';
import type { TableApiV1SchemaTableGetRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new TableApi(configuration);

const request: TableApiV1SchemaTableGetRequest = {
    // The project containing the table.
  project: "project_example",
    // name or id of the table to fetch (optional) (optional)
  table: "table_example",
};

const data = await apiInstance.v1SchemaTableGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**string**] | name or id of the table to fetch (optional) | (optional) defaults to undefined


### Return type

**IServiceResult**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Returns a list of tables. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1SchemaTablePost**
> AbstractObjectServiceResult v1SchemaTablePost()


### Example


```typescript
import { createConfiguration, TableApi } from '@StellarDS_TSSDk/api-client';
import type { TableApiV1SchemaTablePostRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new TableApi(configuration);

const request: TableApiV1SchemaTablePostRequest = {
    // The project containing the table.
  project: "project_example",
    //  (optional)
  tableRequest: {
    name: "name_example",
    description: "description_example",
    isMultitenant: true,
  },
};

const data = await apiInstance.v1SchemaTablePost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tableRequest** | **TableRequest**|  |
 **project** | [**string**] | The project containing the table. | defaults to undefined


### Return type

**AbstractObjectServiceResult**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Returns the newly created table. |  -  |
**400** | If the table name has already been defined in the database. |  -  |
**500** | If something went wrong in the database. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1SchemaTablePut**
> TableResponseIEnumerableServiceResult v1SchemaTablePut()


### Example


```typescript
import { createConfiguration, TableApi } from '@StellarDS_TSSDk/api-client';
import type { TableApiV1SchemaTablePutRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new TableApi(configuration);

const request: TableApiV1SchemaTablePutRequest = {
    // The project containing the table.
  project: "project_example",
    // The table to be updated. (optional)
  table: 1,
    //  (optional)
  tableRequest: {
    name: "name_example",
    description: "description_example",
    isMultitenant: true,
  },
};

const data = await apiInstance.v1SchemaTablePut(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tableRequest** | **TableRequest**|  |
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table to be updated. | (optional) defaults to undefined


### Return type

**TableResponseIEnumerableServiceResult**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Returns the updated table. |  -  |
**404** | If the given table could not be found. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



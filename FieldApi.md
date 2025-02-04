# StellarDS_TSSDk.FieldApi

All URIs are relative to *https://api.stellards.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1SchemaTableFieldDelete**](FieldApi.md#v1SchemaTableFieldDelete) | **DELETE** /v1/schema/table/field | Deletes the given field within the given table.
[**v1SchemaTableFieldGet**](FieldApi.md#v1SchemaTableFieldGet) | **GET** /v1/schema/table/field | Gets field(s) from given table.
[**v1SchemaTableFieldPost**](FieldApi.md#v1SchemaTableFieldPost) | **POST** /v1/schema/table/field | Adds a field to the given table.
[**v1SchemaTableFieldPut**](FieldApi.md#v1SchemaTableFieldPut) | **PUT** /v1/schema/table/field | Updates the given field in the given table.


# **v1SchemaTableFieldDelete**
> void v1SchemaTableFieldDelete()


### Example


```typescript
import { createConfiguration, FieldApi } from '@StellarDS_TSSDk/api-client';
import type { FieldApiV1SchemaTableFieldDeleteRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new FieldApi(configuration);

const request: FieldApiV1SchemaTableFieldDeleteRequest = {
    // The project containing the table.
  project: "project_example",
    // The table containing the given field.
  table: 1,
    // The field to be deleted
  field: 1,
};

const data = await apiInstance.v1SchemaTableFieldDelete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table containing the given field. | defaults to undefined
 **field** | [**number**] | The field to be deleted | defaults to undefined


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
**404** | If the given table or field could not be found. |  -  |
**500** | If something went wrong in the database. |  -  |
**200** |  |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1SchemaTableFieldGet**
> IServiceResult v1SchemaTableFieldGet()


### Example


```typescript
import { createConfiguration, FieldApi } from '@StellarDS_TSSDk/api-client';
import type { FieldApiV1SchemaTableFieldGetRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new FieldApi(configuration);

const request: FieldApiV1SchemaTableFieldGetRequest = {
    // The project containing the table.
  project: "project_example",
    // The table containing the fields.
  table: 1,
    // The optional field to get. (optional)
  field: 1,
};

const data = await apiInstance.v1SchemaTableFieldGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table containing the fields. | defaults to undefined
 **field** | [**number**] | The optional field to get. | (optional) defaults to undefined


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
**200** | Returns a list of fields. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1SchemaTableFieldPost**
> FieldResponseServiceResult v1SchemaTableFieldPost()


### Example


```typescript
import { createConfiguration, FieldApi } from '@StellarDS_TSSDk/api-client';
import type { FieldApiV1SchemaTableFieldPostRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new FieldApi(configuration);

const request: FieldApiV1SchemaTableFieldPostRequest = {
    // The project containing the table.
  project: "project_example",
    // The table to be added to.
  table: 1,
    //  (optional)
  fieldRequest: {
    name: "name_example",
    type: "type_example",
  },
};

const data = await apiInstance.v1SchemaTableFieldPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fieldRequest** | **FieldRequest**|  |
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table to be added to. | defaults to undefined


### Return type

**FieldResponseServiceResult**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Returns the newly created field. |  -  |
**400** | If the field name has already been defined in the database. |  -  |
**500** | If something went wrong in the database. |  -  |
**401** | If the user is not signed in. |  -  |
**404** | If the given table or field type could not be found. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1SchemaTableFieldPut**
> FieldResponseServiceResult v1SchemaTableFieldPut()


### Example


```typescript
import { createConfiguration, FieldApi } from '@StellarDS_TSSDk/api-client';
import type { FieldApiV1SchemaTableFieldPutRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new FieldApi(configuration);

const request: FieldApiV1SchemaTableFieldPutRequest = {
    // The project containing the table.
  project: "project_example",
    // The table containing the field.
  table: 1,
    // The field to be updated.
  field: 1,
    //  (optional)
  fieldRequest: {
    name: "name_example",
    type: "type_example",
  },
};

const data = await apiInstance.v1SchemaTableFieldPut(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **fieldRequest** | **FieldRequest**|  |
 **project** | [**string**] | The project containing the table. | defaults to undefined
 **table** | [**number**] | The table containing the field. | defaults to undefined
 **field** | [**number**] | The field to be updated. | defaults to undefined


### Return type

**FieldResponseServiceResult**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Returns the updated field. |  -  |
**400** | If the field name has already been defined in the database. |  -  |
**500** | If something went wrong in the database. |  -  |
**401** | If the user is not signed in. |  -  |
**404** | If the given table, field or field type could not be found. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



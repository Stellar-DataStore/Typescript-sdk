# StellarDS_TSSDk.ProjectApi

All URIs are relative to *https://api.stellards.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1SchemaProjectGet**](ProjectApi.md#v1SchemaProjectGet) | **GET** /v1/schema/project | Gets project(s) from the logged in user.
[**v1SchemaProjectPut**](ProjectApi.md#v1SchemaProjectPut) | **PUT** /v1/schema/project | Updates a project.


# **v1SchemaProjectGet**
> IServiceResult v1SchemaProjectGet()


### Example


```typescript
import { createConfiguration, ProjectApi } from '@StellarDS_TSSDk/api-client';
import type { ProjectApiV1SchemaProjectGetRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new ProjectApi(configuration);

const request: ProjectApiV1SchemaProjectGetRequest = {
    // The optional project guid to be fetched. (optional)
  project: "project_example",
};

const data = await apiInstance.v1SchemaProjectGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] | The optional project guid to be fetched. | (optional) defaults to undefined


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
**200** | Returns a list of projects. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1SchemaProjectPut**
> TableResponseIEnumerableServiceResult v1SchemaProjectPut()


### Example


```typescript
import { createConfiguration, ProjectApi } from '@StellarDS_TSSDk/api-client';
import type { ProjectApiV1SchemaProjectPutRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new ProjectApi(configuration);

const request: ProjectApiV1SchemaProjectPutRequest = {
    // The project to be updated.
  project: "project_example",
    //  (optional)
  projectRequest: {
    name: "name_example",
    description: "description_example",
    isMultitenant: true,
    allowNewUsers: true,
  },
};

const data = await apiInstance.v1SchemaProjectPut(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectRequest** | **ProjectRequest**|  |
 **project** | [**string**] | The project to be updated. | defaults to undefined


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
**200** | Returns the updated project. |  -  |
**404** | If the given project could not be found. |  -  |
**401** | If the user is not signed in. |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



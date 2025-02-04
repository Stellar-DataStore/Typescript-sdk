# StellarDS_TSSDk.ProjectTierApi

All URIs are relative to *https://api.stellards.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1ProjectTierCurrentGet**](ProjectTierApi.md#v1ProjectTierCurrentGet) | **GET** /v1/project-tier/current | 
[**v1ProjectTierGet**](ProjectTierApi.md#v1ProjectTierGet) | **GET** /v1/project-tier | 


# **v1ProjectTierCurrentGet**
> IServiceResult v1ProjectTierCurrentGet()


### Example


```typescript
import { createConfiguration, ProjectTierApi } from '@StellarDS_TSSDk/api-client';
import type { ProjectTierApiV1ProjectTierCurrentGetRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new ProjectTierApi(configuration);

const request: ProjectTierApiV1ProjectTierCurrentGetRequest = {
  
  project: "project_example",
};

const data = await apiInstance.v1ProjectTierCurrentGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] |  | defaults to undefined


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
**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1ProjectTierGet**
> IServiceResult v1ProjectTierGet()


### Example


```typescript
import { createConfiguration, ProjectTierApi } from '@StellarDS_TSSDk/api-client';
import type { ProjectTierApiV1ProjectTierGetRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new ProjectTierApi(configuration);

const request: ProjectTierApiV1ProjectTierGetRequest = {
  
  project: "project_example",
};

const data = await apiInstance.v1ProjectTierGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **project** | [**string**] |  | defaults to undefined


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
**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



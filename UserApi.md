# StellarDS_TSSDk.UserApi

All URIs are relative to *https://api.stellards.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1UserDelete**](UserApi.md#v1UserDelete) | **DELETE** /v1/user | 
[**v1UserGet**](UserApi.md#v1UserGet) | **GET** /v1/user | 
[**v1UserPermissionsGet**](UserApi.md#v1UserPermissionsGet) | **GET** /v1/user/permissions | 


# **v1UserDelete**
> IServiceResult v1UserDelete()


### Example


```typescript
import { createConfiguration, UserApi } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new UserApi(configuration);

const request = {};

const data = await apiInstance.v1UserDelete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


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

# **v1UserGet**
> IServiceResult v1UserGet()


### Example


```typescript
import { createConfiguration, UserApi } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new UserApi(configuration);

const request = {};

const data = await apiInstance.v1UserGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


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

# **v1UserPermissionsGet**
> IServiceResult v1UserPermissionsGet()


### Example


```typescript
import { createConfiguration, UserApi } from '@StellarDS_TSSDk/api-client';
import type { UserApiV1UserPermissionsGetRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new UserApi(configuration);

const request: UserApiV1UserPermissionsGetRequest = {
  
  projectId: "projectId_example",
};

const data = await apiInstance.v1UserPermissionsGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **projectId** | [**string**] |  | defaults to undefined


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



# StellarDS_TSSDk.TestApi

All URIs are relative to *https://api.stellards.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1PingGet**](TestApi.md#v1PingGet) | **GET** /v1/ping | 


# **v1PingGet**
> void v1PingGet()


### Example


```typescript
import { createConfiguration, TestApi } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new TestApi(configuration);

const request = {};

const data = await apiInstance.v1PingGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



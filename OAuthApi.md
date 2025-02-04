# StellarDS_TSSDk.OAuthApi

All URIs are relative to *https://api.stellards.io*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1OauthRevokePost**](OAuthApi.md#v1OauthRevokePost) | **POST** /v1/oauth/revoke | 
[**v1OauthTokenPost**](OAuthApi.md#v1OauthTokenPost) | **POST** /v1/oauth/token | 


# **v1OauthRevokePost**
> void v1OauthRevokePost(revokeTokenRequest)


### Example


```typescript
import { createConfiguration, OAuthApi } from '@StellarDS_TSSDk/api-client';
import type { OAuthApiV1OauthRevokePostRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new OAuthApi(configuration);

const request: OAuthApiV1OauthRevokePostRequest = {
  
  revokeTokenRequest: {
    refreshToken: "refreshToken_example",
    clientId: "clientId_example",
    clientSecret: "clientSecret_example",
  },
};

const data = await apiInstance.v1OauthRevokePost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **revokeTokenRequest** | **RevokeTokenRequest**|  |


### Return type

**void**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **v1OauthTokenPost**
> TokenResponse v1OauthTokenPost()


### Example


```typescript
import { createConfiguration, OAuthApi } from '@StellarDS_TSSDk/api-client';
import type { OAuthApiV1OauthTokenPostRequest } from '@StellarDS_TSSDk/api-client';

const configuration = createConfiguration();
const apiInstance = new OAuthApi(configuration);

const request: OAuthApiV1OauthTokenPostRequest = {
  
  grantType: "grantType_example",
  
  clientId: "clientId_example",
  
  clientSecret: "clientSecret_example",
  
  redirectUri: "",
  
  code: "",
  
  refreshToken: "",
};

const data = await apiInstance.v1OauthTokenPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **grantType** | [**string**] |  | defaults to undefined
 **clientId** | [**string**] |  | defaults to undefined
 **clientSecret** | [**string**] |  | defaults to undefined
 **redirectUri** | [**string**] |  | (optional) defaults to ''
 **code** | [**string**] |  | (optional) defaults to ''
 **refreshToken** | [**string**] |  | (optional) defaults to ''


### Return type

**TokenResponse**

### Authorization

[Bearer](README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/x-www-form-urlencoded
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)



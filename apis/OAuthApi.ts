// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { RevokeTokenRequest } from '../models/RevokeTokenRequest';
import { TokenResponse } from '../models/TokenResponse';

/**
 * no description
 */
export class OAuthApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * @param revokeTokenRequest 
     */
    public async v1OauthRevokePost(revokeTokenRequest: RevokeTokenRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'revokeTokenRequest' is not null or undefined
        if (revokeTokenRequest === null || revokeTokenRequest === undefined) {
            throw new RequiredError("OAuthApi", "v1OauthRevokePost", "revokeTokenRequest");
        }


        // Path Params
        const localVarPath = '/v1/oauth/revoke';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json",
        
            "text/json",
        
            "application/*+json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(revokeTokenRequest, "RevokeTokenRequest", ""),
            contentType
        );
        requestContext.setBody(serializedBody);

        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["Bearer"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * @param grantType 
     * @param clientId 
     * @param clientSecret 
     * @param redirectUri 
     * @param code 
     * @param refreshToken 
     */
    public async v1OauthTokenPost(grantType: string, clientId: string, clientSecret: string, redirectUri?: string, code?: string, refreshToken?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'grantType' is not null or undefined
        if (grantType === null || grantType === undefined) {
            throw new RequiredError("OAuthApi", "v1OauthTokenPost", "grantType");
        }


        // verify required parameter 'clientId' is not null or undefined
        if (clientId === null || clientId === undefined) {
            throw new RequiredError("OAuthApi", "v1OauthTokenPost", "clientId");
        }


        // verify required parameter 'clientSecret' is not null or undefined
        if (clientSecret === null || clientSecret === undefined) {
            throw new RequiredError("OAuthApi", "v1OauthTokenPost", "clientSecret");
        }





        // Path Params
        const localVarPath = '/v1/oauth/token';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Form Params
        const useForm = canConsumeForm([
            'application/x-www-form-urlencoded',
        ]);

        let localVarFormParams
        if (useForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new URLSearchParams();
        }

        if (grantType !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('grant_type', grantType as any);
        }
        if (clientId !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('client_id', clientId as any);
        }
        if (clientSecret !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('client_secret', clientSecret as any);
        }
        if (redirectUri !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('redirect_uri', redirectUri as any);
        }
        if (code !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('code', code as any);
        }
        if (refreshToken !== undefined) {
             // TODO: replace .append with .set
             localVarFormParams.append('refresh_token', refreshToken as any);
        }

        requestContext.setBody(localVarFormParams);

        if(!useForm) {
            const contentType = ObjectSerializer.getPreferredMediaType([
                "application/x-www-form-urlencoded"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
        }

        let authMethod: SecurityAuthentication | undefined;
        // Apply auth methods
        authMethod = _config.authMethods["Bearer"]
        if (authMethod?.applySecurityAuthentication) {
            await authMethod?.applySecurityAuthentication(requestContext);
        }
        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class OAuthApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1OauthRevokePost
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1OauthRevokePostWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1OauthTokenPost
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1OauthTokenPostWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TokenResponse >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: TokenResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "TokenResponse", ""
            ) as TokenResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: TokenResponse = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "TokenResponse", ""
            ) as TokenResponse;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}

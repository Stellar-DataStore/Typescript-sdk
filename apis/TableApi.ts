// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { AbstractObjectServiceResult } from '../models/AbstractObjectServiceResult';
import { IServiceResult } from '../models/IServiceResult';
import { ServiceResult } from '../models/ServiceResult';
import { TableRequest } from '../models/TableRequest';
import { TableResponseIEnumerableServiceResult } from '../models/TableResponseIEnumerableServiceResult';

/**
 * no description
 */
export class TableApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Deletes a table from the database.
     * @param project The project containing the table.
     * @param table The table to be deleted.
     */
    public async v1SchemaTableDelete(project: string, table: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("TableApi", "v1SchemaTableDelete", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("TableApi", "v1SchemaTableDelete", "table");
        }


        // Path Params
        const localVarPath = '/v1/schema/table';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int32"));
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

    /**
     * Gets table(s) from the logged in user.
     * @param project The project containing the table.
     * @param table name or id of the table to fetch (optional)
     */
    public async v1SchemaTableGet(project: string, table?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("TableApi", "v1SchemaTableGet", "project");
        }



        // Path Params
        const localVarPath = '/v1/schema/table';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "string", ""));
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

    /**
     * Creates a new table in the database.
     * @param project The project containing the table.
     * @param tableRequest 
     */
    public async v1SchemaTablePost(project: string, tableRequest?: TableRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("TableApi", "v1SchemaTablePost", "project");
        }



        // Path Params
        const localVarPath = '/v1/schema/table';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json",
        
            "text/json",
        
            "application/*+json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(tableRequest, "TableRequest", ""),
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
     * Updates a table in the database.
     * @param project The project containing the table.
     * @param table The table to be updated.
     * @param tableRequest 
     */
    public async v1SchemaTablePut(project: string, table?: number, tableRequest?: TableRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("TableApi", "v1SchemaTablePut", "project");
        }




        // Path Params
        const localVarPath = '/v1/schema/table';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int32"));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json",
        
            "text/json",
        
            "application/*+json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(tableRequest, "TableRequest", ""),
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

}

export class TableApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1SchemaTableDelete
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1SchemaTableDeleteWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the given table could not be found.", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If something went wrong in the database.", body, response.headers);
        }
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "If the user is not signed in.", undefined, response.headers);
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
     * @params response Response returned by the server for a request to v1SchemaTableGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1SchemaTableGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<IServiceResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: IServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "IServiceResult", ""
            ) as IServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "If the user is not signed in.", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: IServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "IServiceResult", ""
            ) as IServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1SchemaTablePost
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1SchemaTablePostWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AbstractObjectServiceResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("201", response.httpStatusCode)) {
            const body: AbstractObjectServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AbstractObjectServiceResult", ""
            ) as AbstractObjectServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the table name has already been defined in the database.", body, response.headers);
        }
        if (isCodeInRange("500", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If something went wrong in the database.", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "If the user is not signed in.", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: AbstractObjectServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AbstractObjectServiceResult", ""
            ) as AbstractObjectServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1SchemaTablePut
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1SchemaTablePutWithHttpInfo(response: ResponseContext): Promise<HttpInfo<TableResponseIEnumerableServiceResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: TableResponseIEnumerableServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "TableResponseIEnumerableServiceResult", ""
            ) as TableResponseIEnumerableServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the given table could not be found.", body, response.headers);
        }
        if (isCodeInRange("401", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "If the user is not signed in.", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: TableResponseIEnumerableServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "TableResponseIEnumerableServiceResult", ""
            ) as TableResponseIEnumerableServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}

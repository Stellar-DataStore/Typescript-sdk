// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { FieldRequest } from '../models/FieldRequest';
import { FieldResponseServiceResult } from '../models/FieldResponseServiceResult';
import { IServiceResult } from '../models/IServiceResult';
import { ServiceResult } from '../models/ServiceResult';

/**
 * no description
 */
export class FieldApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Deletes the given field within the given table.
     * @param project The project containing the table.
     * @param table The table containing the given field.
     * @param field The field to be deleted
     */
    public async v1SchemaTableFieldDelete(project: string, table: number, field: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldDelete", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldDelete", "table");
        }


        // verify required parameter 'field' is not null or undefined
        if (field === null || field === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldDelete", "field");
        }


        // Path Params
        const localVarPath = '/v1/schema/table/field';

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

        // Query Params
        if (field !== undefined) {
            requestContext.setQueryParam("field", ObjectSerializer.serialize(field, "number", "int32"));
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
     * Gets field(s) from given table.
     * @param project The project containing the table.
     * @param table The table containing the fields.
     * @param field The optional field to get.
     */
    public async v1SchemaTableFieldGet(project: string, table: number, field?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldGet", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldGet", "table");
        }



        // Path Params
        const localVarPath = '/v1/schema/table/field';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int32"));
        }

        // Query Params
        if (field !== undefined) {
            requestContext.setQueryParam("field", ObjectSerializer.serialize(field, "number", "int32"));
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
     * Adds a field to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param fieldRequest 
     */
    public async v1SchemaTableFieldPost(project: string, table: number, fieldRequest?: FieldRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldPost", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldPost", "table");
        }



        // Path Params
        const localVarPath = '/v1/schema/table/field';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
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
            ObjectSerializer.serialize(fieldRequest, "FieldRequest", ""),
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
     * Updates the given field in the given table.
     * @param project The project containing the table.
     * @param table The table containing the field.
     * @param field The field to be updated.
     * @param fieldRequest 
     */
    public async v1SchemaTableFieldPut(project: string, table: number, field: number, fieldRequest?: FieldRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldPut", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldPut", "table");
        }


        // verify required parameter 'field' is not null or undefined
        if (field === null || field === undefined) {
            throw new RequiredError("FieldApi", "v1SchemaTableFieldPut", "field");
        }



        // Path Params
        const localVarPath = '/v1/schema/table/field';

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

        // Query Params
        if (field !== undefined) {
            requestContext.setQueryParam("field", ObjectSerializer.serialize(field, "number", "int32"));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json",
        
            "text/json",
        
            "application/*+json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(fieldRequest, "FieldRequest", ""),
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

export class FieldApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1SchemaTableFieldDelete
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1SchemaTableFieldDeleteWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the given table or field could not be found.", body, response.headers);
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
     * @params response Response returned by the server for a request to v1SchemaTableFieldGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1SchemaTableFieldGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<IServiceResult >> {
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
     * @params response Response returned by the server for a request to v1SchemaTableFieldPost
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1SchemaTableFieldPostWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FieldResponseServiceResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("201", response.httpStatusCode)) {
            const body: FieldResponseServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FieldResponseServiceResult", ""
            ) as FieldResponseServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the field name has already been defined in the database.", body, response.headers);
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
        if (isCodeInRange("404", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "If the given table or field type could not be found.", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: FieldResponseServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FieldResponseServiceResult", ""
            ) as FieldResponseServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1SchemaTableFieldPut
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1SchemaTableFieldPutWithHttpInfo(response: ResponseContext): Promise<HttpInfo<FieldResponseServiceResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: FieldResponseServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FieldResponseServiceResult", ""
            ) as FieldResponseServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the field name has already been defined in the database.", body, response.headers);
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
        if (isCodeInRange("404", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "If the given table, field or field type could not be found.", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: FieldResponseServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "FieldResponseServiceResult", ""
            ) as FieldResponseServiceResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}

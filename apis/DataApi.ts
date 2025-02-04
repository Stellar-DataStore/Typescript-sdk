// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { AbstractObjectQueryResult } from '../models/AbstractObjectQueryResult';
import { CreateRecordRequest } from '../models/CreateRecordRequest';
import { ServiceResult } from '../models/ServiceResult';
import { Stream } from '../models/Stream';
import { UpdateRecordRequest } from '../models/UpdateRecordRequest';

/**
 * no description
 */
export class DataApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Download a file from a blob field as a stream.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     */
    public async v1DataTableBlobGet(project: string, table: number, record: number, field: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("DataApi", "v1DataTableBlobGet", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("DataApi", "v1DataTableBlobGet", "table");
        }


        // verify required parameter 'record' is not null or undefined
        if (record === null || record === undefined) {
            throw new RequiredError("DataApi", "v1DataTableBlobGet", "record");
        }


        // verify required parameter 'field' is not null or undefined
        if (field === null || field === undefined) {
            throw new RequiredError("DataApi", "v1DataTableBlobGet", "field");
        }


        // Path Params
        const localVarPath = '/v1/data/table/blob';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int64"));
        }

        // Query Params
        if (record !== undefined) {
            requestContext.setQueryParam("record", ObjectSerializer.serialize(record, "number", "int64"));
        }

        // Query Params
        if (field !== undefined) {
            requestContext.setQueryParam("field", ObjectSerializer.serialize(field, "string", ""));
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
     * Upload a file to a blob field.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     * @param data 
     */
    public async v1DataTableBlobPost(project: string, table: number, record: number, field: string, data?: HttpFile, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("DataApi", "v1DataTableBlobPost", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("DataApi", "v1DataTableBlobPost", "table");
        }


        // verify required parameter 'record' is not null or undefined
        if (record === null || record === undefined) {
            throw new RequiredError("DataApi", "v1DataTableBlobPost", "record");
        }


        // verify required parameter 'field' is not null or undefined
        if (field === null || field === undefined) {
            throw new RequiredError("DataApi", "v1DataTableBlobPost", "field");
        }



        // Path Params
        const localVarPath = '/v1/data/table/blob';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int64"));
        }

        // Query Params
        if (record !== undefined) {
            requestContext.setQueryParam("record", ObjectSerializer.serialize(record, "number", "int64"));
        }

        // Query Params
        if (field !== undefined) {
            requestContext.setQueryParam("field", ObjectSerializer.serialize(field, "string", ""));
        }

        // Form Params
        const useForm = canConsumeForm([
            'multipart/form-data',
        ]);

        let localVarFormParams
        if (useForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new URLSearchParams();
        }

        if (data !== undefined) {
             // TODO: replace .append with .set
             if (localVarFormParams instanceof FormData) {
                 localVarFormParams.append('data', data, data.name);
             }
        }

        requestContext.setBody(localVarFormParams);

        if(!useForm) {
            const contentType = ObjectSerializer.getPreferredMediaType([
                "multipart/form-data"
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

    /**
     * Deletes all records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     */
    public async v1DataTableClearDelete(project: string, table: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("DataApi", "v1DataTableClearDelete", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("DataApi", "v1DataTableClearDelete", "table");
        }


        // Path Params
        const localVarPath = '/v1/data/table/clear';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int64"));
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
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table Id of table where you want to delete a record.
     * @param record record id to delete.
     */
    public async v1DataTableDelete(project: string, table: number, record?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("DataApi", "v1DataTableDelete", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("DataApi", "v1DataTableDelete", "table");
        }



        // Path Params
        const localVarPath = '/v1/data/table';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.DELETE);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int64"));
        }

        // Query Params
        if (record !== undefined) {
            requestContext.setQueryParam("record", ObjectSerializer.serialize(record, "number", "int32"));
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
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     * @param requestBody An array of ids
     */
    public async v1DataTableDeletePost(project: string, table: number, requestBody?: Array<string>, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("DataApi", "v1DataTableDeletePost", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("DataApi", "v1DataTableDeletePost", "table");
        }



        // Path Params
        const localVarPath = '/v1/data/table/delete';

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
            ObjectSerializer.serialize(requestBody, "Array<string>", ""),
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
     * Gets the records for a given table.
     * @param project The project containing the table.
     * @param table Id of the table containing the records.
     * @param offset The offset of the records.
     * @param take The amount of records.
     * @param joinQuery The join queries to apply.
     * @param whereQuery The where queries to apply.
     * @param sortQuery The sort queries to apply.
     * @param distinct 
     * @param select 
     */
    public async v1DataTableGet(project: string, table: number, offset?: number, take?: number, joinQuery?: string, whereQuery?: string, sortQuery?: string, distinct?: boolean, select?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("DataApi", "v1DataTableGet", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("DataApi", "v1DataTableGet", "table");
        }









        // Path Params
        const localVarPath = '/v1/data/table';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int64"));
        }

        // Query Params
        if (offset !== undefined) {
            requestContext.setQueryParam("Offset", ObjectSerializer.serialize(offset, "number", "int64"));
        }

        // Query Params
        if (take !== undefined) {
            requestContext.setQueryParam("Take", ObjectSerializer.serialize(take, "number", "int64"));
        }

        // Query Params
        if (joinQuery !== undefined) {
            requestContext.setQueryParam("JoinQuery", ObjectSerializer.serialize(joinQuery, "string", ""));
        }

        // Query Params
        if (whereQuery !== undefined) {
            requestContext.setQueryParam("WhereQuery", ObjectSerializer.serialize(whereQuery, "string", ""));
        }

        // Query Params
        if (sortQuery !== undefined) {
            requestContext.setQueryParam("SortQuery", ObjectSerializer.serialize(sortQuery, "string", ""));
        }

        // Query Params
        if (distinct !== undefined) {
            requestContext.setQueryParam("distinct", ObjectSerializer.serialize(distinct, "boolean", ""));
        }

        // Query Params
        if (select !== undefined) {
            requestContext.setQueryParam("select", ObjectSerializer.serialize(select, "string", ""));
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
     * Adds records to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param createRecordRequest 
     */
    public async v1DataTablePost(project: string, table: number, createRecordRequest?: CreateRecordRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("DataApi", "v1DataTablePost", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("DataApi", "v1DataTablePost", "table");
        }



        // Path Params
        const localVarPath = '/v1/data/table';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int64"));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json",
        
            "text/json",
        
            "application/*+json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(createRecordRequest, "CreateRecordRequest", ""),
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
     * Updates records in the given table based on the values in record.
     * @param project The project containing the table.
     * @param table The table to be updated in.
     * @param force If you are certain you want to update all your records in case no ids were included.
     * @param updateRecordRequest 
     */
    public async v1DataTablePut(project: string, table: number, force?: boolean, updateRecordRequest?: UpdateRecordRequest, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'project' is not null or undefined
        if (project === null || project === undefined) {
            throw new RequiredError("DataApi", "v1DataTablePut", "project");
        }


        // verify required parameter 'table' is not null or undefined
        if (table === null || table === undefined) {
            throw new RequiredError("DataApi", "v1DataTablePut", "table");
        }




        // Path Params
        const localVarPath = '/v1/data/table';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.PUT);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (project !== undefined) {
            requestContext.setQueryParam("project", ObjectSerializer.serialize(project, "string", "uuid"));
        }

        // Query Params
        if (table !== undefined) {
            requestContext.setQueryParam("table", ObjectSerializer.serialize(table, "number", "int64"));
        }

        // Query Params
        if (force !== undefined) {
            requestContext.setQueryParam("force", ObjectSerializer.serialize(force, "boolean", ""));
        }


        // Body Params
        const contentType = ObjectSerializer.getPreferredMediaType([
            "application/json",
        
            "text/json",
        
            "application/*+json"
        ]);
        requestContext.setHeaderParam("Content-Type", contentType);
        const serializedBody = ObjectSerializer.stringify(
            ObjectSerializer.serialize(updateRecordRequest, "UpdateRecordRequest", ""),
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

export class DataApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1DataTableBlobGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1DataTableBlobGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Stream >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Stream = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Stream", ""
            ) as Stream;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the queries provided could not be parsed.", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the given tables,  could not be found.", body, response.headers);
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
            const body: Stream = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Stream", ""
            ) as Stream;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1DataTableBlobPost
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1DataTableBlobPostWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Stream >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Stream = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Stream", ""
            ) as Stream;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the queries provided could not be parsed.", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the given tables,  could not be found.", body, response.headers);
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
            const body: Stream = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Stream", ""
            ) as Stream;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1DataTableClearDelete
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1DataTableClearDeleteWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
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
     * @params response Response returned by the server for a request to v1DataTableDelete
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1DataTableDeleteWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
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
     * @params response Response returned by the server for a request to v1DataTableDeletePost
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1DataTableDeletePostWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
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
     * @params response Response returned by the server for a request to v1DataTableGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1DataTableGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AbstractObjectQueryResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: AbstractObjectQueryResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AbstractObjectQueryResult", ""
            ) as AbstractObjectQueryResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the queries provided could not be parsed.", body, response.headers);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the given tables or fields could not be found.", body, response.headers);
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
            const body: AbstractObjectQueryResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AbstractObjectQueryResult", ""
            ) as AbstractObjectQueryResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1DataTablePost
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1DataTablePostWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AbstractObjectQueryResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("201", response.httpStatusCode)) {
            const body: AbstractObjectQueryResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AbstractObjectQueryResult", ""
            ) as AbstractObjectQueryResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the given tables or fields could not be found.", body, response.headers);
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
            const body: AbstractObjectQueryResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AbstractObjectQueryResult", ""
            ) as AbstractObjectQueryResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1DataTablePut
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1DataTablePutWithHttpInfo(response: ResponseContext): Promise<HttpInfo<AbstractObjectQueryResult >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: AbstractObjectQueryResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AbstractObjectQueryResult", ""
            ) as AbstractObjectQueryResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("404", response.httpStatusCode)) {
            const body: ServiceResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "ServiceResult", ""
            ) as ServiceResult;
            throw new ApiException<ServiceResult>(response.httpStatusCode, "If the given tables or fields could not be found.", body, response.headers);
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
            const body: AbstractObjectQueryResult = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "AbstractObjectQueryResult", ""
            ) as AbstractObjectQueryResult;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}

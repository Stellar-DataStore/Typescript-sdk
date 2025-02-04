import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'

import { AbstractObjectQueryResult } from '../models/AbstractObjectQueryResult';
import { AbstractObjectServiceResult } from '../models/AbstractObjectServiceResult';
import { CreateRecordRequest } from '../models/CreateRecordRequest';
import { FieldRequest } from '../models/FieldRequest';
import { FieldResponse } from '../models/FieldResponse';
import { FieldResponseServiceResult } from '../models/FieldResponseServiceResult';
import { IServiceResult } from '../models/IServiceResult';
import { ProjectRequest } from '../models/ProjectRequest';
import { RevokeTokenRequest } from '../models/RevokeTokenRequest';
import { ServiceMessage } from '../models/ServiceMessage';
import { ServiceMessageType } from '../models/ServiceMessageType';
import { ServiceResult } from '../models/ServiceResult';
import { Stream } from '../models/Stream';
import { TableRequest } from '../models/TableRequest';
import { TableResponse } from '../models/TableResponse';
import { TableResponseIEnumerableServiceResult } from '../models/TableResponseIEnumerableServiceResult';
import { TokenResponse } from '../models/TokenResponse';
import { UpdateRecordRequest } from '../models/UpdateRecordRequest';
import { ObservableDataApi } from './ObservableAPI';

import { DataApiRequestFactory, DataApiResponseProcessor} from "../apis/DataApi";
export class PromiseDataApi {
    private api: ObservableDataApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DataApiRequestFactory,
        responseProcessor?: DataApiResponseProcessor
    ) {
        this.api = new ObservableDataApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Download a file from a blob field as a stream.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     */
    public v1DataTableBlobGetWithHttpInfo(project: string, table: number, record: number, field: string, _options?: Configuration): Promise<HttpInfo<Stream>> {
        const result = this.api.v1DataTableBlobGetWithHttpInfo(project, table, record, field, _options);
        return result.toPromise();
    }

    /**
     * Download a file from a blob field as a stream.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     */
    public v1DataTableBlobGet(project: string, table: number, record: number, field: string, _options?: Configuration): Promise<Stream> {
        const result = this.api.v1DataTableBlobGet(project, table, record, field, _options);
        return result.toPromise();
    }

    /**
     * Upload a file to a blob field.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     * @param [data]
     */
    public v1DataTableBlobPostWithHttpInfo(project: string, table: number, record: number, field: string, data?: HttpFile, _options?: Configuration): Promise<HttpInfo<Stream>> {
        const result = this.api.v1DataTableBlobPostWithHttpInfo(project, table, record, field, data, _options);
        return result.toPromise();
    }

    /**
     * Upload a file to a blob field.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     * @param [data]
     */
    public v1DataTableBlobPost(project: string, table: number, record: number, field: string, data?: HttpFile, _options?: Configuration): Promise<Stream> {
        const result = this.api.v1DataTableBlobPost(project, table, record, field, data, _options);
        return result.toPromise();
    }

    /**
     * Deletes all records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     */
    public v1DataTableClearDeleteWithHttpInfo(project: string, table: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.v1DataTableClearDeleteWithHttpInfo(project, table, _options);
        return result.toPromise();
    }

    /**
     * Deletes all records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     */
    public v1DataTableClearDelete(project: string, table: number, _options?: Configuration): Promise<void> {
        const result = this.api.v1DataTableClearDelete(project, table, _options);
        return result.toPromise();
    }

    /**
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table Id of table where you want to delete a record.
     * @param [record] record id to delete.
     */
    public v1DataTableDeleteWithHttpInfo(project: string, table: number, record?: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.v1DataTableDeleteWithHttpInfo(project, table, record, _options);
        return result.toPromise();
    }

    /**
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table Id of table where you want to delete a record.
     * @param [record] record id to delete.
     */
    public v1DataTableDelete(project: string, table: number, record?: number, _options?: Configuration): Promise<void> {
        const result = this.api.v1DataTableDelete(project, table, record, _options);
        return result.toPromise();
    }

    /**
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     * @param [requestBody] An array of ids
     */
    public v1DataTableDeletePostWithHttpInfo(project: string, table: number, requestBody?: Array<string>, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.v1DataTableDeletePostWithHttpInfo(project, table, requestBody, _options);
        return result.toPromise();
    }

    /**
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     * @param [requestBody] An array of ids
     */
    public v1DataTableDeletePost(project: string, table: number, requestBody?: Array<string>, _options?: Configuration): Promise<void> {
        const result = this.api.v1DataTableDeletePost(project, table, requestBody, _options);
        return result.toPromise();
    }

    /**
     * Gets the records for a given table.
     * @param project The project containing the table.
     * @param table Id of the table containing the records.
     * @param [offset] The offset of the records.
     * @param [take] The amount of records.
     * @param [joinQuery] The join queries to apply.
     * @param [whereQuery] The where queries to apply.
     * @param [sortQuery] The sort queries to apply.
     * @param [distinct] 
     * @param [select] 
     */
    public v1DataTableGetWithHttpInfo(project: string, table: number, offset?: number, take?: number, joinQuery?: string, whereQuery?: string, sortQuery?: string, distinct?: boolean, select?: string, _options?: Configuration): Promise<HttpInfo<AbstractObjectQueryResult>> {
        const result = this.api.v1DataTableGetWithHttpInfo(project, table, offset, take, joinQuery, whereQuery, sortQuery, distinct, select, _options);
        return result.toPromise();
    }

    /**
     * Gets the records for a given table.
     * @param project The project containing the table.
     * @param table Id of the table containing the records.
     * @param [offset] The offset of the records.
     * @param [take] The amount of records.
     * @param [joinQuery] The join queries to apply.
     * @param [whereQuery] The where queries to apply.
     * @param [sortQuery] The sort queries to apply.
     * @param [distinct] 
     * @param [select] 
     */
    public v1DataTableGet(project: string, table: number, offset?: number, take?: number, joinQuery?: string, whereQuery?: string, sortQuery?: string, distinct?: boolean, select?: string, _options?: Configuration): Promise<AbstractObjectQueryResult> {
        const result = this.api.v1DataTableGet(project, table, offset, take, joinQuery, whereQuery, sortQuery, distinct, select, _options);
        return result.toPromise();
    }

    /**
     * Adds records to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param [createRecordRequest] 
     */
    public v1DataTablePostWithHttpInfo(project: string, table: number, createRecordRequest?: CreateRecordRequest, _options?: Configuration): Promise<HttpInfo<AbstractObjectQueryResult>> {
        const result = this.api.v1DataTablePostWithHttpInfo(project, table, createRecordRequest, _options);
        return result.toPromise();
    }

    /**
     * Adds records to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param [createRecordRequest] 
     */
    public v1DataTablePost(project: string, table: number, createRecordRequest?: CreateRecordRequest, _options?: Configuration): Promise<AbstractObjectQueryResult> {
        const result = this.api.v1DataTablePost(project, table, createRecordRequest, _options);
        return result.toPromise();
    }

    /**
     * Updates records in the given table based on the values in record.
     * @param project The project containing the table.
     * @param table The table to be updated in.
     * @param [force] If you are certain you want to update all your records in case no ids were included.
     * @param [updateRecordRequest] 
     */
    public v1DataTablePutWithHttpInfo(project: string, table: number, force?: boolean, updateRecordRequest?: UpdateRecordRequest, _options?: Configuration): Promise<HttpInfo<AbstractObjectQueryResult>> {
        const result = this.api.v1DataTablePutWithHttpInfo(project, table, force, updateRecordRequest, _options);
        return result.toPromise();
    }

    /**
     * Updates records in the given table based on the values in record.
     * @param project The project containing the table.
     * @param table The table to be updated in.
     * @param [force] If you are certain you want to update all your records in case no ids were included.
     * @param [updateRecordRequest] 
     */
    public v1DataTablePut(project: string, table: number, force?: boolean, updateRecordRequest?: UpdateRecordRequest, _options?: Configuration): Promise<AbstractObjectQueryResult> {
        const result = this.api.v1DataTablePut(project, table, force, updateRecordRequest, _options);
        return result.toPromise();
    }


}



import { ObservableFieldApi } from './ObservableAPI';

import { FieldApiRequestFactory, FieldApiResponseProcessor} from "../apis/FieldApi";
export class PromiseFieldApi {
    private api: ObservableFieldApi

    public constructor(
        configuration: Configuration,
        requestFactory?: FieldApiRequestFactory,
        responseProcessor?: FieldApiResponseProcessor
    ) {
        this.api = new ObservableFieldApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Deletes the given field within the given table.
     * @param project The project containing the table.
     * @param table The table containing the given field.
     * @param field The field to be deleted
     */
    public v1SchemaTableFieldDeleteWithHttpInfo(project: string, table: number, field: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.v1SchemaTableFieldDeleteWithHttpInfo(project, table, field, _options);
        return result.toPromise();
    }

    /**
     * Deletes the given field within the given table.
     * @param project The project containing the table.
     * @param table The table containing the given field.
     * @param field The field to be deleted
     */
    public v1SchemaTableFieldDelete(project: string, table: number, field: number, _options?: Configuration): Promise<void> {
        const result = this.api.v1SchemaTableFieldDelete(project, table, field, _options);
        return result.toPromise();
    }

    /**
     * Gets field(s) from given table.
     * @param project The project containing the table.
     * @param table The table containing the fields.
     * @param [field] The optional field to get.
     */
    public v1SchemaTableFieldGetWithHttpInfo(project: string, table: number, field?: number, _options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        const result = this.api.v1SchemaTableFieldGetWithHttpInfo(project, table, field, _options);
        return result.toPromise();
    }

    /**
     * Gets field(s) from given table.
     * @param project The project containing the table.
     * @param table The table containing the fields.
     * @param [field] The optional field to get.
     */
    public v1SchemaTableFieldGet(project: string, table: number, field?: number, _options?: Configuration): Promise<IServiceResult> {
        const result = this.api.v1SchemaTableFieldGet(project, table, field, _options);
        return result.toPromise();
    }

    /**
     * Adds a field to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param [fieldRequest] 
     */
    public v1SchemaTableFieldPostWithHttpInfo(project: string, table: number, fieldRequest?: FieldRequest, _options?: Configuration): Promise<HttpInfo<FieldResponseServiceResult>> {
        const result = this.api.v1SchemaTableFieldPostWithHttpInfo(project, table, fieldRequest, _options);
        return result.toPromise();
    }

    /**
     * Adds a field to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param [fieldRequest] 
     */
    public v1SchemaTableFieldPost(project: string, table: number, fieldRequest?: FieldRequest, _options?: Configuration): Promise<FieldResponseServiceResult> {
        const result = this.api.v1SchemaTableFieldPost(project, table, fieldRequest, _options);
        return result.toPromise();
    }

    /**
     * Updates the given field in the given table.
     * @param project The project containing the table.
     * @param table The table containing the field.
     * @param field The field to be updated.
     * @param [fieldRequest] 
     */
    public v1SchemaTableFieldPutWithHttpInfo(project: string, table: number, field: number, fieldRequest?: FieldRequest, _options?: Configuration): Promise<HttpInfo<FieldResponseServiceResult>> {
        const result = this.api.v1SchemaTableFieldPutWithHttpInfo(project, table, field, fieldRequest, _options);
        return result.toPromise();
    }

    /**
     * Updates the given field in the given table.
     * @param project The project containing the table.
     * @param table The table containing the field.
     * @param field The field to be updated.
     * @param [fieldRequest] 
     */
    public v1SchemaTableFieldPut(project: string, table: number, field: number, fieldRequest?: FieldRequest, _options?: Configuration): Promise<FieldResponseServiceResult> {
        const result = this.api.v1SchemaTableFieldPut(project, table, field, fieldRequest, _options);
        return result.toPromise();
    }


}



import { ObservableOAuthApi } from './ObservableAPI';

import { OAuthApiRequestFactory, OAuthApiResponseProcessor} from "../apis/OAuthApi";
export class PromiseOAuthApi {
    private api: ObservableOAuthApi

    public constructor(
        configuration: Configuration,
        requestFactory?: OAuthApiRequestFactory,
        responseProcessor?: OAuthApiResponseProcessor
    ) {
        this.api = new ObservableOAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param revokeTokenRequest
     */
    public v1OauthRevokePostWithHttpInfo(revokeTokenRequest: RevokeTokenRequest, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.v1OauthRevokePostWithHttpInfo(revokeTokenRequest, _options);
        return result.toPromise();
    }

    /**
     * @param revokeTokenRequest
     */
    public v1OauthRevokePost(revokeTokenRequest: RevokeTokenRequest, _options?: Configuration): Promise<void> {
        const result = this.api.v1OauthRevokePost(revokeTokenRequest, _options);
        return result.toPromise();
    }

    /**
     * @param grantType
     * @param clientId
     * @param clientSecret
     * @param [redirectUri]
     * @param [code]
     * @param [refreshToken]
     */
    public v1OauthTokenPostWithHttpInfo(grantType: string, clientId: string, clientSecret: string, redirectUri?: string, code?: string, refreshToken?: string, _options?: Configuration): Promise<HttpInfo<TokenResponse>> {
        const result = this.api.v1OauthTokenPostWithHttpInfo(grantType, clientId, clientSecret, redirectUri, code, refreshToken, _options);
        return result.toPromise();
    }

    /**
     * @param grantType
     * @param clientId
     * @param clientSecret
     * @param [redirectUri]
     * @param [code]
     * @param [refreshToken]
     */
    public v1OauthTokenPost(grantType: string, clientId: string, clientSecret: string, redirectUri?: string, code?: string, refreshToken?: string, _options?: Configuration): Promise<TokenResponse> {
        const result = this.api.v1OauthTokenPost(grantType, clientId, clientSecret, redirectUri, code, refreshToken, _options);
        return result.toPromise();
    }


}



import { ObservableProjectApi } from './ObservableAPI';

import { ProjectApiRequestFactory, ProjectApiResponseProcessor} from "../apis/ProjectApi";
export class PromiseProjectApi {
    private api: ObservableProjectApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ProjectApiRequestFactory,
        responseProcessor?: ProjectApiResponseProcessor
    ) {
        this.api = new ObservableProjectApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Gets project(s) from the logged in user.
     * @param [project] The optional project guid to be fetched.
     */
    public v1SchemaProjectGetWithHttpInfo(project?: string, _options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        const result = this.api.v1SchemaProjectGetWithHttpInfo(project, _options);
        return result.toPromise();
    }

    /**
     * Gets project(s) from the logged in user.
     * @param [project] The optional project guid to be fetched.
     */
    public v1SchemaProjectGet(project?: string, _options?: Configuration): Promise<IServiceResult> {
        const result = this.api.v1SchemaProjectGet(project, _options);
        return result.toPromise();
    }

    /**
     * Updates a project.
     * @param project The project to be updated.
     * @param [projectRequest] 
     */
    public v1SchemaProjectPutWithHttpInfo(project: string, projectRequest?: ProjectRequest, _options?: Configuration): Promise<HttpInfo<TableResponseIEnumerableServiceResult>> {
        const result = this.api.v1SchemaProjectPutWithHttpInfo(project, projectRequest, _options);
        return result.toPromise();
    }

    /**
     * Updates a project.
     * @param project The project to be updated.
     * @param [projectRequest] 
     */
    public v1SchemaProjectPut(project: string, projectRequest?: ProjectRequest, _options?: Configuration): Promise<TableResponseIEnumerableServiceResult> {
        const result = this.api.v1SchemaProjectPut(project, projectRequest, _options);
        return result.toPromise();
    }


}



import { ObservableProjectTierApi } from './ObservableAPI';

import { ProjectTierApiRequestFactory, ProjectTierApiResponseProcessor} from "../apis/ProjectTierApi";
export class PromiseProjectTierApi {
    private api: ObservableProjectTierApi

    public constructor(
        configuration: Configuration,
        requestFactory?: ProjectTierApiRequestFactory,
        responseProcessor?: ProjectTierApiResponseProcessor
    ) {
        this.api = new ObservableProjectTierApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param project
     */
    public v1ProjectTierCurrentGetWithHttpInfo(project: string, _options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        const result = this.api.v1ProjectTierCurrentGetWithHttpInfo(project, _options);
        return result.toPromise();
    }

    /**
     * @param project
     */
    public v1ProjectTierCurrentGet(project: string, _options?: Configuration): Promise<IServiceResult> {
        const result = this.api.v1ProjectTierCurrentGet(project, _options);
        return result.toPromise();
    }

    /**
     * @param project
     */
    public v1ProjectTierGetWithHttpInfo(project: string, _options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        const result = this.api.v1ProjectTierGetWithHttpInfo(project, _options);
        return result.toPromise();
    }

    /**
     * @param project
     */
    public v1ProjectTierGet(project: string, _options?: Configuration): Promise<IServiceResult> {
        const result = this.api.v1ProjectTierGet(project, _options);
        return result.toPromise();
    }


}



import { ObservableTableApi } from './ObservableAPI';

import { TableApiRequestFactory, TableApiResponseProcessor} from "../apis/TableApi";
export class PromiseTableApi {
    private api: ObservableTableApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TableApiRequestFactory,
        responseProcessor?: TableApiResponseProcessor
    ) {
        this.api = new ObservableTableApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Deletes a table from the database.
     * @param project The project containing the table.
     * @param table The table to be deleted.
     */
    public v1SchemaTableDeleteWithHttpInfo(project: string, table: number, _options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.v1SchemaTableDeleteWithHttpInfo(project, table, _options);
        return result.toPromise();
    }

    /**
     * Deletes a table from the database.
     * @param project The project containing the table.
     * @param table The table to be deleted.
     */
    public v1SchemaTableDelete(project: string, table: number, _options?: Configuration): Promise<void> {
        const result = this.api.v1SchemaTableDelete(project, table, _options);
        return result.toPromise();
    }

    /**
     * Gets table(s) from the logged in user.
     * @param project The project containing the table.
     * @param [table] name or id of the table to fetch (optional)
     */
    public v1SchemaTableGetWithHttpInfo(project: string, table?: string, _options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        const result = this.api.v1SchemaTableGetWithHttpInfo(project, table, _options);
        return result.toPromise();
    }

    /**
     * Gets table(s) from the logged in user.
     * @param project The project containing the table.
     * @param [table] name or id of the table to fetch (optional)
     */
    public v1SchemaTableGet(project: string, table?: string, _options?: Configuration): Promise<IServiceResult> {
        const result = this.api.v1SchemaTableGet(project, table, _options);
        return result.toPromise();
    }

    /**
     * Creates a new table in the database.
     * @param project The project containing the table.
     * @param [tableRequest] 
     */
    public v1SchemaTablePostWithHttpInfo(project: string, tableRequest?: TableRequest, _options?: Configuration): Promise<HttpInfo<AbstractObjectServiceResult>> {
        const result = this.api.v1SchemaTablePostWithHttpInfo(project, tableRequest, _options);
        return result.toPromise();
    }

    /**
     * Creates a new table in the database.
     * @param project The project containing the table.
     * @param [tableRequest] 
     */
    public v1SchemaTablePost(project: string, tableRequest?: TableRequest, _options?: Configuration): Promise<AbstractObjectServiceResult> {
        const result = this.api.v1SchemaTablePost(project, tableRequest, _options);
        return result.toPromise();
    }

    /**
     * Updates a table in the database.
     * @param project The project containing the table.
     * @param [table] The table to be updated.
     * @param [tableRequest] 
     */
    public v1SchemaTablePutWithHttpInfo(project: string, table?: number, tableRequest?: TableRequest, _options?: Configuration): Promise<HttpInfo<TableResponseIEnumerableServiceResult>> {
        const result = this.api.v1SchemaTablePutWithHttpInfo(project, table, tableRequest, _options);
        return result.toPromise();
    }

    /**
     * Updates a table in the database.
     * @param project The project containing the table.
     * @param [table] The table to be updated.
     * @param [tableRequest] 
     */
    public v1SchemaTablePut(project: string, table?: number, tableRequest?: TableRequest, _options?: Configuration): Promise<TableResponseIEnumerableServiceResult> {
        const result = this.api.v1SchemaTablePut(project, table, tableRequest, _options);
        return result.toPromise();
    }


}



import { ObservableTestApi } from './ObservableAPI';

import { TestApiRequestFactory, TestApiResponseProcessor} from "../apis/TestApi";
export class PromiseTestApi {
    private api: ObservableTestApi

    public constructor(
        configuration: Configuration,
        requestFactory?: TestApiRequestFactory,
        responseProcessor?: TestApiResponseProcessor
    ) {
        this.api = new ObservableTestApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public v1PingGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<void>> {
        const result = this.api.v1PingGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public v1PingGet(_options?: Configuration): Promise<void> {
        const result = this.api.v1PingGet(_options);
        return result.toPromise();
    }


}



import { ObservableUserApi } from './ObservableAPI';

import { UserApiRequestFactory, UserApiResponseProcessor} from "../apis/UserApi";
export class PromiseUserApi {
    private api: ObservableUserApi

    public constructor(
        configuration: Configuration,
        requestFactory?: UserApiRequestFactory,
        responseProcessor?: UserApiResponseProcessor
    ) {
        this.api = new ObservableUserApi(configuration, requestFactory, responseProcessor);
    }

    /**
     */
    public v1UserDeleteWithHttpInfo(_options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        const result = this.api.v1UserDeleteWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public v1UserDelete(_options?: Configuration): Promise<IServiceResult> {
        const result = this.api.v1UserDelete(_options);
        return result.toPromise();
    }

    /**
     */
    public v1UserGetWithHttpInfo(_options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        const result = this.api.v1UserGetWithHttpInfo(_options);
        return result.toPromise();
    }

    /**
     */
    public v1UserGet(_options?: Configuration): Promise<IServiceResult> {
        const result = this.api.v1UserGet(_options);
        return result.toPromise();
    }

    /**
     * @param projectId
     */
    public v1UserPermissionsGetWithHttpInfo(projectId: string, _options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        const result = this.api.v1UserPermissionsGetWithHttpInfo(projectId, _options);
        return result.toPromise();
    }

    /**
     * @param projectId
     */
    public v1UserPermissionsGet(projectId: string, _options?: Configuration): Promise<IServiceResult> {
        const result = this.api.v1UserPermissionsGet(projectId, _options);
        return result.toPromise();
    }


}




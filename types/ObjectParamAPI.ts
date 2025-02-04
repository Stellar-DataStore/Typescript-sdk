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

import { ObservableDataApi } from "./ObservableAPI";
import { DataApiRequestFactory, DataApiResponseProcessor} from "../apis/DataApi";

export interface DataApiV1DataTableBlobGetRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableBlobGet
     */
    project: string
    /**
     * The table containing the records.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableBlobGet
     */
    table: number
    /**
     * The record to be queried.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableBlobGet
     */
    record: number
    /**
     * The field of the record.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableBlobGet
     */
    field: string
}

export interface DataApiV1DataTableBlobPostRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableBlobPost
     */
    project: string
    /**
     * The table containing the records.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableBlobPost
     */
    table: number
    /**
     * The record to be queried.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableBlobPost
     */
    record: number
    /**
     * The field of the record.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableBlobPost
     */
    field: string
    /**
     * 
     * Defaults to: undefined
     * @type HttpFile
     * @memberof DataApiv1DataTableBlobPost
     */
    data?: HttpFile
}

export interface DataApiV1DataTableClearDeleteRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableClearDelete
     */
    project: string
    /**
     * The table to delete from.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableClearDelete
     */
    table: number
}

export interface DataApiV1DataTableDeleteRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableDelete
     */
    project: string
    /**
     * Id of table where you want to delete a record.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableDelete
     */
    table: number
    /**
     * record id to delete.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableDelete
     */
    record?: number
}

export interface DataApiV1DataTableDeletePostRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableDeletePost
     */
    project: string
    /**
     * The table to delete from.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableDeletePost
     */
    table: number
    /**
     * An array of ids
     * @type Array&lt;string&gt;
     * @memberof DataApiv1DataTableDeletePost
     */
    requestBody?: Array<string>
}

export interface DataApiV1DataTableGetRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableGet
     */
    project: string
    /**
     * Id of the table containing the records.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableGet
     */
    table: number
    /**
     * The offset of the records.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableGet
     */
    offset?: number
    /**
     * The amount of records.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTableGet
     */
    take?: number
    /**
     * The join queries to apply.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableGet
     */
    joinQuery?: string
    /**
     * The where queries to apply.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableGet
     */
    whereQuery?: string
    /**
     * The sort queries to apply.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableGet
     */
    sortQuery?: string
    /**
     * 
     * Defaults to: false
     * @type boolean
     * @memberof DataApiv1DataTableGet
     */
    distinct?: boolean
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTableGet
     */
    select?: string
}

export interface DataApiV1DataTablePostRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTablePost
     */
    project: string
    /**
     * The table to be added to.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTablePost
     */
    table: number
    /**
     * 
     * @type CreateRecordRequest
     * @memberof DataApiv1DataTablePost
     */
    createRecordRequest?: CreateRecordRequest
}

export interface DataApiV1DataTablePutRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof DataApiv1DataTablePut
     */
    project: string
    /**
     * The table to be updated in.
     * Defaults to: undefined
     * @type number
     * @memberof DataApiv1DataTablePut
     */
    table: number
    /**
     * If you are certain you want to update all your records in case no ids were included.
     * Defaults to: false
     * @type boolean
     * @memberof DataApiv1DataTablePut
     */
    force?: boolean
    /**
     * 
     * @type UpdateRecordRequest
     * @memberof DataApiv1DataTablePut
     */
    updateRecordRequest?: UpdateRecordRequest
}

export class ObjectDataApi {
    private api: ObservableDataApi

    public constructor(configuration: Configuration, requestFactory?: DataApiRequestFactory, responseProcessor?: DataApiResponseProcessor) {
        this.api = new ObservableDataApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Download a file from a blob field as a stream.
     * @param param the request object
     */
    public v1DataTableBlobGetWithHttpInfo(param: DataApiV1DataTableBlobGetRequest, options?: Configuration): Promise<HttpInfo<Stream>> {
        return this.api.v1DataTableBlobGetWithHttpInfo(param.project, param.table, param.record, param.field,  options).toPromise();
    }

    /**
     * Download a file from a blob field as a stream.
     * @param param the request object
     */
    public v1DataTableBlobGet(param: DataApiV1DataTableBlobGetRequest, options?: Configuration): Promise<Stream> {
        return this.api.v1DataTableBlobGet(param.project, param.table, param.record, param.field,  options).toPromise();
    }

    /**
     * Upload a file to a blob field.
     * @param param the request object
     */
    public v1DataTableBlobPostWithHttpInfo(param: DataApiV1DataTableBlobPostRequest, options?: Configuration): Promise<HttpInfo<Stream>> {
        return this.api.v1DataTableBlobPostWithHttpInfo(param.project, param.table, param.record, param.field, param.data,  options).toPromise();
    }

    /**
     * Upload a file to a blob field.
     * @param param the request object
     */
    public v1DataTableBlobPost(param: DataApiV1DataTableBlobPostRequest, options?: Configuration): Promise<Stream> {
        return this.api.v1DataTableBlobPost(param.project, param.table, param.record, param.field, param.data,  options).toPromise();
    }

    /**
     * Deletes all records from the given table.
     * @param param the request object
     */
    public v1DataTableClearDeleteWithHttpInfo(param: DataApiV1DataTableClearDeleteRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.v1DataTableClearDeleteWithHttpInfo(param.project, param.table,  options).toPromise();
    }

    /**
     * Deletes all records from the given table.
     * @param param the request object
     */
    public v1DataTableClearDelete(param: DataApiV1DataTableClearDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.v1DataTableClearDelete(param.project, param.table,  options).toPromise();
    }

    /**
     * Deletes records from the given table.
     * @param param the request object
     */
    public v1DataTableDeleteWithHttpInfo(param: DataApiV1DataTableDeleteRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.v1DataTableDeleteWithHttpInfo(param.project, param.table, param.record,  options).toPromise();
    }

    /**
     * Deletes records from the given table.
     * @param param the request object
     */
    public v1DataTableDelete(param: DataApiV1DataTableDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.v1DataTableDelete(param.project, param.table, param.record,  options).toPromise();
    }

    /**
     * Deletes records from the given table.
     * @param param the request object
     */
    public v1DataTableDeletePostWithHttpInfo(param: DataApiV1DataTableDeletePostRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.v1DataTableDeletePostWithHttpInfo(param.project, param.table, param.requestBody,  options).toPromise();
    }

    /**
     * Deletes records from the given table.
     * @param param the request object
     */
    public v1DataTableDeletePost(param: DataApiV1DataTableDeletePostRequest, options?: Configuration): Promise<void> {
        return this.api.v1DataTableDeletePost(param.project, param.table, param.requestBody,  options).toPromise();
    }

    /**
     * Gets the records for a given table.
     * @param param the request object
     */
    public v1DataTableGetWithHttpInfo(param: DataApiV1DataTableGetRequest, options?: Configuration): Promise<HttpInfo<AbstractObjectQueryResult>> {
        return this.api.v1DataTableGetWithHttpInfo(param.project, param.table, param.offset, param.take, param.joinQuery, param.whereQuery, param.sortQuery, param.distinct, param.select,  options).toPromise();
    }

    /**
     * Gets the records for a given table.
     * @param param the request object
     */
    public v1DataTableGet(param: DataApiV1DataTableGetRequest, options?: Configuration): Promise<AbstractObjectQueryResult> {
        return this.api.v1DataTableGet(param.project, param.table, param.offset, param.take, param.joinQuery, param.whereQuery, param.sortQuery, param.distinct, param.select,  options).toPromise();
    }

    /**
     * Adds records to the given table.
     * @param param the request object
     */
    public v1DataTablePostWithHttpInfo(param: DataApiV1DataTablePostRequest, options?: Configuration): Promise<HttpInfo<AbstractObjectQueryResult>> {
        return this.api.v1DataTablePostWithHttpInfo(param.project, param.table, param.createRecordRequest,  options).toPromise();
    }

    /**
     * Adds records to the given table.
     * @param param the request object
     */
    public v1DataTablePost(param: DataApiV1DataTablePostRequest, options?: Configuration): Promise<AbstractObjectQueryResult> {
        return this.api.v1DataTablePost(param.project, param.table, param.createRecordRequest,  options).toPromise();
    }

    /**
     * Updates records in the given table based on the values in record.
     * @param param the request object
     */
    public v1DataTablePutWithHttpInfo(param: DataApiV1DataTablePutRequest, options?: Configuration): Promise<HttpInfo<AbstractObjectQueryResult>> {
        return this.api.v1DataTablePutWithHttpInfo(param.project, param.table, param.force, param.updateRecordRequest,  options).toPromise();
    }

    /**
     * Updates records in the given table based on the values in record.
     * @param param the request object
     */
    public v1DataTablePut(param: DataApiV1DataTablePutRequest, options?: Configuration): Promise<AbstractObjectQueryResult> {
        return this.api.v1DataTablePut(param.project, param.table, param.force, param.updateRecordRequest,  options).toPromise();
    }

}

import { ObservableFieldApi } from "./ObservableAPI";
import { FieldApiRequestFactory, FieldApiResponseProcessor} from "../apis/FieldApi";

export interface FieldApiV1SchemaTableFieldDeleteRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof FieldApiv1SchemaTableFieldDelete
     */
    project: string
    /**
     * The table containing the given field.
     * Defaults to: undefined
     * @type number
     * @memberof FieldApiv1SchemaTableFieldDelete
     */
    table: number
    /**
     * The field to be deleted
     * Defaults to: undefined
     * @type number
     * @memberof FieldApiv1SchemaTableFieldDelete
     */
    field: number
}

export interface FieldApiV1SchemaTableFieldGetRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof FieldApiv1SchemaTableFieldGet
     */
    project: string
    /**
     * The table containing the fields.
     * Defaults to: undefined
     * @type number
     * @memberof FieldApiv1SchemaTableFieldGet
     */
    table: number
    /**
     * The optional field to get.
     * Defaults to: undefined
     * @type number
     * @memberof FieldApiv1SchemaTableFieldGet
     */
    field?: number
}

export interface FieldApiV1SchemaTableFieldPostRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof FieldApiv1SchemaTableFieldPost
     */
    project: string
    /**
     * The table to be added to.
     * Defaults to: undefined
     * @type number
     * @memberof FieldApiv1SchemaTableFieldPost
     */
    table: number
    /**
     * 
     * @type FieldRequest
     * @memberof FieldApiv1SchemaTableFieldPost
     */
    fieldRequest?: FieldRequest
}

export interface FieldApiV1SchemaTableFieldPutRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof FieldApiv1SchemaTableFieldPut
     */
    project: string
    /**
     * The table containing the field.
     * Defaults to: undefined
     * @type number
     * @memberof FieldApiv1SchemaTableFieldPut
     */
    table: number
    /**
     * The field to be updated.
     * Defaults to: undefined
     * @type number
     * @memberof FieldApiv1SchemaTableFieldPut
     */
    field: number
    /**
     * 
     * @type FieldRequest
     * @memberof FieldApiv1SchemaTableFieldPut
     */
    fieldRequest?: FieldRequest
}

export class ObjectFieldApi {
    private api: ObservableFieldApi

    public constructor(configuration: Configuration, requestFactory?: FieldApiRequestFactory, responseProcessor?: FieldApiResponseProcessor) {
        this.api = new ObservableFieldApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Deletes the given field within the given table.
     * @param param the request object
     */
    public v1SchemaTableFieldDeleteWithHttpInfo(param: FieldApiV1SchemaTableFieldDeleteRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.v1SchemaTableFieldDeleteWithHttpInfo(param.project, param.table, param.field,  options).toPromise();
    }

    /**
     * Deletes the given field within the given table.
     * @param param the request object
     */
    public v1SchemaTableFieldDelete(param: FieldApiV1SchemaTableFieldDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.v1SchemaTableFieldDelete(param.project, param.table, param.field,  options).toPromise();
    }

    /**
     * Gets field(s) from given table.
     * @param param the request object
     */
    public v1SchemaTableFieldGetWithHttpInfo(param: FieldApiV1SchemaTableFieldGetRequest, options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        return this.api.v1SchemaTableFieldGetWithHttpInfo(param.project, param.table, param.field,  options).toPromise();
    }

    /**
     * Gets field(s) from given table.
     * @param param the request object
     */
    public v1SchemaTableFieldGet(param: FieldApiV1SchemaTableFieldGetRequest, options?: Configuration): Promise<IServiceResult> {
        return this.api.v1SchemaTableFieldGet(param.project, param.table, param.field,  options).toPromise();
    }

    /**
     * Adds a field to the given table.
     * @param param the request object
     */
    public v1SchemaTableFieldPostWithHttpInfo(param: FieldApiV1SchemaTableFieldPostRequest, options?: Configuration): Promise<HttpInfo<FieldResponseServiceResult>> {
        return this.api.v1SchemaTableFieldPostWithHttpInfo(param.project, param.table, param.fieldRequest,  options).toPromise();
    }

    /**
     * Adds a field to the given table.
     * @param param the request object
     */
    public v1SchemaTableFieldPost(param: FieldApiV1SchemaTableFieldPostRequest, options?: Configuration): Promise<FieldResponseServiceResult> {
        return this.api.v1SchemaTableFieldPost(param.project, param.table, param.fieldRequest,  options).toPromise();
    }

    /**
     * Updates the given field in the given table.
     * @param param the request object
     */
    public v1SchemaTableFieldPutWithHttpInfo(param: FieldApiV1SchemaTableFieldPutRequest, options?: Configuration): Promise<HttpInfo<FieldResponseServiceResult>> {
        return this.api.v1SchemaTableFieldPutWithHttpInfo(param.project, param.table, param.field, param.fieldRequest,  options).toPromise();
    }

    /**
     * Updates the given field in the given table.
     * @param param the request object
     */
    public v1SchemaTableFieldPut(param: FieldApiV1SchemaTableFieldPutRequest, options?: Configuration): Promise<FieldResponseServiceResult> {
        return this.api.v1SchemaTableFieldPut(param.project, param.table, param.field, param.fieldRequest,  options).toPromise();
    }

}

import { ObservableOAuthApi } from "./ObservableAPI";
import { OAuthApiRequestFactory, OAuthApiResponseProcessor} from "../apis/OAuthApi";

export interface OAuthApiV1OauthRevokePostRequest {
    /**
     * 
     * @type RevokeTokenRequest
     * @memberof OAuthApiv1OauthRevokePost
     */
    revokeTokenRequest: RevokeTokenRequest
}

export interface OAuthApiV1OauthTokenPostRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof OAuthApiv1OauthTokenPost
     */
    grantType: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof OAuthApiv1OauthTokenPost
     */
    clientId: string
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof OAuthApiv1OauthTokenPost
     */
    clientSecret: string
    /**
     * 
     * Defaults to: &#39;&#39;
     * @type string
     * @memberof OAuthApiv1OauthTokenPost
     */
    redirectUri?: string
    /**
     * 
     * Defaults to: &#39;&#39;
     * @type string
     * @memberof OAuthApiv1OauthTokenPost
     */
    code?: string
    /**
     * 
     * Defaults to: &#39;&#39;
     * @type string
     * @memberof OAuthApiv1OauthTokenPost
     */
    refreshToken?: string
}

export class ObjectOAuthApi {
    private api: ObservableOAuthApi

    public constructor(configuration: Configuration, requestFactory?: OAuthApiRequestFactory, responseProcessor?: OAuthApiResponseProcessor) {
        this.api = new ObservableOAuthApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public v1OauthRevokePostWithHttpInfo(param: OAuthApiV1OauthRevokePostRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.v1OauthRevokePostWithHttpInfo(param.revokeTokenRequest,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1OauthRevokePost(param: OAuthApiV1OauthRevokePostRequest, options?: Configuration): Promise<void> {
        return this.api.v1OauthRevokePost(param.revokeTokenRequest,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1OauthTokenPostWithHttpInfo(param: OAuthApiV1OauthTokenPostRequest, options?: Configuration): Promise<HttpInfo<TokenResponse>> {
        return this.api.v1OauthTokenPostWithHttpInfo(param.grantType, param.clientId, param.clientSecret, param.redirectUri, param.code, param.refreshToken,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1OauthTokenPost(param: OAuthApiV1OauthTokenPostRequest, options?: Configuration): Promise<TokenResponse> {
        return this.api.v1OauthTokenPost(param.grantType, param.clientId, param.clientSecret, param.redirectUri, param.code, param.refreshToken,  options).toPromise();
    }

}

import { ObservableProjectApi } from "./ObservableAPI";
import { ProjectApiRequestFactory, ProjectApiResponseProcessor} from "../apis/ProjectApi";

export interface ProjectApiV1SchemaProjectGetRequest {
    /**
     * The optional project guid to be fetched.
     * Defaults to: undefined
     * @type string
     * @memberof ProjectApiv1SchemaProjectGet
     */
    project?: string
}

export interface ProjectApiV1SchemaProjectPutRequest {
    /**
     * The project to be updated.
     * Defaults to: undefined
     * @type string
     * @memberof ProjectApiv1SchemaProjectPut
     */
    project: string
    /**
     * 
     * @type ProjectRequest
     * @memberof ProjectApiv1SchemaProjectPut
     */
    projectRequest?: ProjectRequest
}

export class ObjectProjectApi {
    private api: ObservableProjectApi

    public constructor(configuration: Configuration, requestFactory?: ProjectApiRequestFactory, responseProcessor?: ProjectApiResponseProcessor) {
        this.api = new ObservableProjectApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Gets project(s) from the logged in user.
     * @param param the request object
     */
    public v1SchemaProjectGetWithHttpInfo(param: ProjectApiV1SchemaProjectGetRequest = {}, options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        return this.api.v1SchemaProjectGetWithHttpInfo(param.project,  options).toPromise();
    }

    /**
     * Gets project(s) from the logged in user.
     * @param param the request object
     */
    public v1SchemaProjectGet(param: ProjectApiV1SchemaProjectGetRequest = {}, options?: Configuration): Promise<IServiceResult> {
        return this.api.v1SchemaProjectGet(param.project,  options).toPromise();
    }

    /**
     * Updates a project.
     * @param param the request object
     */
    public v1SchemaProjectPutWithHttpInfo(param: ProjectApiV1SchemaProjectPutRequest, options?: Configuration): Promise<HttpInfo<TableResponseIEnumerableServiceResult>> {
        return this.api.v1SchemaProjectPutWithHttpInfo(param.project, param.projectRequest,  options).toPromise();
    }

    /**
     * Updates a project.
     * @param param the request object
     */
    public v1SchemaProjectPut(param: ProjectApiV1SchemaProjectPutRequest, options?: Configuration): Promise<TableResponseIEnumerableServiceResult> {
        return this.api.v1SchemaProjectPut(param.project, param.projectRequest,  options).toPromise();
    }

}

import { ObservableProjectTierApi } from "./ObservableAPI";
import { ProjectTierApiRequestFactory, ProjectTierApiResponseProcessor} from "../apis/ProjectTierApi";

export interface ProjectTierApiV1ProjectTierCurrentGetRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProjectTierApiv1ProjectTierCurrentGet
     */
    project: string
}

export interface ProjectTierApiV1ProjectTierGetRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof ProjectTierApiv1ProjectTierGet
     */
    project: string
}

export class ObjectProjectTierApi {
    private api: ObservableProjectTierApi

    public constructor(configuration: Configuration, requestFactory?: ProjectTierApiRequestFactory, responseProcessor?: ProjectTierApiResponseProcessor) {
        this.api = new ObservableProjectTierApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public v1ProjectTierCurrentGetWithHttpInfo(param: ProjectTierApiV1ProjectTierCurrentGetRequest, options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        return this.api.v1ProjectTierCurrentGetWithHttpInfo(param.project,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1ProjectTierCurrentGet(param: ProjectTierApiV1ProjectTierCurrentGetRequest, options?: Configuration): Promise<IServiceResult> {
        return this.api.v1ProjectTierCurrentGet(param.project,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1ProjectTierGetWithHttpInfo(param: ProjectTierApiV1ProjectTierGetRequest, options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        return this.api.v1ProjectTierGetWithHttpInfo(param.project,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1ProjectTierGet(param: ProjectTierApiV1ProjectTierGetRequest, options?: Configuration): Promise<IServiceResult> {
        return this.api.v1ProjectTierGet(param.project,  options).toPromise();
    }

}

import { ObservableTableApi } from "./ObservableAPI";
import { TableApiRequestFactory, TableApiResponseProcessor} from "../apis/TableApi";

export interface TableApiV1SchemaTableDeleteRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof TableApiv1SchemaTableDelete
     */
    project: string
    /**
     * The table to be deleted.
     * Defaults to: undefined
     * @type number
     * @memberof TableApiv1SchemaTableDelete
     */
    table: number
}

export interface TableApiV1SchemaTableGetRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof TableApiv1SchemaTableGet
     */
    project: string
    /**
     * name or id of the table to fetch (optional)
     * Defaults to: undefined
     * @type string
     * @memberof TableApiv1SchemaTableGet
     */
    table?: string
}

export interface TableApiV1SchemaTablePostRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof TableApiv1SchemaTablePost
     */
    project: string
    /**
     * 
     * @type TableRequest
     * @memberof TableApiv1SchemaTablePost
     */
    tableRequest?: TableRequest
}

export interface TableApiV1SchemaTablePutRequest {
    /**
     * The project containing the table.
     * Defaults to: undefined
     * @type string
     * @memberof TableApiv1SchemaTablePut
     */
    project: string
    /**
     * The table to be updated.
     * Defaults to: undefined
     * @type number
     * @memberof TableApiv1SchemaTablePut
     */
    table?: number
    /**
     * 
     * @type TableRequest
     * @memberof TableApiv1SchemaTablePut
     */
    tableRequest?: TableRequest
}

export class ObjectTableApi {
    private api: ObservableTableApi

    public constructor(configuration: Configuration, requestFactory?: TableApiRequestFactory, responseProcessor?: TableApiResponseProcessor) {
        this.api = new ObservableTableApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Deletes a table from the database.
     * @param param the request object
     */
    public v1SchemaTableDeleteWithHttpInfo(param: TableApiV1SchemaTableDeleteRequest, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.v1SchemaTableDeleteWithHttpInfo(param.project, param.table,  options).toPromise();
    }

    /**
     * Deletes a table from the database.
     * @param param the request object
     */
    public v1SchemaTableDelete(param: TableApiV1SchemaTableDeleteRequest, options?: Configuration): Promise<void> {
        return this.api.v1SchemaTableDelete(param.project, param.table,  options).toPromise();
    }

    /**
     * Gets table(s) from the logged in user.
     * @param param the request object
     */
    public v1SchemaTableGetWithHttpInfo(param: TableApiV1SchemaTableGetRequest, options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        return this.api.v1SchemaTableGetWithHttpInfo(param.project, param.table,  options).toPromise();
    }

    /**
     * Gets table(s) from the logged in user.
     * @param param the request object
     */
    public v1SchemaTableGet(param: TableApiV1SchemaTableGetRequest, options?: Configuration): Promise<IServiceResult> {
        return this.api.v1SchemaTableGet(param.project, param.table,  options).toPromise();
    }

    /**
     * Creates a new table in the database.
     * @param param the request object
     */
    public v1SchemaTablePostWithHttpInfo(param: TableApiV1SchemaTablePostRequest, options?: Configuration): Promise<HttpInfo<AbstractObjectServiceResult>> {
        return this.api.v1SchemaTablePostWithHttpInfo(param.project, param.tableRequest,  options).toPromise();
    }

    /**
     * Creates a new table in the database.
     * @param param the request object
     */
    public v1SchemaTablePost(param: TableApiV1SchemaTablePostRequest, options?: Configuration): Promise<AbstractObjectServiceResult> {
        return this.api.v1SchemaTablePost(param.project, param.tableRequest,  options).toPromise();
    }

    /**
     * Updates a table in the database.
     * @param param the request object
     */
    public v1SchemaTablePutWithHttpInfo(param: TableApiV1SchemaTablePutRequest, options?: Configuration): Promise<HttpInfo<TableResponseIEnumerableServiceResult>> {
        return this.api.v1SchemaTablePutWithHttpInfo(param.project, param.table, param.tableRequest,  options).toPromise();
    }

    /**
     * Updates a table in the database.
     * @param param the request object
     */
    public v1SchemaTablePut(param: TableApiV1SchemaTablePutRequest, options?: Configuration): Promise<TableResponseIEnumerableServiceResult> {
        return this.api.v1SchemaTablePut(param.project, param.table, param.tableRequest,  options).toPromise();
    }

}

import { ObservableTestApi } from "./ObservableAPI";
import { TestApiRequestFactory, TestApiResponseProcessor} from "../apis/TestApi";

export interface TestApiV1PingGetRequest {
}

export class ObjectTestApi {
    private api: ObservableTestApi

    public constructor(configuration: Configuration, requestFactory?: TestApiRequestFactory, responseProcessor?: TestApiResponseProcessor) {
        this.api = new ObservableTestApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public v1PingGetWithHttpInfo(param: TestApiV1PingGetRequest = {}, options?: Configuration): Promise<HttpInfo<void>> {
        return this.api.v1PingGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1PingGet(param: TestApiV1PingGetRequest = {}, options?: Configuration): Promise<void> {
        return this.api.v1PingGet( options).toPromise();
    }

}

import { ObservableUserApi } from "./ObservableAPI";
import { UserApiRequestFactory, UserApiResponseProcessor} from "../apis/UserApi";

export interface UserApiV1UserDeleteRequest {
}

export interface UserApiV1UserGetRequest {
}

export interface UserApiV1UserPermissionsGetRequest {
    /**
     * 
     * Defaults to: undefined
     * @type string
     * @memberof UserApiv1UserPermissionsGet
     */
    projectId: string
}

export class ObjectUserApi {
    private api: ObservableUserApi

    public constructor(configuration: Configuration, requestFactory?: UserApiRequestFactory, responseProcessor?: UserApiResponseProcessor) {
        this.api = new ObservableUserApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public v1UserDeleteWithHttpInfo(param: UserApiV1UserDeleteRequest = {}, options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        return this.api.v1UserDeleteWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1UserDelete(param: UserApiV1UserDeleteRequest = {}, options?: Configuration): Promise<IServiceResult> {
        return this.api.v1UserDelete( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1UserGetWithHttpInfo(param: UserApiV1UserGetRequest = {}, options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        return this.api.v1UserGetWithHttpInfo( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1UserGet(param: UserApiV1UserGetRequest = {}, options?: Configuration): Promise<IServiceResult> {
        return this.api.v1UserGet( options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1UserPermissionsGetWithHttpInfo(param: UserApiV1UserPermissionsGetRequest, options?: Configuration): Promise<HttpInfo<IServiceResult>> {
        return this.api.v1UserPermissionsGetWithHttpInfo(param.projectId,  options).toPromise();
    }

    /**
     * @param param the request object
     */
    public v1UserPermissionsGet(param: UserApiV1UserPermissionsGetRequest, options?: Configuration): Promise<IServiceResult> {
        return this.api.v1UserPermissionsGet(param.projectId,  options).toPromise();
    }

}

import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
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

import { DataApiRequestFactory, DataApiResponseProcessor} from "../apis/DataApi";
export class ObservableDataApi {
    private requestFactory: DataApiRequestFactory;
    private responseProcessor: DataApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DataApiRequestFactory,
        responseProcessor?: DataApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DataApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DataApiResponseProcessor();
    }

    /**
     * Download a file from a blob field as a stream.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     */
    public v1DataTableBlobGetWithHttpInfo(project: string, table: number, record: number, field: string, _options?: Configuration): Observable<HttpInfo<Stream>> {
        const requestContextPromise = this.requestFactory.v1DataTableBlobGet(project, table, record, field, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1DataTableBlobGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Download a file from a blob field as a stream.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     */
    public v1DataTableBlobGet(project: string, table: number, record: number, field: string, _options?: Configuration): Observable<Stream> {
        return this.v1DataTableBlobGetWithHttpInfo(project, table, record, field, _options).pipe(map((apiResponse: HttpInfo<Stream>) => apiResponse.data));
    }

    /**
     * Upload a file to a blob field.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     * @param [data]
     */
    public v1DataTableBlobPostWithHttpInfo(project: string, table: number, record: number, field: string, data?: HttpFile, _options?: Configuration): Observable<HttpInfo<Stream>> {
        const requestContextPromise = this.requestFactory.v1DataTableBlobPost(project, table, record, field, data, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1DataTableBlobPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upload a file to a blob field.
     * @param project The project containing the table.
     * @param table The table containing the records.
     * @param record The record to be queried.
     * @param field The field of the record.
     * @param [data]
     */
    public v1DataTableBlobPost(project: string, table: number, record: number, field: string, data?: HttpFile, _options?: Configuration): Observable<Stream> {
        return this.v1DataTableBlobPostWithHttpInfo(project, table, record, field, data, _options).pipe(map((apiResponse: HttpInfo<Stream>) => apiResponse.data));
    }

    /**
     * Deletes all records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     */
    public v1DataTableClearDeleteWithHttpInfo(project: string, table: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.v1DataTableClearDelete(project, table, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1DataTableClearDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Deletes all records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     */
    public v1DataTableClearDelete(project: string, table: number, _options?: Configuration): Observable<void> {
        return this.v1DataTableClearDeleteWithHttpInfo(project, table, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table Id of table where you want to delete a record.
     * @param [record] record id to delete.
     */
    public v1DataTableDeleteWithHttpInfo(project: string, table: number, record?: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.v1DataTableDelete(project, table, record, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1DataTableDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table Id of table where you want to delete a record.
     * @param [record] record id to delete.
     */
    public v1DataTableDelete(project: string, table: number, record?: number, _options?: Configuration): Observable<void> {
        return this.v1DataTableDeleteWithHttpInfo(project, table, record, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     * @param [requestBody] An array of ids
     */
    public v1DataTableDeletePostWithHttpInfo(project: string, table: number, requestBody?: Array<string>, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.v1DataTableDeletePost(project, table, requestBody, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1DataTableDeletePostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Deletes records from the given table.
     * @param project The project containing the table.
     * @param table The table to delete from.
     * @param [requestBody] An array of ids
     */
    public v1DataTableDeletePost(project: string, table: number, requestBody?: Array<string>, _options?: Configuration): Observable<void> {
        return this.v1DataTableDeletePostWithHttpInfo(project, table, requestBody, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
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
    public v1DataTableGetWithHttpInfo(project: string, table: number, offset?: number, take?: number, joinQuery?: string, whereQuery?: string, sortQuery?: string, distinct?: boolean, select?: string, _options?: Configuration): Observable<HttpInfo<AbstractObjectQueryResult>> {
        const requestContextPromise = this.requestFactory.v1DataTableGet(project, table, offset, take, joinQuery, whereQuery, sortQuery, distinct, select, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1DataTableGetWithHttpInfo(rsp)));
            }));
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
    public v1DataTableGet(project: string, table: number, offset?: number, take?: number, joinQuery?: string, whereQuery?: string, sortQuery?: string, distinct?: boolean, select?: string, _options?: Configuration): Observable<AbstractObjectQueryResult> {
        return this.v1DataTableGetWithHttpInfo(project, table, offset, take, joinQuery, whereQuery, sortQuery, distinct, select, _options).pipe(map((apiResponse: HttpInfo<AbstractObjectQueryResult>) => apiResponse.data));
    }

    /**
     * Adds records to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param [createRecordRequest] 
     */
    public v1DataTablePostWithHttpInfo(project: string, table: number, createRecordRequest?: CreateRecordRequest, _options?: Configuration): Observable<HttpInfo<AbstractObjectQueryResult>> {
        const requestContextPromise = this.requestFactory.v1DataTablePost(project, table, createRecordRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1DataTablePostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Adds records to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param [createRecordRequest] 
     */
    public v1DataTablePost(project: string, table: number, createRecordRequest?: CreateRecordRequest, _options?: Configuration): Observable<AbstractObjectQueryResult> {
        return this.v1DataTablePostWithHttpInfo(project, table, createRecordRequest, _options).pipe(map((apiResponse: HttpInfo<AbstractObjectQueryResult>) => apiResponse.data));
    }

    /**
     * Updates records in the given table based on the values in record.
     * @param project The project containing the table.
     * @param table The table to be updated in.
     * @param [force] If you are certain you want to update all your records in case no ids were included.
     * @param [updateRecordRequest] 
     */
    public v1DataTablePutWithHttpInfo(project: string, table: number, force?: boolean, updateRecordRequest?: UpdateRecordRequest, _options?: Configuration): Observable<HttpInfo<AbstractObjectQueryResult>> {
        const requestContextPromise = this.requestFactory.v1DataTablePut(project, table, force, updateRecordRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1DataTablePutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Updates records in the given table based on the values in record.
     * @param project The project containing the table.
     * @param table The table to be updated in.
     * @param [force] If you are certain you want to update all your records in case no ids were included.
     * @param [updateRecordRequest] 
     */
    public v1DataTablePut(project: string, table: number, force?: boolean, updateRecordRequest?: UpdateRecordRequest, _options?: Configuration): Observable<AbstractObjectQueryResult> {
        return this.v1DataTablePutWithHttpInfo(project, table, force, updateRecordRequest, _options).pipe(map((apiResponse: HttpInfo<AbstractObjectQueryResult>) => apiResponse.data));
    }

}

import { FieldApiRequestFactory, FieldApiResponseProcessor} from "../apis/FieldApi";
export class ObservableFieldApi {
    private requestFactory: FieldApiRequestFactory;
    private responseProcessor: FieldApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: FieldApiRequestFactory,
        responseProcessor?: FieldApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new FieldApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new FieldApiResponseProcessor();
    }

    /**
     * Deletes the given field within the given table.
     * @param project The project containing the table.
     * @param table The table containing the given field.
     * @param field The field to be deleted
     */
    public v1SchemaTableFieldDeleteWithHttpInfo(project: string, table: number, field: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.v1SchemaTableFieldDelete(project, table, field, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaTableFieldDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Deletes the given field within the given table.
     * @param project The project containing the table.
     * @param table The table containing the given field.
     * @param field The field to be deleted
     */
    public v1SchemaTableFieldDelete(project: string, table: number, field: number, _options?: Configuration): Observable<void> {
        return this.v1SchemaTableFieldDeleteWithHttpInfo(project, table, field, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Gets field(s) from given table.
     * @param project The project containing the table.
     * @param table The table containing the fields.
     * @param [field] The optional field to get.
     */
    public v1SchemaTableFieldGetWithHttpInfo(project: string, table: number, field?: number, _options?: Configuration): Observable<HttpInfo<IServiceResult>> {
        const requestContextPromise = this.requestFactory.v1SchemaTableFieldGet(project, table, field, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaTableFieldGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Gets field(s) from given table.
     * @param project The project containing the table.
     * @param table The table containing the fields.
     * @param [field] The optional field to get.
     */
    public v1SchemaTableFieldGet(project: string, table: number, field?: number, _options?: Configuration): Observable<IServiceResult> {
        return this.v1SchemaTableFieldGetWithHttpInfo(project, table, field, _options).pipe(map((apiResponse: HttpInfo<IServiceResult>) => apiResponse.data));
    }

    /**
     * Adds a field to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param [fieldRequest] 
     */
    public v1SchemaTableFieldPostWithHttpInfo(project: string, table: number, fieldRequest?: FieldRequest, _options?: Configuration): Observable<HttpInfo<FieldResponseServiceResult>> {
        const requestContextPromise = this.requestFactory.v1SchemaTableFieldPost(project, table, fieldRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaTableFieldPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Adds a field to the given table.
     * @param project The project containing the table.
     * @param table The table to be added to.
     * @param [fieldRequest] 
     */
    public v1SchemaTableFieldPost(project: string, table: number, fieldRequest?: FieldRequest, _options?: Configuration): Observable<FieldResponseServiceResult> {
        return this.v1SchemaTableFieldPostWithHttpInfo(project, table, fieldRequest, _options).pipe(map((apiResponse: HttpInfo<FieldResponseServiceResult>) => apiResponse.data));
    }

    /**
     * Updates the given field in the given table.
     * @param project The project containing the table.
     * @param table The table containing the field.
     * @param field The field to be updated.
     * @param [fieldRequest] 
     */
    public v1SchemaTableFieldPutWithHttpInfo(project: string, table: number, field: number, fieldRequest?: FieldRequest, _options?: Configuration): Observable<HttpInfo<FieldResponseServiceResult>> {
        const requestContextPromise = this.requestFactory.v1SchemaTableFieldPut(project, table, field, fieldRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaTableFieldPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Updates the given field in the given table.
     * @param project The project containing the table.
     * @param table The table containing the field.
     * @param field The field to be updated.
     * @param [fieldRequest] 
     */
    public v1SchemaTableFieldPut(project: string, table: number, field: number, fieldRequest?: FieldRequest, _options?: Configuration): Observable<FieldResponseServiceResult> {
        return this.v1SchemaTableFieldPutWithHttpInfo(project, table, field, fieldRequest, _options).pipe(map((apiResponse: HttpInfo<FieldResponseServiceResult>) => apiResponse.data));
    }

}

import { OAuthApiRequestFactory, OAuthApiResponseProcessor} from "../apis/OAuthApi";
export class ObservableOAuthApi {
    private requestFactory: OAuthApiRequestFactory;
    private responseProcessor: OAuthApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: OAuthApiRequestFactory,
        responseProcessor?: OAuthApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new OAuthApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new OAuthApiResponseProcessor();
    }

    /**
     * @param revokeTokenRequest
     */
    public v1OauthRevokePostWithHttpInfo(revokeTokenRequest: RevokeTokenRequest, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.v1OauthRevokePost(revokeTokenRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1OauthRevokePostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param revokeTokenRequest
     */
    public v1OauthRevokePost(revokeTokenRequest: RevokeTokenRequest, _options?: Configuration): Observable<void> {
        return this.v1OauthRevokePostWithHttpInfo(revokeTokenRequest, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * @param grantType
     * @param clientId
     * @param clientSecret
     * @param [redirectUri]
     * @param [code]
     * @param [refreshToken]
     */
    public v1OauthTokenPostWithHttpInfo(grantType: string, clientId: string, clientSecret: string, redirectUri?: string, code?: string, refreshToken?: string, _options?: Configuration): Observable<HttpInfo<TokenResponse>> {
        const requestContextPromise = this.requestFactory.v1OauthTokenPost(grantType, clientId, clientSecret, redirectUri, code, refreshToken, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1OauthTokenPostWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param grantType
     * @param clientId
     * @param clientSecret
     * @param [redirectUri]
     * @param [code]
     * @param [refreshToken]
     */
    public v1OauthTokenPost(grantType: string, clientId: string, clientSecret: string, redirectUri?: string, code?: string, refreshToken?: string, _options?: Configuration): Observable<TokenResponse> {
        return this.v1OauthTokenPostWithHttpInfo(grantType, clientId, clientSecret, redirectUri, code, refreshToken, _options).pipe(map((apiResponse: HttpInfo<TokenResponse>) => apiResponse.data));
    }

}

import { ProjectApiRequestFactory, ProjectApiResponseProcessor} from "../apis/ProjectApi";
export class ObservableProjectApi {
    private requestFactory: ProjectApiRequestFactory;
    private responseProcessor: ProjectApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ProjectApiRequestFactory,
        responseProcessor?: ProjectApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ProjectApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ProjectApiResponseProcessor();
    }

    /**
     * Gets project(s) from the logged in user.
     * @param [project] The optional project guid to be fetched.
     */
    public v1SchemaProjectGetWithHttpInfo(project?: string, _options?: Configuration): Observable<HttpInfo<IServiceResult>> {
        const requestContextPromise = this.requestFactory.v1SchemaProjectGet(project, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaProjectGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Gets project(s) from the logged in user.
     * @param [project] The optional project guid to be fetched.
     */
    public v1SchemaProjectGet(project?: string, _options?: Configuration): Observable<IServiceResult> {
        return this.v1SchemaProjectGetWithHttpInfo(project, _options).pipe(map((apiResponse: HttpInfo<IServiceResult>) => apiResponse.data));
    }

    /**
     * Updates a project.
     * @param project The project to be updated.
     * @param [projectRequest] 
     */
    public v1SchemaProjectPutWithHttpInfo(project: string, projectRequest?: ProjectRequest, _options?: Configuration): Observable<HttpInfo<TableResponseIEnumerableServiceResult>> {
        const requestContextPromise = this.requestFactory.v1SchemaProjectPut(project, projectRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaProjectPutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Updates a project.
     * @param project The project to be updated.
     * @param [projectRequest] 
     */
    public v1SchemaProjectPut(project: string, projectRequest?: ProjectRequest, _options?: Configuration): Observable<TableResponseIEnumerableServiceResult> {
        return this.v1SchemaProjectPutWithHttpInfo(project, projectRequest, _options).pipe(map((apiResponse: HttpInfo<TableResponseIEnumerableServiceResult>) => apiResponse.data));
    }

}

import { ProjectTierApiRequestFactory, ProjectTierApiResponseProcessor} from "../apis/ProjectTierApi";
export class ObservableProjectTierApi {
    private requestFactory: ProjectTierApiRequestFactory;
    private responseProcessor: ProjectTierApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: ProjectTierApiRequestFactory,
        responseProcessor?: ProjectTierApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new ProjectTierApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new ProjectTierApiResponseProcessor();
    }

    /**
     * @param project
     */
    public v1ProjectTierCurrentGetWithHttpInfo(project: string, _options?: Configuration): Observable<HttpInfo<IServiceResult>> {
        const requestContextPromise = this.requestFactory.v1ProjectTierCurrentGet(project, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1ProjectTierCurrentGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param project
     */
    public v1ProjectTierCurrentGet(project: string, _options?: Configuration): Observable<IServiceResult> {
        return this.v1ProjectTierCurrentGetWithHttpInfo(project, _options).pipe(map((apiResponse: HttpInfo<IServiceResult>) => apiResponse.data));
    }

    /**
     * @param project
     */
    public v1ProjectTierGetWithHttpInfo(project: string, _options?: Configuration): Observable<HttpInfo<IServiceResult>> {
        const requestContextPromise = this.requestFactory.v1ProjectTierGet(project, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1ProjectTierGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param project
     */
    public v1ProjectTierGet(project: string, _options?: Configuration): Observable<IServiceResult> {
        return this.v1ProjectTierGetWithHttpInfo(project, _options).pipe(map((apiResponse: HttpInfo<IServiceResult>) => apiResponse.data));
    }

}

import { TableApiRequestFactory, TableApiResponseProcessor} from "../apis/TableApi";
export class ObservableTableApi {
    private requestFactory: TableApiRequestFactory;
    private responseProcessor: TableApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: TableApiRequestFactory,
        responseProcessor?: TableApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new TableApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new TableApiResponseProcessor();
    }

    /**
     * Deletes a table from the database.
     * @param project The project containing the table.
     * @param table The table to be deleted.
     */
    public v1SchemaTableDeleteWithHttpInfo(project: string, table: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.v1SchemaTableDelete(project, table, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaTableDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Deletes a table from the database.
     * @param project The project containing the table.
     * @param table The table to be deleted.
     */
    public v1SchemaTableDelete(project: string, table: number, _options?: Configuration): Observable<void> {
        return this.v1SchemaTableDeleteWithHttpInfo(project, table, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Gets table(s) from the logged in user.
     * @param project The project containing the table.
     * @param [table] name or id of the table to fetch (optional)
     */
    public v1SchemaTableGetWithHttpInfo(project: string, table?: string, _options?: Configuration): Observable<HttpInfo<IServiceResult>> {
        const requestContextPromise = this.requestFactory.v1SchemaTableGet(project, table, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaTableGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * Gets table(s) from the logged in user.
     * @param project The project containing the table.
     * @param [table] name or id of the table to fetch (optional)
     */
    public v1SchemaTableGet(project: string, table?: string, _options?: Configuration): Observable<IServiceResult> {
        return this.v1SchemaTableGetWithHttpInfo(project, table, _options).pipe(map((apiResponse: HttpInfo<IServiceResult>) => apiResponse.data));
    }

    /**
     * Creates a new table in the database.
     * @param project The project containing the table.
     * @param [tableRequest] 
     */
    public v1SchemaTablePostWithHttpInfo(project: string, tableRequest?: TableRequest, _options?: Configuration): Observable<HttpInfo<AbstractObjectServiceResult>> {
        const requestContextPromise = this.requestFactory.v1SchemaTablePost(project, tableRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaTablePostWithHttpInfo(rsp)));
            }));
    }

    /**
     * Creates a new table in the database.
     * @param project The project containing the table.
     * @param [tableRequest] 
     */
    public v1SchemaTablePost(project: string, tableRequest?: TableRequest, _options?: Configuration): Observable<AbstractObjectServiceResult> {
        return this.v1SchemaTablePostWithHttpInfo(project, tableRequest, _options).pipe(map((apiResponse: HttpInfo<AbstractObjectServiceResult>) => apiResponse.data));
    }

    /**
     * Updates a table in the database.
     * @param project The project containing the table.
     * @param [table] The table to be updated.
     * @param [tableRequest] 
     */
    public v1SchemaTablePutWithHttpInfo(project: string, table?: number, tableRequest?: TableRequest, _options?: Configuration): Observable<HttpInfo<TableResponseIEnumerableServiceResult>> {
        const requestContextPromise = this.requestFactory.v1SchemaTablePut(project, table, tableRequest, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1SchemaTablePutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Updates a table in the database.
     * @param project The project containing the table.
     * @param [table] The table to be updated.
     * @param [tableRequest] 
     */
    public v1SchemaTablePut(project: string, table?: number, tableRequest?: TableRequest, _options?: Configuration): Observable<TableResponseIEnumerableServiceResult> {
        return this.v1SchemaTablePutWithHttpInfo(project, table, tableRequest, _options).pipe(map((apiResponse: HttpInfo<TableResponseIEnumerableServiceResult>) => apiResponse.data));
    }

}

import { TestApiRequestFactory, TestApiResponseProcessor} from "../apis/TestApi";
export class ObservableTestApi {
    private requestFactory: TestApiRequestFactory;
    private responseProcessor: TestApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: TestApiRequestFactory,
        responseProcessor?: TestApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new TestApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new TestApiResponseProcessor();
    }

    /**
     */
    public v1PingGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.v1PingGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1PingGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public v1PingGet(_options?: Configuration): Observable<void> {
        return this.v1PingGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

}

import { UserApiRequestFactory, UserApiResponseProcessor} from "../apis/UserApi";
export class ObservableUserApi {
    private requestFactory: UserApiRequestFactory;
    private responseProcessor: UserApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: UserApiRequestFactory,
        responseProcessor?: UserApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new UserApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new UserApiResponseProcessor();
    }

    /**
     */
    public v1UserDeleteWithHttpInfo(_options?: Configuration): Observable<HttpInfo<IServiceResult>> {
        const requestContextPromise = this.requestFactory.v1UserDelete(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1UserDeleteWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public v1UserDelete(_options?: Configuration): Observable<IServiceResult> {
        return this.v1UserDeleteWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<IServiceResult>) => apiResponse.data));
    }

    /**
     */
    public v1UserGetWithHttpInfo(_options?: Configuration): Observable<HttpInfo<IServiceResult>> {
        const requestContextPromise = this.requestFactory.v1UserGet(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1UserGetWithHttpInfo(rsp)));
            }));
    }

    /**
     */
    public v1UserGet(_options?: Configuration): Observable<IServiceResult> {
        return this.v1UserGetWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<IServiceResult>) => apiResponse.data));
    }

    /**
     * @param projectId
     */
    public v1UserPermissionsGetWithHttpInfo(projectId: string, _options?: Configuration): Observable<HttpInfo<IServiceResult>> {
        const requestContextPromise = this.requestFactory.v1UserPermissionsGet(projectId, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.v1UserPermissionsGetWithHttpInfo(rsp)));
            }));
    }

    /**
     * @param projectId
     */
    public v1UserPermissionsGet(projectId: string, _options?: Configuration): Observable<IServiceResult> {
        return this.v1UserPermissionsGetWithHttpInfo(projectId, _options).pipe(map((apiResponse: HttpInfo<IServiceResult>) => apiResponse.data));
    }

}

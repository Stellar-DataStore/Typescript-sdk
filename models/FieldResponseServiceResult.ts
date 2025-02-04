/**
 * Stellar DataStore
 * The Stellar DataStore service is your instantly available, secure and worry-free cloud data storage service. Sign-up now and minutes later, you can start putting your data in the cloud.
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { FieldResponse } from '../models/FieldResponse';
import { ServiceMessage } from '../models/ServiceMessage';
import { HttpFile } from '../http/http';

export class FieldResponseServiceResult {
    'messages'?: Array<ServiceMessage> | null;
    'isSuccess'?: boolean;
    'data'?: FieldResponse;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "messages",
            "baseName": "messages",
            "type": "Array<ServiceMessage>",
            "format": ""
        },
        {
            "name": "isSuccess",
            "baseName": "isSuccess",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "data",
            "baseName": "data",
            "type": "FieldResponse",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return FieldResponseServiceResult.attributeTypeMap;
    }

    public constructor() {
    }
}

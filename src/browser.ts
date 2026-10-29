/*
 * Entry of the script-tag bundle (dist/stellards.global.min.js). It exposes one global, `StellarDS`, which is the
 * client class with the helpers attached: `new StellarDS({...})`, `StellarDS.where(...)`, `StellarDS.FieldType`,
 * `StellarDS.verifyWebhookSignature(...)`, `StellarDS.StellarDsError`.
 */
import * as sdk from './index.js';

const { StellarDS: Client, ...helpers } = sdk;
const StellarDS = Object.assign(Client, helpers, { StellarDS: Client });

export default StellarDS;

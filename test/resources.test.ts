import { describe, expect, it } from 'vitest';
import { DurationUnit, type StellarDS } from '../src/index.js';
import { client, mockFetch, ok } from './helpers.js';

const perms = {
  updateProject: true, deleteProject: false, createTables: true, deleteTables: false, ignoreMultitenant: false,
  manageAccessTokens: false, manageClients: false, manageWebhooks: false, updatePermissions: false, inviteUsers: false,
  readMembers: true, removeMembers: false,
};
const tablePerm = {
  tableName: 'Orders', readTable: true, updateTableMetadata: false, updateTable: false, createRecord: true,
  readRecords: true, deleteRecord: false, updateRecord: true,
};

type Case = [name: string, call: (c: StellarDS) => Promise<unknown>, expected: string, body?: unknown];

// [description, call, "METHOD /path?query", JSON body]
const cases: Case[] = [
  ['projects.list', (c) => c.projects.list(), 'GET /v1/schema/project'],
  ['projects.get', (c) => c.projects.get(), 'GET /v1/schema/project?project=p1'],
  ['projects.get other', (c) => c.projects.get('p9'), 'GET /v1/schema/project?project=p9'],
  ['projects.create', (c) => c.projects.create({ name: 'n', isMultitenant: false, allowNewUsers: true }), 'POST /v1/schema/project', { name: 'n', isMultitenant: false, allowNewUsers: true }],
  ['projects.update', (c) => c.projects.update({ name: 'n', isMultitenant: true, allowNewUsers: false }), 'PUT /v1/schema/project?project=p1', { name: 'n', isMultitenant: true, allowNewUsers: false }],
  ['projects.delete', (c) => c.projects.delete({ ownerId: 'u1' }), 'DELETE /v1/schema/project?project=p1&ownerId=u1'],
  ['projects.users', (c) => c.projects.users({ sortBy: 'email', sortType: 'asc', page: 1, pageSize: 20 }), 'GET /v1/schema/project/users?project=p1&sortBy=email&sortType=asc&page=1&pageSize=20'],
  ['projects.userCount', (c) => c.projects.userCount(), 'GET /v1/schema/project/user-count?project=p1'],
  ['projects.invitedUsers', (c) => c.projects.invitedUsers(), 'GET /v1/schema/project/invited-users?project=p1'],
  ['projects.appAccess', (c) => c.projects.appAccess(), 'GET /v1/schema/project/app-access'],
  ['projects.log', (c) => c.projects.log('2026-10-01'), 'GET /v1/schema/project/project-log?id=p1&logDate=2026-10-01'],
  ['projects.getOAuthDesign', (c) => c.projects.getOAuthDesign(), 'GET /v1/schema/project/oauth-design?projectid=p1'],
  ['projects.updateOAuthDesign', (c) => c.projects.updateOAuthDesign('d1', { useCustomDesign: true } as never), 'POST /v1/schema/project/oauth-design?project=p1&id=d1', { useCustomDesign: true }],
  ['tables.list', (c) => c.tables.list(), 'GET /v1/schema/table?project=p1'],
  ['tables.get by name', (c) => c.tables.get('My Orders'), 'GET /v1/schema/table?project=p1&table=My%20Orders'],
  ['tables.create', (c) => c.tables.create({ name: 'T', isMultitenant: false }), 'POST /v1/schema/table?project=p1', { name: 'T', isMultitenant: false }],
  ['tables.update', (c) => c.tables.update(3, { name: 'T2', isMultitenant: false }), 'PUT /v1/schema/table?project=p1&table=3', { name: 'T2', isMultitenant: false }],
  ['tables.delete', (c) => c.tables.delete(3), 'DELETE /v1/schema/table?project=p1&table=3'],
  ['fields.list', (c) => c.fields.list(3), 'GET /v1/schema/table/field?project=p1&table=3'],
  ['fields.get', (c) => c.fields.get(3, 8), 'GET /v1/schema/table/field?project=p1&table=3&field=8'],
  ['fields.delete', (c) => c.fields.delete(3, 8), 'DELETE /v1/schema/table/field?project=p1&table=3&field=8'],
  ['procedures.list', (c) => c.procedures.list(), 'GET /v1/procedures?project=p1'],
  ['procedures.get', (c) => c.procedures.get('report'), 'GET /v1/procedures/report?project=p1'],
  ['procedures.create', (c) => c.procedures.create({ name: 'report', steps: [{ name: 's', sql: 'select 1' }] }), 'POST /v1/procedures?project=p1', { name: 'report', steps: [{ name: 's', sql: 'select 1' }] }],
  ['procedures.update', (c) => c.procedures.update('report', { name: 'report', version: 2 }), 'PUT /v1/procedures/report?project=p1', { name: 'report', version: 2 }],
  ['procedures.delete', (c) => c.procedures.delete('report'), 'DELETE /v1/procedures/report?project=p1'],
  ['relations.list', (c) => c.relations.list({ tableId: 3 }), 'GET /v1/schema/relation?project=p1&tableId=3'],
  ['relations.check', (c) => c.relations.check(3, 8, 4), 'GET /v1/schema/relation/check?project=p1&table=3&field=8&toTable=4'],
  ['relations.create', (c) => c.relations.create(3, { newFieldName: 'customerId', toTableId: 4, onDelete: 'Cascade' }), 'POST /v1/schema/relation?project=p1&table=3', { newFieldName: 'customerId', toTableId: 4, onDelete: 'Cascade' }],
  ['relations.update', (c) => c.relations.update(3, 11, { onDelete: 'SetNull' }), 'PUT /v1/schema/relation?project=p1&table=3&relation=11', { onDelete: 'SetNull' }],
  ['relations.delete', (c) => c.relations.delete(3, 11), 'DELETE /v1/schema/relation?project=p1&table=3&relation=11'],
  ['relations.getLayout', (c) => c.relations.getLayout(), 'GET /v1/schema/relation/layout?project=p1'],
  ['relations.saveLayout', (c) => c.relations.saveLayout([{ tableId: 3, x: 10.5, y: 20 }]), 'PUT /v1/schema/relation/layout?project=p1', [{ tableId: 3, x: 10.5, y: 20 }]],
  ['roles.list', (c) => c.roles.list(), 'GET /v1/role?project=p1'],
  ['roles.get', (c) => c.roles.get('r1'), 'GET /v1/role?project=p1&role=r1'],
  ['roles.create', (c) => c.roles.create({ name: 'R', description: 'd', permissions: perms }), 'POST /v1/role?project=p1', { name: 'R', description: 'd', permissions: perms }],
  ['roles.update', (c) => c.roles.update('r1', { name: 'R', description: 'd', permissions: perms }), 'PUT /v1/role?project=p1&role=r1', { name: 'R', description: 'd', permissions: perms }],
  ['roles.delete', (c) => c.roles.delete('r1'), 'DELETE /v1/role?project=p1&role=r1'],
  ['roles.simple', (c) => c.roles.simple(), 'GET /v1/role/simple?project=p1'],
  ['roles.template', (c) => c.roles.template(), 'GET /v1/role/template?project=p1'],
  ['roles.topLevel', (c) => c.roles.topLevel('r1'), 'GET /v1/role/top-level?project=p1&role=r1'],
  ['roles.tableRolePermissions', (c) => c.roles.tableRolePermissions('Orders'), 'GET /v1/role/table-role-permissions?project=p1&tableName=Orders'],
  ['roles.getTable', (c) => c.roles.getTable('r1', 'Orders'), 'GET /v1/role/table?project=p1&role=r1&table=Orders'],
  ['roles.updateTable', (c) => c.roles.updateTable('r1', tablePerm), 'PUT /v1/role/table?project=p1&role=r1', tablePerm],
  ['roles.duplicate', (c) => c.roles.duplicate('r1', { name: 'Copy', description: 'd' }), 'POST /v1/role/duplicate?project=p1&roleId=r1', { name: 'Copy', description: 'd' }],
  ['roles.getMatrix', (c) => c.roles.getMatrix(), 'GET /v1/role/matrix?project=p1'],
  ['roles.updateMatrix', (c) => c.roles.updateMatrix({ roles: [{ roleId: 'r1', permissions: [1, 2] }] }), 'PUT /v1/role/matrix?project=p1', { roles: [{ roleId: 'r1', permissions: [1, 2] }] }],
  ['permissions.info', (c) => c.permissions.info(), 'GET /v1/permission/info'],
  ['audit.management', (c) => c.audit.management({ take: 20, offset: 40 }), 'GET /v1/logging/management?project=p1&take=20&offset=40'],
  ['audit.schema', (c) => c.audit.schema(), 'GET /v1/logging/schema?project=p1'],
  ['audit.rollback', (c) => c.audit.rollback('tx1', { force: true }), 'PUT /v1/logging/rollback?project=p1&transactionId=tx1&force=true'],
  ['webhooks.list', (c) => c.webhooks.list(), 'GET /v1/webhooks?project=p1'],
  ['webhooks.get', (c) => c.webhooks.get(5), 'GET /v1/webhooks/5?project=p1'],
  ['webhooks.create', (c) => c.webhooks.create({ url: 'https://h.test', events: ['record.created'], tableIds: [3] }), 'POST /v1/webhooks?project=p1', { isActive: true, url: 'https://h.test', events: ['record.created'], tableIds: [3] }],
  ['webhooks.update', (c) => c.webhooks.update(5, { url: 'https://h.test', isActive: false }), 'PUT /v1/webhooks/5?project=p1', { isActive: false, url: 'https://h.test' }],
  ['webhooks.delete', (c) => c.webhooks.delete(5), 'DELETE /v1/webhooks/5?project=p1'],
  ['webhooks.test', (c) => c.webhooks.test(5), 'POST /v1/webhooks/5/test?project=p1'],
  ['webhooks.rotateSecret', (c) => c.webhooks.rotateSecret(5), 'POST /v1/webhooks/5/rotate-secret?project=p1'],
  ['webhooks.deliveries', (c) => c.webhooks.deliveries(5, { offset: 0, take: 50 }), 'GET /v1/webhooks/5/deliveries?project=p1&offset=0&take=50'],
  ['webhooks.redeliver', (c) => c.webhooks.redeliver(5, 77), 'POST /v1/webhooks/5/deliveries/77/redeliver?project=p1'],
  ['users.me', (c) => c.users.me(), 'GET /v1/user'],
  ['users.deleteMe', (c) => c.users.deleteMe(), 'DELETE /v1/user'],
  ['users.permissions', (c) => c.users.permissions(), 'GET /v1/user/permissions?projectId=p1'],
  ['users.invite', (c) => c.users.invite({ role: 'r1', email: 'a@b.test', allowAppAccess: true }), 'POST /v1/user/invite?project=p1', { role: 'r1', email: 'a@b.test', allowAppAccess: true }],
  ['users.updateInvitation', (c) => c.users.updateInvitation(4, { role: 'r2', email: 'a@b.test', allowAppAccess: false }), 'PUT /v1/user/invitation?project=p1&id=4', { role: 'r2', email: 'a@b.test', allowAppAccess: false }],
  ['users.revokeInvitation', (c) => c.users.revokeInvitation(4), 'DELETE /v1/user/revoke-invitation?project=p1&id=4'],
  ['users.updateAccess', (c) => c.users.updateAccess({ email: 'a@b.test', role: 'r1', hasApplicationAccess: true }), 'PUT /v1/user/user-access?project=p1', { email: 'a@b.test', role: 'r1', hasApplicationAccess: true }],
  ['users.removeAccess', (c) => c.users.removeAccess('a+b@c.test'), 'DELETE /v1/user/remove-user-access?project=p1&email=a%2Bb%40c.test'],
  ['applications.listAccessTokens', (c) => c.applications.listAccessTokens(), 'GET /v1/application/access-token?project=p1'],
  ['applications.createAccessToken', (c) => c.applications.createAccessToken({ name: 'ci', role: 'r1', duration: 30, span: DurationUnit.Days }), 'POST /v1/application/access-token?project=p1', { name: 'ci', role: 'r1', duration: 30, span: 2 }],
  ['applications.updateAccessToken', (c) => c.applications.updateAccessToken({ accessTokenId: 'a1', name: 'ci', role: 'r1', duration: 1, span: DurationUnit.Unlimited }), 'PUT /v1/application/access-token?project=p1', { accessTokenId: 'a1', name: 'ci', role: 'r1', duration: 1, span: -1 }],
  ['applications.deleteAccessToken', (c) => c.applications.deleteAccessToken('a1'), 'DELETE /v1/application/access-token?project=p1&accessTokenId=a1'],
  ['applications.regenerateAccessToken', (c) => c.applications.regenerateAccessToken('a1'), 'POST /v1/application/generate-jwt-token?project=p1', 'a1'],
  ['applications.listClients', (c) => c.applications.listClients(), 'GET /v1/application/client?project=p1'],
  ['applications.createClient', (c) => c.applications.createClient({ name: 'web', role: 'r1', redirectUrls: ['https://a.test/cb'] }), 'POST /v1/application/client?project=p1', { name: 'web', role: 'r1', redirectUrls: ['https://a.test/cb'] }],
  ['applications.updateClient', (c) => c.applications.updateClient({ clientId: 'c1', name: 'web', role: 'r1', redirectUrls: [] }), 'PUT /v1/application/client?project=p1', { clientId: 'c1', name: 'web', role: 'r1', redirectUrls: [] }],
  ['applications.deleteClient', (c) => c.applications.deleteClient('c1'), 'DELETE /v1/application/client?project=p1&clientId=c1'],
  ['applications.regenerateClientSecret', (c) => c.applications.regenerateClientSecret('c1'), 'POST /v1/application/generate-new-secret?project=p1', 'c1'],
  ['projectTiers.get', (c) => c.projectTiers.get(), 'GET /v1/project-tier?project=p1'],
  ['projectTiers.current', (c) => c.projectTiers.current(), 'GET /v1/project-tier/current?project=p1'],
];

describe('resource routes', () => {
  it.each(cases)('%s', async (_name, call, expected, body) => {
    const m = mockFetch(() => ok({ value: 1 }));
    const result = await call(client(m.fetch));
    const c = m.calls[0]!;
    expect(`${c.method} ${c.url.pathname}${c.url.search}`).toBe(expected);
    expect(c.body).toEqual(body);
    expect(c.headers.authorization).toBe('Bearer tok');
    if (!/delete|rollback|invite|revoke|Access\b|removeAccess|updateAccess|updateInvitation/i.test(_name)) {
      expect(result).toEqual({ value: 1 });
    }
  });

  it('every route uses /v1', () => {
    for (const [, , expected] of cases) expect(expected.split(' ')[1]).toMatch(/^\/v1\//);
  });
});

import { StellarDS, StellarDsError, type RecordData, type Table } from 'stellards_typescript_sdk';

const token = import.meta.env.VITE_STELLARDS_TOKEN as string | undefined;
const project = import.meta.env.VITE_STELLARDS_PROJECT as string | undefined;
const baseUrl = import.meta.env.VITE_STELLARDS_BASE_URL as string | undefined;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const status = $('status');
const tableList = $<HTMLUListElement>('tables');
const records = $('records');
const title = $('title');
const more = $<HTMLButtonElement>('more');

const PAGE = 25;

function showError(e: unknown) {
  status.className = 'error';
  status.textContent =
    e instanceof StellarDsError ? `${e.message}${e.status ? ` (HTTP ${e.status})` : ''}` : String(e);
}

function renderRows(rows: RecordData[], append: boolean) {
  const columns = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  let table = records.querySelector('table');
  if (!append || !table) {
    records.textContent = '';
    if (rows.length === 0) {
      records.innerHTML = '<p class="muted">No records.</p>';
      return;
    }
    table = document.createElement('table');
    const head = table.createTHead().insertRow();
    for (const c of columns) head.appendChild(document.createElement('th')).textContent = c;
    table.createTBody();
    records.appendChild(table);
  }
  const headers = [...table.tHead!.rows[0]!.cells].map((c) => c.textContent ?? '');
  for (const row of rows) {
    const tr = table.tBodies[0]!.insertRow();
    for (const c of headers) {
      const v = row[c];
      tr.insertCell().textContent = v === null || v === undefined ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    }
  }
}

async function main() {
  if (!token || !project) {
    status.textContent = 'Set VITE_STELLARDS_TOKEN and VITE_STELLARDS_PROJECT in examples/vite-demo/.env.local.';
    return;
  }
  const client = new StellarDS({ accessToken: token, project, baseUrl });
  let controller: AbortController | undefined;
  let current: { table: Table; offset: number; count: number } | undefined;

  async function load(table: Table, append: boolean) {
    controller?.abort();
    controller = new AbortController();
    const offset = append && current ? current.offset : 0;
    try {
      status.textContent = `Loading ${table.name}…`;
      const page = await client.records.query(table.id, { take: PAGE, offset, sort: 'id;asc' }, { signal: controller.signal });
      current = { table, offset: offset + page.data.length, count: page.count };
      renderRows(page.data, append);
      title.textContent = `${table.name} (${page.count} records)`;
      more.hidden = current.offset >= page.count;
      status.textContent = '';
    } catch (e) {
      if ((e as Error).name !== 'AbortError') showError(e);
    }
  }

  more.addEventListener('click', () => current && load(current.table, true));

  try {
    const tables = await client.tables.list();
    status.textContent = tables.length ? '' : 'This project has no tables yet.';
    for (const table of tables) {
      const button = document.createElement('button');
      button.textContent = table.name;
      button.addEventListener('click', () => {
        tableList.querySelectorAll('button').forEach((b) => b.setAttribute('aria-current', String(b === button)));
        void load(table, false);
      });
      tableList.appendChild(document.createElement('li')).appendChild(button);
    }
    (tableList.querySelector('button') as HTMLButtonElement | null)?.click();
  } catch (e) {
    showError(e);
  }
}

void main();

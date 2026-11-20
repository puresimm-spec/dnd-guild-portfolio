// Integration test against a real PostgreSQL. Runs only when DATABASE_URL is set
// (CI starts a Postgres service for it); on a laptop without a database it is skipped.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const hasDb = Boolean(process.env.DATABASE_URL);

test('setup() loads seed.json and /api/portfolio serves it', { skip: !hasDb && 'DATABASE_URL not set' }, async () => {
  const { setup, getPortfolio, pool } = await import('../src/db.js');
  const { createApp } = await import('../src/app.js');

  await setup();
  await setup(); // a restart must be safe (schema uses IF NOT EXISTS, seed is a full refresh)

  const data = await getPortfolio();
  assert.ok(data.group.name);
  assert.ok(data.group.contact.email, 'group contact email');
  assert.ok(data.members.length > 0, 'real team members');
  assert.ok(data.members.every((m) => m.kind === 'team' && m.role), 'every member has a team role');
  assert.ok(data.characters.length > 0, 'sample characters for the training hall');
  assert.ok(data.characters.every((c) => c.kind === 'sample'));
  assert.equal(typeof data.group.en, 'object'); // English text column exists

  // the build advisor only accepts sample characters, never real members
  const { getCharacter } = await import('../src/db.js');
  assert.equal(await getCharacter(data.members[0].id), null);
  assert.equal((await getCharacter(data.characters[0].id)).name, data.characters[0].name);

  const server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const res = await fetch(`http://127.0.0.1:${server.address().port}/api/portfolio`);
  server.close();
  assert.equal(res.status, 200);
  assert.equal((await res.json()).members.length, data.members.length);

  await pool.end();
});

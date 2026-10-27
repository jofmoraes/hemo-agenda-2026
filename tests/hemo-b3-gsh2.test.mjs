import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const review = JSON.parse(await readFile(new URL('../data/b3-gsh2-review.json', import.meta.url)));
const patch = JSON.parse(await readFile(new URL('../data/b3-gsh2-filter-patch.json', import.meta.url)));
const schema = JSON.parse(await readFile(new URL('../data/b3-gsh2-review.schema.json', import.meta.url)));

test('B3 GSH2 mantém fonte offline, schema e 1.987 IDs', () => {
  assert.equal(review.kind, 'HEMO_B3_GSH2_REVIEW');
  assert.equal(review.schemaVersion, schema.properties.schemaVersion.const);
  assert.equal(review.status, 'READY_FOR_ORCHESTRATOR_REVIEW');
  assert.equal(review.coverage.inputRecords, 1987);
  assert.equal(review.coverage.uniqueIds, 1987);
  assert.equal(review.source.primarySha256, 'c14f63621b8ae2b38fc88ad12c851c2e708c3000776c32796893caa414b1a2bd');
  assert.equal(review.policy.sourceMode, 'offline_only');
  assert.equal(review.policy.automatedHemoQueries, false);
});

test('B3 GSH2 reconcilia categorias exclusivas e IDs íntegros', () => {
  assert.deepEqual(review.counts, { confirmedIds: 21, relatedTitleIds: 6, reviewOnlyIds: 5, falsePositiveIds: 1, futureFilterIds: 27, app1FilterIds: 27 });
  const groups = [review.ids.confirmedIds, review.ids.relatedTitleIds, review.ids.reviewOnlyIds, review.ids.falsePositiveIds];
  const all = groups.flat();
  assert.equal(new Set(all).size, 33);
  assert.equal(review.records.length, 33);
  assert.deepEqual(review.ids.relatedTitleIds, ['4514', '4599', '4601', '5163', '5383', '5594']);
  assert.deepEqual(review.ids.reviewOnlyIds, ['4067', '4097', '4264', '5626', '5894']);
  assert.deepEqual(review.ids.falsePositiveIds, ['3566']);
  assert.ok(review.records.every((item) => item.evidence.length > 0));
  assert.ok(review.records.every((item) => !('raw' in item) && !('abstract' in item) && !('sanitizedHTML' in item)));
});

test('B3 GSH2 audita leads e homônimo sem propagar relação', () => {
  assert.deepEqual(review.namedLeadAudit.sandraReginaLoggetto.allMatchingIds, ['4264', '4097', '5894', '5626']);
  assert.deepEqual(review.namedLeadAudit.edylaAlmeida.otherMatchingIds, ['4198', '5541', '6193', '4203', '5555', '5554', '5522', '5906', '5542']);
  assert.deepEqual(review.namedLeadAudit.eduardoFerroHomonym.matchingIds, ['3566']);
  assert.equal(review.authorExpansion.promotedAuthors.length, 0);
});

test('B3 GSH2 não altera o conjunto operacional do APP1', () => {
  assert.deepEqual(review.diffAgainstApp1.added, []);
  assert.deepEqual(review.diffAgainstApp1.removed, []);
  assert.equal(review.diffAgainstApp1.filterSetUnchanged, true);
  assert.deepEqual(patch.filterIds, review.ids.futureFilterIds);
  assert.equal(patch.publishable, false);
  assert.equal(patch.status, 'FUTURE_INTEGRATION_ONLY');
});

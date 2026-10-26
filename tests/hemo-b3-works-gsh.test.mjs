import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const research = JSON.parse(await readFile(new URL('../data/b3-works-gsh-research.json', import.meta.url), 'utf8'));
const schedule = JSON.parse(await readFile(new URL('../public/schedule.json', import.meta.url), 'utf8'));

test('inventario GSH permanece fail-closed quando a lista oficial esta bloqueada', () => {
  assert.equal(research.kind, 'HEMO_B3_WORKS_GSH_RESEARCH');
  assert.equal(research.status, 'BLOCKED_EXTERNAL');
  assert.equal(research.officialListAccess.httpStatus, 403);
  assert.equal(research.officialListAccess.bypassAttempted, false);
  assert.deepEqual(research.confirmedWorks, []);
  assert.deepEqual(research.candidateWorks, []);
});

test('agregado de 117 nao e promovido a trabalho individual', () => {
  const aggregate = research.aggregateReconciliationReferences[0];
  assert.equal(aggregate.count, 117);
  assert.equal(aggregate.modalities.painel, 100);
  assert.equal(aggregate.modalities.visita_guiada, 17);
  assert.equal(aggregate.status, 'aggregate_only');
  assert.equal(aggregate.title, null);
  assert.equal(aggregate.promotionRule.includes('Nao promover'), true);
});

test('evidencia de identidade nao inventa autoria HEMO 2026', () => {
  assert.equal(research.identityEvidence.length, 2);
  for (const identity of research.identityEvidence) {
    assert.equal(identity.provesGshAffiliation, true);
    assert.equal(identity.provesHemo2026Authorship, false);
  }
});

test('pesquisa propoe um unico filtro e nao altera a agenda publica', () => {
  assert.equal(research.futureInterface.singleFilter, 'Trabalhos GSH');
  assert.equal(research.publicAppImpact.changed, false);
  assert.equal(schedule.status, 'pending_b2');
  assert.deepEqual(schedule.sessions, []);
  assert.deepEqual(schedule.works, []);
});

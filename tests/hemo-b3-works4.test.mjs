import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const inventory = JSON.parse(await readFile(new URL('../data/b3-works4-inventory.json', import.meta.url)));
const gsh = JSON.parse(await readFile(new URL('../data/b3-works4-gsh.json', import.meta.url)));
const report = JSON.parse(await readFile(new URL('../data/b3-works4-report.json', import.meta.url)));
const schedule = JSON.parse(await readFile(new URL('../public/schedule.json', import.meta.url)));

test('B3 WORKS4 preserva os 1.987 IDs oficiais sem duplicidade', () => {
  assert.equal(inventory.works.length, 1987);
  assert.equal(new Set(inventory.works.map((work) => work.officialId)).size, 1987);
  assert.equal(report.validation.duplicateIds, 0);
  assert.equal(report.validation.jsonRecords, 1987);
  assert.equal(report.validation.csvRecords, 1987);
  assert.equal(report.validation.gshCsvRecords, 28);
});

test('B3 WORKS4 reconcilia os 40 assuntos sem inferir área individual', () => {
  assert.equal(report.validation.areaSubjects, 40);
  assert.equal(report.validation.areaDeclaredTotal, 1987);
  assert.equal(report.validation.areaAssociationsFromSavedDetails, 355);
  assert.equal(report.validation.areaAssociationsUnresolved, 1632);
  assert.equal(report.validation.inferredAreaAssignments, 0);
  assert.equal(inventory.areaReconciliation.length, 40);
  assert.equal(inventory.areaReconciliation.reduce((sum, area) => sum + area.declaredCount, 0), 1987);
  assert.ok(inventory.works.every((work) => work.area === null || work.areaStatus === 'saved_detail_verified'));
});

test('B3 WORKS4 recupera os 110 horários orais e sinaliza anomalia sem corrigir sem prova', () => {
  assert.equal(report.validation.oralExpected, 110);
  assert.equal(report.validation.oralTimesRecovered, 110);
  assert.equal(report.validation.oralTimesMissing, 0);
  assert.deepEqual(report.validation.oralTimeAnomalies.map((item) => item.id), ['3855']);
});

test('B3 WORKS4 preserva origem e registra correções de extração', () => {
  const titleCorrection = inventory.corrections.find((item) => item.id === '5769' && item.field === 'title');
  assert.equal(titleCorrection.normalizedValue, 'ANÁLISE DE AMOSTRAS RHD COM SCOR =<2+ NO LABORATÓRIO DE REFERÊNCIA');
  const authorCorrection = inventory.corrections.find((item) => item.id === '4510' && item.field === 'authors');
  assert.deepEqual(authorCorrection.normalizedValue, ['Isadora Geronimo Del Roio', 'Kely Alessandra De Almeida', 'Fabiana Hoelz']);
  const raw = inventory.works.find((work) => work.officialId === '4510').raw;
  assert.equal(raw.authorsText, 'MIASTENIA GRAVIS');
  assert.equal(inventory.works.find((work) => work.officialId === '4510').validation.authorsStatus, 'corrected_from_saved_detail');
  assert.equal(inventory.works.find((work) => work.officialId === '4510').raw.area, '');
  assert.equal(report.validation.titleCorrections, 1);
  assert.equal(report.validation.authorCorrections, 50);
});

test('B3 WORKS4 classifica o conceito único Trabalho GSH', () => {
  assert.deepEqual(gsh.counts, {
    AUTHORSHIP_CONFIRMED: 7,
    FALSE_POSITIVE: 1,
    INSTITUTION_CONFIRMED: 14,
    PENDING_VERIFICATION: 6
  });
  const byId = new Map(gsh.works.map((work) => [work.officialId, work]));
  for (const id of ['3939', '3941', '5960', '4307', '3911', '4538', '4548']) assert.equal(byId.get(id).gsh.status, 'AUTHORSHIP_CONFIRMED');
  assert.equal(byId.get('3566').gsh.status, 'FALSE_POSITIVE');
  assert.equal(byId.get('3566').raw.authorsText, 'Wagner Leite Miranda, Eduardo Ferro Dos Santos');
  assert.equal(gsh.filterProposal.tab, 'Trabalhos científicos');
  assert.equal(gsh.filterProposal.singleFilter, 'Trabalhos GSH');
  assert.equal(gsh.filterProposal.publishable, false);
});

test('B3 WORKS4 não publica os dados científicos no modo normal da agenda', () => {
  assert.equal(schedule.status, 'pending_b2');
  assert.deepEqual(schedule.sessions, []);
});

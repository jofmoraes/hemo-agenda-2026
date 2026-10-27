import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = path => fs.readFileSync(new URL('../'+path, import.meta.url), 'utf8');
const catalog = JSON.parse(read('public/works-catalog.json'));
const report = JSON.parse(read('data/b3-app1-catalog-report.json'));

test('B3 FINAL1: reconciliação WORKS4 preserva assuntos, horários e correções offline', () => {
  assert.equal(report.integrity.jsonRecords, 1987);
  assert.equal(report.integrity.csvRecords, 1987);
  assert.equal(report.integrity.uniqueIds, 1987);
  assert.equal(report.integrity.duplicateIds, 0);
  assert.equal(report.integrity.areaSubjects, 40);
  assert.equal(report.integrity.areaDeclaredTotal, 1987);
  assert.equal(report.integrity.areaAssociationsFromSavedDetails, 355);
  assert.equal(report.integrity.areaAssociationsUnresolved, 1632);
  assert.equal(report.integrity.inferredAreaAssignments, 0);
  assert.equal(report.integrity.oralExpected, 110);
  assert.equal(report.integrity.oralTimesRecovered, 110);
  assert.equal(report.integrity.oralTimesMissing, 0);
  assert.deepEqual(report.integrity.oralTimeAnomalies.map(item => item.id), ['3855']);
  assert.equal(report.integrity.titleCorrections, 1);
  assert.equal(report.integrity.authorCorrections, 50);
  assert.match(catalog.source.inputSha256, /^[a-f0-9]{64}$/);
  assert.equal(catalog.source.completenessVerified, false);
});

test('B3 FINAL1: catálogo mantém correções offline, desconhecidos e proveniência oficial', () => {
  const byId = new Map(catalog.works.map(work => [work.id, work]));
  assert.equal(byId.get('5769').title, 'ANÁLISE DE AMOSTRAS RHD COM SCOR =<2+ NO LABORATÓRIO DE REFERÊNCIA');
  assert.deepEqual(byId.get('4510').authors, ['Isadora Geronimo Del Roio', 'Kely Alessandra De Almeida', 'Fabiana Hoelz']);
  assert.equal(byId.get('4510').authorsStatus, 'corrected_from_saved_detail');
  assert.equal(byId.get('3855').time, null);
  assert.equal(byId.get('3855').timeStatus, 'anomaly_pending');
  assert.equal(byId.get('3855').area, null);
  assert.equal(byId.get('3566').gsh, null);
  assert.ok(catalog.works.every(work => /^https:\/\/hemo\.org\.br\//.test(work.sourceUrl)));
  assert.equal(report.rawFieldsExcluded.includes('raw'), true);
});

test('B3 FINAL1: backup antigo sem works e backup novo preservam sessões e trabalhos', () => {
  const source = read('public/b18.js');
  const functions = source.slice(source.indexOf('function parseJson('), source.indexOf('function dateInSaoPaulo('));
  const api = vm.runInNewContext(`
    const STATES=['Não analisado','Alto interesse','Talvez','Não vou'];
    const LEGACY={};
    const BACKUP_KIND='HEMO_2026_FLORA_BACKUP';
    const validId=id=>/^h26-[a-z0-9][a-z0-9._-]{2,90}$/i.test(String(id||''));
    ${functions}
    ({readItems,readWorkItems,validateImport});
  `, {Map, Error}, {timeout:5000});
  const session={sessionId:'h26-aaa',attending:true,interest:'Alto interesse'};
  const old=api.validateImport({kind:'HEMO_2026_FLORA_BACKUP',version:1,items:[session]});
  assert.equal(old.sessions.get('h26-aaa').attending, true);
  assert.equal(old.works.size, 0);
  const current=api.validateImport({kind:'HEMO_2026_FLORA_BACKUP',version:1,items:[session],works:[{workId:'3939',interest:'Talvez'}]});
  assert.equal(current.works.get('3939').interest, 'Talvez');
});

test('B3 FINAL1: namespace e merge preservador não apagam preferências anteriores', () => {
  const source = read('public/b18.js');
  assert.match(source, /const PREF_KEY='hemo2026:flora:preferences:v1'/);
  assert.match(source, /const WORKS_PREF_KEY='hemo2026:flora:works-preferences:v1'/);
  assert.match(source, /const replace=\$\('replaceImport'\)\.checked,merged=new Map\(st\.prefs\),mergedWorks=new Map\(st\.worksPrefs\)/);
  assert.match(source, /if\(replace&&updated&&!confirm\(/);
  assert.match(source, /Nenhum registro removido/);
});

test('B3 FINAL1: armazenamento indisponível falha fechado sem apagar preferências', () => {
  const source = read('public/b18.js');
  assert.match(source, /function warnStorage\s*\(\)\s*\{\s*st\.storageOk=false/);
  assert.match(source, /try\{localStorage\.setItem\(PREF_KEY/);
  assert.match(source, /catch\{warnStorage\(\);return false\}/);
  assert.match(source, /try\{localStorage\.setItem\(WORKS_PREF_KEY/);
  assert.match(source, /catch\{warnStorage\(\)\}/);
});

test('B3 FINAL1: abas móveis, parcialidade e catálogo sob demanda têm contrato explícito', () => {
  const html = read('public/index.html');
  const css = read('public/b18.css');
  const sw = read('public/service-worker.js');
  assert.match(html, /aria-describedby="tabScrollHint"/);
  assert.match(html, /id="tabScrollHint"[^>]*>Deslize horizontalmente/);
  assert.doesNotMatch(html, /preview=0|exitPreview/);
  assert.match(css, /\.tabs\{overflow-x:auto/);
  assert.match(css, /\.tab\{flex:0 0 auto;min-width:max-content/);
  assert.match(sw, /const CACHE='hemo2026:public:b3final1-v1'/);
  assert.doesNotMatch(sw, /const SHELL=\[[^\]]*works-catalog\.json/);
  assert.match(sw, /const DATA=new Set\(\[[^\]]*works-catalog\.json/);
  assert.match(sw, /await caches\.match\(request\)\)\|\|unavailableResponse/);
});

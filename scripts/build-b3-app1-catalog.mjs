import {createHash} from 'node:crypto';
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';

const sourceDir = process.env.HEMO_B3_SOURCE_DIR || 'D:\\JUCA\\AI Lab\\hemo-2026\\hemo-tampermonkey';
const inputName = 'HEMO2026_B3_WORKS4_INVENTORY.json';
const gshName = 'HEMO2026_B3_WORKS4_GSH.json';
const validationName = 'HEMO2026_B3_WORKS4_REPORT.json';
const outputPath = path.resolve('public/works-catalog.json');
const reportPath = path.resolve('data/b3-app1-catalog-report.json');
const leadIds = new Set(['4264', '4097', '5894', '5626', '4067']);

const sha256 = value => createHash('sha256').update(value).digest('hex');
const dateLabel = value => String(value || '').replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1');
const safeUrl = value => { try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; } };

function compactGsh(candidate) {
  if (!candidate || candidate.status === 'FALSE_POSITIVE') return null;
  if (candidate.status === 'AUTHORSHIP_CONFIRMED') return {
    status: 'AUTHORSHIP_CONFIRMED',
    label: 'Autoria GSH identificada',
    confidence: 'alta',
    explanation: 'Leandro Felipe Figueiredo Dalmazzo ou Eduardo Ferro de Carvalho aparece entre os autores do registro.'
  };
  if (candidate.status === 'INSTITUTION_CONFIRMED') return {
    status: 'INSTITUTION_CONFIRMED',
    label: 'Vínculo GSH evidenciado',
    confidence: 'alta',
    explanation: 'O texto oficial já capturado menciona Grupo GSH ou unidade do grupo; isso não declara vínculo profissional de todos os autores.'
  };
  return {
    status: 'TITLE_RELATED_PENDING_AFFILIATION',
    label: 'Relacionado à GSH pelo título',
    confidence: 'média',
    explanation: 'O título oficial menciona GSH; a afiliação formal dos autores permanece pendente porque o detalhe não foi capturado.'
  };
}

function compactWork(work, gshById) {
  const safeTime = work.modality === 'Apresentação Oral' && work.validation.oralTimeRecovered && !work.validation.oralTimeAnomaly && work.time
    ? {start: work.time.start.slice(0, 5), end: work.time.end.slice(0, 5), evidence: 'listMetaText'}
    : null;
  const authors = Array.isArray(work.authors) && work.authors.length ? work.authors : null;
  const pending = new Set();
  if (!authors || ['cleared_pending_detail', 'source_detail_mismatch_review'].includes(work.validation.authorsStatus)) pending.add('authors');
  if (!work.area) pending.add('area');
  if (work.modality === 'Apresentação Oral' && !safeTime) pending.add('time');
  if (work.source.detailStatus !== 'OK') pending.add('detail');
  if (work.validation.titleStatus !== 'source_list') pending.add('title_review');
  const sourceUrl = safeUrl(work.source.detailUrl || work.source.listUrl);
  return {
    id: work.officialId,
    title: work.title,
    authors,
    authorsStatus: authors ? work.validation.authorsStatus : 'unknown',
    modality: work.modality,
    day: work.dateIso,
    date: dateLabel(work.dateIso),
    time: safeTime,
    timeStatus: work.modality !== 'Apresentação Oral' ? 'not_applicable' : safeTime ? 'confirmed_from_list_meta' : work.validation.oralTimeAnomaly ? 'anomaly_pending' : 'unknown',
    room: work.room || null,
    area: work.area || null,
    areaStatus: work.area ? 'validated_from_saved_detail' : 'unknown',
    sourceUrl,
    sourceListUrl: safeUrl(work.source.listUrl),
    evidence: {
      detailStatus: work.source.detailStatus,
      authors: work.validation.authorsStatus,
      area: work.validation.areaEvidence || 'not_available',
      time: safeTime ? 'listMetaText' : work.validation.oralTimeAnomaly ? 'anomaly_not_published_as_time' : 'not_available'
    },
    pendingFields: [...pending],
    gsh: compactGsh(gshById.get(work.officialId))
  };
}

async function main() {
  const inventoryRaw = await readFile(path.join(sourceDir, inputName));
  const gshRaw = await readFile(path.join(sourceDir, gshName));
  const validationRaw = await readFile(path.join(sourceDir, validationName));
  const inventory = JSON.parse(inventoryRaw);
  const gshInventory = JSON.parse(gshRaw);
  const validationReport = JSON.parse(validationRaw);
  if (inventory.kind !== 'HEMO_B3_WORKS4_INVENTORY' || inventory.works.length !== 1987) throw new Error('Inventário B3 inesperado.');
  if (gshInventory.kind !== 'HEMO_B3_WORKS4_GSH_INVENTORY') throw new Error('Inventário GSH B3 inesperado.');
  const gshById = new Map(gshInventory.works.map(work => [String(work.officialId), work.gsh]));
  const works = inventory.works.map(work => compactWork(work, gshById));
  const ids = new Set(works.map(work => work.id));
  if (ids.size !== works.length || works.some(work => !work.id || !work.title || !work.sourceUrl)) throw new Error('Catálogo compacto inválido.');
  const catalog = {
    kind: 'HEMO_2026_WORKS_CATALOG',
    schemaVersion: '1.0',
    status: 'partial_catalog',
    event: 'HEMO 2026',
    timezone: 'America/Sao_Paulo',
    checkedAt: inventory.source.exportedAt,
    source: {
      listUrl: inventory.source.url,
      capturedAt: inventory.source.exportedAt,
      completenessVerified: false,
      records: works.length,
      detailOk: inventory.coverage.detailOk,
      detailPending: inventory.coverage.detailPending,
      detailBlocked: inventory.coverage.detailBlocked,
      areaValidated: inventory.coverage.areaAssociationsFromSavedDetails,
      areaPending: inventory.coverage.areaAssociationsUnresolved,
      oralTimesRecovered: inventory.coverage.oralTimesRecovered,
      oralTimeAnomalies: inventory.validation?.oralTimeAnomalies?.map(item => item.id) || ['3855'],
      inputSha256: sha256(inventoryRaw),
      gshInputSha256: sha256(gshRaw)
    },
    counts: {
      records: works.length,
      byModality: Object.fromEntries([...new Set(works.map(work => work.modality))].sort().map(modality => [modality, works.filter(work => work.modality === modality).length])),
      byDay: Object.fromEntries([...new Set(works.map(work => work.day))].sort().map(day => [day, works.filter(work => work.day === day).length])),
      gshIncluded: works.filter(work => work.gsh).length,
      gshByStatus: Object.fromEntries([...new Set(works.filter(work => work.gsh).map(work => work.gsh.status))].sort().map(status => [status, works.filter(work => work.gsh?.status === status).length]))
    },
    gshReview: {
      filterLabel: 'Trabalhos GSH',
      minimumIdentified: 21,
      includedInFilter: works.filter(work => work.gsh).length,
      institutionalDisclosure117IsNotIndividualCatalog: true,
      excludedLeads: [...leadIds].map(id => ({id, status: 'LEAD_NOT_INCLUDED', reason: 'Nome localizado no export offline, sem evidência individual suficiente para atribuição GSH.'}))
    },
    works
  };
  const report = {
    kind: 'HEMO_B3_APP1_CATALOG_REPORT',
    status: 'READY_FOR_AUDIT',
    generatedAt: new Date().toISOString(),
    output: 'public/works-catalog.json',
    outputBytes: Buffer.byteLength(JSON.stringify(catalog)),
    records: works.length,
    uniqueIds: ids.size,
    gshIncluded: works.filter(work => work.gsh).length,
    gshLeadsExcluded: [...leadIds],
    rawFieldsExcluded: ['raw', 'listMetaText', 'detail', 'sanitizedHTML', 'summary', 'keywords', 'resources'],
    sourceInput: {inventory: inputName, gsh: gshName, validation: validationName, directory: sourceDir},
    integrity: validationReport.validation
  };
  await mkdir(path.dirname(outputPath), {recursive: true});
  await mkdir(path.dirname(reportPath), {recursive: true});
  await writeFile(outputPath, `${JSON.stringify(catalog)}\n`, 'utf8');
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({status: report.status, records: report.records, bytes: report.outputBytes, gshIncluded: report.gshIncluded, gshLeadsExcluded: report.gshLeadsExcluded}));
}

main().catch(error => { console.error(error); process.exitCode = 1; });

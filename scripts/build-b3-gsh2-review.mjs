import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceDir = process.env.HEMO_B3_SOURCE_DIR || 'D:\\JUCA\\AI Lab\\hemo-2026\\hemo-tampermonkey';
const app1CatalogPath = process.env.HEMO_B3_APP1_CATALOG || path.resolve(repoRoot, '..', 'hemo-2026-app-b3-app1-works', 'public', 'works-catalog.json');
const sourceName = 'HEMO2026_TRABALHOS_2026-10-27T15-08-54-380Z_COMPLETO.json';
const sourceGshInventoryPath = path.join(repoRoot, 'data', 'b3-works4-gsh.json');
const reviewOutputPath = path.join(repoRoot, 'data', 'b3-gsh2-review.json');
const patchOutputPath = path.join(repoRoot, 'data', 'b3-gsh2-filter-patch.json');

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'));
const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const fold = (value) => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
const sourcePath = path.join(sourceDir, sourceName);

function excerpt(value, term) {
  const text = clean(value);
  const lower = fold(text);
  const index = lower.indexOf(fold(term));
  return index < 0 ? null : text.slice(Math.max(0, index - 120), index + term.length + 220);
}

async function sha256(filePath) {
  const bytes = await readFile(filePath);
  const info = await stat(filePath);
  return { name: path.basename(filePath), bytes: info.size, sha256: createHash('sha256').update(bytes).digest('hex') };
}

function sourceSummary(work) {
  return {
    officialId: String(work.id),
    title: work.title,
    authors: Array.isArray(work.authors) ? work.authors : [],
    modality: work.modality,
    date: work.date,
    room: work.room || null,
    detailStatus: work.detailStatus,
    listUrl: work.listUrl,
    detailUrl: work.detailUrl
  };
}

function authorEvidence(work, matchedName) {
  return {
    kind: 'official_authors_field',
    field: 'authors',
    matched: matchedName,
    value: work.authorsText,
    source: 'offline_export.works[].authors'
  };
}

function titleEvidence(work) {
  return {
    kind: 'official_title_field',
    field: 'title',
    value: work.title,
    source: 'offline_export.works[].title'
  };
}

function gshEvidence(work) {
  const detail = work.detail?.text || '';
  if (/\bGSH\b/i.test(work.title)) return { kind: 'official_title_field', field: 'title', value: work.title, source: 'offline_export.works[].title' };
  const detailMatch = detail.match(/\bGSH\b|Grupo Gestor de Serviços de Hemoterapia/i);
  if (detailMatch) return { kind: 'official_detail_text', field: 'detail.text', value: excerpt(detail, detailMatch[0]), source: 'offline_export.works[].detail.text' };
  return null;
}

function record(work, status, confidence, evidence, decision, notes = []) {
  return {
    ...sourceSummary(work),
    status,
    confidence,
    evidence,
    decision,
    notes
  };
}

function idMap(works) {
  return new Map(works.map((work) => [String(work.id), work]));
}

async function main() {
  const source = await readJson(sourcePath);
  const oldGsh = await readJson(sourceGshInventoryPath);
  const app1 = await readJson(app1CatalogPath);
  const works = source.works;
  const byId = idMap(works);
  const ids = works.map((work) => String(work.id));
  if (works.length !== 1987 || new Set(ids).size !== 1987) throw new Error('A fonte offline não contém exatamente 1.987 IDs únicos.');

  const sourceFiles = oldGsh.source.files;
  const sourceHash = sourceFiles.find((file) => file.name === sourceName)?.sha256;
  const actualHash = (await sha256(sourcePath)).sha256;
  if (sourceHash !== actualHash) throw new Error(`Hash da fonte diverge: esperado ${sourceHash}, atual ${actualHash}.`);

  const authorIds = {
    leandro: ids.filter((id) => byId.get(id).authors?.some((name) => /leandro.*dalmazzo/i.test(fold(name)))),
    eduardoCarvalho: ids.filter((id) => byId.get(id).authors?.some((name) => /^eduardo ferro(?: de)? carvalho$/i.test(clean(name)))),
    eduardoHomonym: ids.filter((id) => byId.get(id).authors?.some((name) => /eduardo ferro/i.test(fold(name)) && !/carvalho/i.test(fold(name)))),
    sandra: ids.filter((id) => byId.get(id).authors?.some((name) => fold(name) === 'sandra regina loggetto')),
    edyla: ids.filter((id) => byId.get(id).authors?.some((name) => /edyla.*almeida/i.test(fold(name))))
  };
  if (authorIds.leandro.join(',') !== '3939,3941,5960,4307') throw new Error('A busca nominal de Leandro não reconcilia.');
  if (authorIds.eduardoCarvalho.join(',') !== '3911,4538,4548') throw new Error('A busca nominal de Eduardo Ferro de Carvalho não reconcilia.');
  if (authorIds.eduardoHomonym.join(',') !== '3566') throw new Error('O controle do homônimo Eduardo Ferro não reconcilia.');
  if (authorIds.sandra.join(',') !== '4264,4097,5894,5626') throw new Error('A busca nominal de Sandra não reconcilia.');
  if (authorIds.edyla.length !== 11 || !authorIds.edyla.includes('4067') || !authorIds.edyla.includes('4307')) throw new Error('A busca nominal de Édyla não reconcilia.');

  const titleGshIds = ids.filter((id) => /\bGSH\b/i.test(byId.get(id).title)).sort((a, b) => Number(a) - Number(b));
  const detailGshIds = ids.filter((id) => /\bGSH\b|Grupo Gestor de Serviços de Hemoterapia/i.test(byId.get(id).detail?.text || '')).sort((a, b) => Number(a) - Number(b));
  const allGshMentionIds = [...new Set([...titleGshIds, ...detailGshIds])].sort((a, b) => Number(a) - Number(b));
  const expectedTitleIds = ['4514', '4599', '4601', '5163', '5383', '5594'].sort((a, b) => Number(a) - Number(b));
  const expectedInstitutionIds = ['4243', '4510', '3997', '5452', '5403', '5756', '5769', '5660', '3732', '3887', '4900', '5125', '5454', '6362'];
  if (!expectedTitleIds.every((id) => titleGshIds.includes(id))) throw new Error('A busca de títulos GSH não reconcilia.');
  if (allGshMentionIds.length !== 20) throw new Error('A união de menções GSH não reconcilia.');

  const records = [];
  for (const id of authorIds.leandro) records.push(record(byId.get(id), 'AUTHOR_IDENTITY_CONFIRMED', 'high', [authorEvidence(byId.get(id), 'Leandro Felipe Figueiredo Dalmazzo')], 'confirmed', ['A identidade institucional de Leandro vem da evidência corporativa já registrada em data/b3-works-gsh-research.json; esta execução não refez consulta externa.']));
  for (const id of authorIds.eduardoCarvalho) records.push(record(byId.get(id), 'AUTHOR_IDENTITY_CONFIRMED', 'high', [authorEvidence(byId.get(id), byId.get(id).authors.find((name) => /^eduardo ferro(?: de)? carvalho$/i.test(clean(name))))], 'confirmed', ['A identidade institucional de Eduardo vem da evidência corporativa já registrada em data/b3-works-gsh-research.json; esta execução não refez consulta externa.']));
  for (const id of expectedInstitutionIds) records.push(record(byId.get(id), 'GSH_INSTITUTION_EVIDENCED', 'high', [gshEvidence(byId.get(id))], 'confirmed_relation', ['A prova é do trabalho relacionado à GSH; não prova vínculo profissional atual de cada coautor.']));
  for (const id of expectedTitleIds) records.push(record(byId.get(id), 'GSH_TITLE_EVIDENCED_AUTHORSHIP_UNVERIFIED', 'medium', [titleEvidence(byId.get(id))], 'related_by_title', ['O título comprova relação temática/institucional com GSH, mas a afiliação individual dos autores não foi confirmada porque o detalhe permanece pendente.']));
  for (const id of authorIds.sandra) records.push(record(byId.get(id), 'LEAD_NEEDS_EVIDENCE', id === '4264' || id === '4097' ? 'medium' : 'low', [authorEvidence(byId.get(id), 'Sandra Regina Loggetto'), { kind: 'prior_institutional_lead', source: 'data/b3-works-gsh-research.json', sourceUrl: 'https://br.linkedin.com/company/grupogsh', sourceStatus: 'pre-existing_record_not_refetched', value: 'A publicação institucional previamente registrada cita Sandra Loggetto em dois trabalhos sobre eventos tromboembólicos pediátricos e transição do cuidado.' }], 'review_only', ['A correspondência de nome e, nos IDs 4264/4097, de tema, cria pista; não prova afiliação GSH no registro HEMO.']));
  records.push(record(byId.get('4067'), 'LEAD_NEEDS_EVIDENCE', 'medium', [authorEvidence(byId.get('4067'), 'Edyla Almeida'), { kind: 'prior_institutional_lead', source: 'data/b3-works-gsh-research.json', sourceUrl: 'https://br.linkedin.com/company/grupogsh', sourceStatus: 'pre-existing_record_not_refetched', value: 'A publicação institucional previamente registrada cita Édyla Almeida em trabalho reconhecido sobre hepatites B/C em doadores.' }], 'review_only', ['O nome e o tema correspondem à pista institucional, mas o registro HEMO não contém afiliação GSH capturada.']));
  records.push(record(byId.get('3566'), 'FALSE_POSITIVE', 'high', [{ kind: 'author_mismatch', field: 'authors', value: byId.get('3566').authorsText, source: 'offline_export.works[].authors' }], 'excluded', ['Eduardo Ferro dos Santos não é Eduardo Ferro de Carvalho; homônimo não promove relação GSH.']));
  records.sort((a, b) => Number(a.officialId) - Number(b.officialId));

  const reviewIds = records.map((item) => item.officialId);
  const confirmedIds = records.filter((item) => ['AUTHOR_IDENTITY_CONFIRMED', 'GSH_INSTITUTION_EVIDENCED'].includes(item.status)).map((item) => item.officialId).sort((a, b) => Number(a) - Number(b));
  const relatedTitleIds = records.filter((item) => item.status === 'GSH_TITLE_EVIDENCED_AUTHORSHIP_UNVERIFIED').map((item) => item.officialId).sort((a, b) => Number(a) - Number(b));
  const reviewOnlyIds = records.filter((item) => item.status === 'LEAD_NEEDS_EVIDENCE').map((item) => item.officialId).sort((a, b) => Number(a) - Number(b));
  const falsePositiveIds = records.filter((item) => item.status === 'FALSE_POSITIVE').map((item) => item.officialId).sort((a, b) => Number(a) - Number(b));
  const futureFilterIds = [...confirmedIds, ...relatedTitleIds].sort((a, b) => Number(a) - Number(b));
  const app1Works = app1.works;
  const app1GshIds = app1Works.filter((work) => work.gsh && !['FALSE_POSITIVE'].includes(work.gsh.status)).map((work) => String(work.id)).sort((a, b) => Number(a) - Number(b));
  const statusById = new Map(records.map((item) => [item.officialId, item.status]));
  const app1StatusById = new Map(app1Works.filter((work) => work.gsh).map((work) => [String(work.id), work.gsh.status]));
  const changed = futureFilterIds.filter((id) => app1StatusById.get(id) !== statusById.get(id)).map((id) => ({ id, from: app1StatusById.get(id), to: statusById.get(id) }));
  if (app1GshIds.join(',') !== futureFilterIds.join(',')) throw new Error('O conjunto de 27 IDs não reconcilia com o APP1.');

  const institutionAuthors = new Map();
  for (const id of expectedInstitutionIds) for (const author of byId.get(id).authors) {
    const list = institutionAuthors.get(author) || [];
    list.push(id);
    institutionAuthors.set(author, list);
  }
  const authorExpansion = [...institutionAuthors.entries()].sort(([a], [b]) => a.localeCompare(b, 'pt-BR')).map(([name, workIds]) => ({ name, workIds: workIds.sort((a, b) => Number(a) - Number(b)), promoted: false }));

  const review = {
    kind: 'HEMO_B3_GSH2_REVIEW',
    schemaVersion: '1.0',
    status: 'READY_FOR_ORCHESTRATOR_REVIEW',
    event: 'HEMO 2026',
    concept: 'Trabalhos GSH',
    reviewedOn: '2026-10-27',
    policy: {
      sourceMode: 'offline_only',
      automatedHemoQueries: false,
      publicApplicationChanged: false,
      individualAuthorFilters: false,
      aggregate117IsNotIndividualEvidence: true,
      titleRelationDoesNotProveAuthorEmployment: true
    },
    source: {
      url: oldGsh.source.url,
      exportCreatedAt: oldGsh.source.exportedAt,
      primaryFile: sourceName,
      primarySha256: actualHash,
      files: sourceFiles
    },
    coverage: {
      inputRecords: works.length,
      uniqueIds: new Set(ids).size,
      gshMentionIds: allGshMentionIds,
      gshMentionCount: allGshMentionIds.length,
      gshMentionByField: { title: titleGshIds, detailText: detailGshIds, authorsText: [], institutionsText: [] },
      namedSearch: authorIds,
      reviewedRecordCount: reviewIds.length
    },
    counts: {
      confirmedIds: confirmedIds.length,
      relatedTitleIds: relatedTitleIds.length,
      reviewOnlyIds: reviewOnlyIds.length,
      falsePositiveIds: falsePositiveIds.length,
      futureFilterIds: futureFilterIds.length,
      app1FilterIds: app1GshIds.length
    },
    ids: { confirmedIds, relatedTitleIds, reviewOnlyIds, falsePositiveIds, futureFilterIds },
    records,
    namedLeadAudit: {
      sandraReginaLoggetto: { allMatchingIds: authorIds.sandra, reviewOnlyIds: authorIds.sandra, decision: 'não promovida sem afiliação individual GSH capturada' },
      edylaAlmeida: { allMatchingIds: authorIds.edyla, leadId: '4067', alreadyConfirmedByLeandroId: '4307', otherMatchingIds: authorIds.edyla.filter((id) => !['4067', '4307'].includes(id)), decision: 'somente 4067 permanece como lead; não propagar a pista para os outros nove IDs' },
      eduardoFerroHomonym: { matchingIds: authorIds.eduardoHomonym, decision: '3566 excluído como falso positivo' }
    },
    authorExpansion: {
      institutionalWorkIds: expectedInstitutionIds,
      repeatedAuthors: authorExpansion,
      promotedAuthors: [],
      rule: 'Relação do grupo não é propagada a todos os coautores ou a todos os trabalhos de uma pessoa sem prova individual.'
    },
    diffAgainstApp1: {
      baseBranch: 'feat/hemo-b3-app1-works',
      baseSha: '3df073a088188a04bf3f8e201c24c94f3d5a96e9',
      added: futureFilterIds.filter((id) => !app1GshIds.includes(id)),
      removed: app1GshIds.filter((id) => !futureFilterIds.includes(id)),
      changed,
      filterSetUnchanged: true
    },
    limitations: [
      'A prova institucional de Leandro/Eduardo foi herdada do registro de pesquisa anterior e não foi reconsultada nesta missão.',
      'Os leads de Sandra e Édyla têm autoria nominal e pista institucional previamente registrada, mas não têm afiliação GSH individual capturada no export.',
      'O PDF de 196 MB não foi copiado nem convertido; seus metadados/hash já constam na proveniência anterior.',
      'Os 117 trabalhos divulgados pela GSH permanecem referência agregada e não denominador de IDs individuais.'
    ]
  };
  const patch = {
    kind: 'HEMO_B3_GSH2_FILTER_PATCH',
    schemaVersion: '1.0',
    status: 'FUTURE_INTEGRATION_ONLY',
    baseCatalog: { branch: 'feat/hemo-b3-app1-works', sha: '3df073a088188a04bf3f8e201c24c94f3d5a96e9' },
    filter: 'Trabalhos GSH',
    confirmedIds,
    relatedTitleIds,
    reviewOnlyIds,
    falsePositiveIds,
    filterIds: futureFilterIds,
    added: [],
    removed: [],
    changed,
    publishable: false,
    integrationRule: 'Aplicar somente em futura rodada autorizada de integração, com regressão e smoke; não sobrescrever public/works-catalog.json nesta missão.'
  };
  await import('node:fs/promises').then(({ writeFile }) => Promise.all([
    writeFile(reviewOutputPath, `${JSON.stringify(review, null, 2)}\n`, 'utf8'),
    writeFile(patchOutputPath, `${JSON.stringify(patch, null, 2)}\n`, 'utf8')
  ]));
  console.log(JSON.stringify({ status: review.status, input: works.length, reviewed: records.length, counts: review.counts, diff: review.diffAgainstApp1 }, null, 2));
}

await main();

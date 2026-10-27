import { createHash } from 'node:crypto';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceDir = process.env.HEMO_B3_SOURCE_DIR || 'D:\\JUCA\\AI Lab\\hemo-2026\\hemo-tampermonkey';
const repoDataDir = path.join(repoRoot, 'data');
const localOutDir = process.env.HEMO_B3_LOCAL_OUT_DIR || sourceDir;
const jsonName = 'HEMO2026_TRABALHOS_2026-10-27T15-08-54-380Z_COMPLETO.json';
const csvName = 'HEMO2026_TRABALHOS_2026-10-27T15-08-54-380Z_TRABALHOS.csv';
const gshCsvName = 'HEMO2026_TRABALHOS_2026-10-27T15-08-54-380Z_GSH_CANDIDATOS.csv';
const coverageName = 'HEMO2026_TRABALHOS_2026-10-27T15-08-54-380Z_COBERTURA.txt';
const pdfName = 'Hemo 2026 - Relação Trabalhos.pdf';

const readText = (name) => readFile(path.join(sourceDir, name), 'utf8');
const sha256 = async (filePath) => {
  const hash = createHash('sha256');
  hash.update(await readFile(filePath));
  const info = await stat(filePath);
  return { name: path.basename(filePath), bytes: info.size, sha256: hash.digest('hex') };
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ';' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const headers = rows.shift().map((value) => value.replace(/^\uFEFF/, ''));
  return rows.filter((values) => values.some(Boolean)).map((values) => Object.fromEntries(headers.map((header, i) => [header, values[i] ?? ''])));
}

function clean(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function parseAuthors(value) {
  return clean(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function parseMeta(meta) {
  const text = clean(meta);
  const timeMatch = text.match(/das ([0-9]{2}:[0-9]{2}:[0-9]{2}) às ([0-9]{2}:[0-9]{2}:[0-9]{2})/);
  const dateMatch = text.match(/Dia ([0-9]{2}\/[0-9]{2}\/[0-9]{4})/);
  const roomMatch = text.match(/Sala: (.+)$/);
  const modalityMatch = text.match(/Forma de apresentação: (.+?) \|/);
  return {
    modality: modalityMatch?.[1] ?? null,
    date: dateMatch?.[1] ?? null,
    start: timeMatch?.[1] ?? null,
    end: timeMatch?.[2] ?? null,
    room: roomMatch?.[1] ?? null
  };
}

function dateIso(date) {
  const match = String(date ?? '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
}

function validDate(date) {
  return ['28/10/2026', '29/10/2026', '30/10/2026', '31/10/2026'].includes(date);
}

function minutes(time) {
  const [hour, minute, second] = time.split(':').map(Number);
  return hour * 60 + minute + second / 60;
}

function extractDetailAuthors(text) {
  const match = String(text ?? '').match(/Autores\s+([\s\S]*?)(?:\s+Português|\s+English)/i);
  return match ? parseAuthors(match[1]) : [];
}

function extractDetailArea(text) {
  const match = String(text ?? '').match(/Área\s+([\s\S]*?)\s+Autores/i);
  return match ? clean(match[1]) : null;
}

const malformedAuthorIds = new Set([
  '3474', '5342', '6377', '4951', '5424', '4510', '4884', '4110', '3627', '3881',
  '3645', '4477', '3834', '5839', '4549', '5347', '5451', '5870', '3934', '4266',
  '4442', '4773', '5015', '5183', '5584', '5450', '5700', '5731', '5779', '3565',
  '5218', '5495', '5852', '5868', '6131', '4857', '4223', '4346', '4388', '3489',
  '5328', '5526', '4197', '6023', '6348', '5197', '3567'
]);

const authorMatchIds = new Set(['3939', '3941', '5960', '4307', '3911', '4538', '4548']);
const falsePositiveIds = new Set(['3566']);

function excerpt(text, term) {
  const source = clean(text);
  const index = source.toLocaleLowerCase('pt-BR').indexOf(term.toLocaleLowerCase('pt-BR'));
  return index < 0 ? null : source.slice(Math.max(0, index - 90), index + term.length + 180);
}

function classification(candidate, work, normalized) {
  if (falsePositiveIds.has(work.id)) {
    return {
      status: 'FALSE_POSITIVE',
      confidence: 'high',
      reason: 'O autor registrado é Eduardo Ferro Dos Santos, diferente de Eduardo Ferro de Carvalho.',
      evidence: [{ kind: 'author_mismatch', value: work.authorsText }]
    };
  }
  if (authorMatchIds.has(work.id)) {
    return {
      status: 'AUTHORSHIP_CONFIRMED',
      confidence: 'high',
      reason: 'Nome do autor coincide com Leandro Felipe Figueiredo Dalmazzo ou Eduardo Ferro de Carvalho, incluindo a variante sem "de".',
      evidence: [{ kind: 'official_authors_field', value: work.authorsText }]
    };
  }
  const evidenceText = [work.title, work.authorsText, work.institutionsText, work.detail?.text, work.detail?.sanitizedHTML].filter(Boolean).join(' ');
  const institutionMatch = /\bGSH\b|Grupo Gestor de Serviços de Hemoterapia/i.test(evidenceText);
  const evidence = [{ kind: 'official_text', value: excerpt(evidenceText, 'GSH') || excerpt(evidenceText, 'Grupo Gestor de Serviços de Hemoterapia') }].filter((item) => item.value);
  if (institutionMatch && work.detailStatus === 'OK') {
    return { status: 'INSTITUTION_CONFIRMED', confidence: 'high', reason: 'Afiliação/unidade GSH aparece no título ou no detalhe oficial já capturado.', evidence };
  }
  return {
    status: 'PENDING_VERIFICATION',
    confidence: 'medium',
    reason: 'Candidato identificado pela listagem, mas o detalhe oficial não foi capturado ou não há prova suficiente além do termo de triagem.',
    evidence
  };
}

async function main() {
  await mkdir(repoDataDir, { recursive: true });
  await mkdir(localOutDir, { recursive: true });
  const sourcePath = path.join(sourceDir, jsonName);
  const source = JSON.parse(await readFile(sourcePath, 'utf8'));
  const csvRows = parseCsv(await readText(csvName));
  const gshCsvRows = parseCsv(await readText(gshCsvName));
  const coverageText = await readText(coverageName);
  const sourceFiles = await Promise.all([jsonName, csvName, gshCsvName, coverageName, pdfName].map((name) => sha256(path.join(sourceDir, name))));
  const works = source.works;
  const ids = works.map((work) => String(work.id));
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (works.length !== 1987 || new Set(ids).size !== 1987 || duplicateIds.length) throw new Error('Inventário não contém exatamente 1.987 IDs únicos.');
  if (csvRows.length !== works.length || new Set(csvRows.map((row) => row.id)).size !== works.length) throw new Error('CSV geral não reconcilia com os 1.987 trabalhos JSON.');
  if (gshCsvRows.length !== source.gshCandidates.length) throw new Error('CSV GSH não reconcilia com gshCandidates do JSON.');

  const areaOptions = new Map((source.coverage.areaOptions ?? []).map((area) => [area.name, area.value]));
  const areaControls = source.coverage.controls.filter((control) => control.area && control.clicked).map((control) => {
    const count = Number(control.label.match(/([0-9]+) registros encontrados/)?.[1] ?? NaN);
    return { area: control.area, controlValue: areaOptions.get(control.area) ?? null, declaredCount: count, sourceControl: control };
  });
  if (areaControls.length !== 40 || areaControls.some((area) => !Number.isInteger(area.declaredCount)) || areaControls.reduce((sum, area) => sum + area.declaredCount, 0) !== works.length) {
    throw new Error('Os 40 assuntos não reconciliam com a soma de 1.987 registros.');
  }

  const corrections = [];
  const normalizedWorks = works.map((work) => {
    const meta = parseMeta(work.listMetaText);
    const detailText = work.detail?.text ?? '';
    const detailArea = work.detailStatus === 'OK' ? extractDetailArea(detailText) : null;
    const detailAuthors = work.detailStatus === 'OK' ? extractDetailAuthors(detailText) : [];
    const sourceAuthors = Array.isArray(work.authors) ? work.authors : parseAuthors(work.authorsText);
    const malformedAuthors = malformedAuthorIds.has(String(work.id));
    let authors = sourceAuthors;
    let authorsStatus = 'source_list';
    if (malformedAuthors && detailAuthors.length) {
      authors = detailAuthors;
      authorsStatus = 'corrected_from_saved_detail';
      corrections.push({ id: work.id, field: 'authors', originalValue: work.authorsText, normalizedValue: authors, reason: 'O campo da listagem contém uma expressão do título; autores recuperados do detalhe oficial já salvo.' });
    } else if (malformedAuthors) {
      authors = [];
      authorsStatus = 'cleared_pending_detail';
      corrections.push({ id: work.id, field: 'authors', originalValue: work.authorsText, normalizedValue: [], reason: 'O campo da listagem contém uma expressão técnica do título, não um nome; detalhe não capturado, portanto autores permanecem pendentes.' });
    } else if (detailAuthors.length && sourceAuthors.join('|') !== detailAuthors.join('|')) {
      authorsStatus = 'source_detail_mismatch_review';
      corrections.push({ id: work.id, field: 'authors', originalValue: sourceAuthors, normalizedValue: sourceAuthors, reason: 'A listagem e o detalhe salvo divergem; valor da listagem preservado até revisão manual.', detailValue: detailAuthors });
    }
    let title = work.title;
    let titleStatus = 'source_list';
    if (String(work.id) === '5769') {
      title = 'ANÁLISE DE AMOSTRAS RHD COM SCOR =<2+ NO LABORATÓRIO DE REFERÊNCIA';
      titleStatus = 'corrected_from_saved_detail';
      corrections.push({ id: work.id, field: 'title', originalValue: work.title, normalizedValue: title, reason: 'Título da listagem foi truncado após "SCOR ="; trecho completo aparece no HTML do detalhe oficial já salvo.' });
    }
    const oral = work.modality === 'Apresentação Oral';
    const time = meta.start && meta.end ? { start: meta.start, end: meta.end, raw: `${meta.start} às ${meta.end}`, source: 'listMetaText' } : null;
    const timeAnomaly = time && (minutes(time.end) <= minutes(time.start) || minutes(time.end) - minutes(time.start) > 120);
    const classificationData = source.gshCandidates.find((candidate) => String(candidate.id) === String(work.id));
    const areaStatus = detailArea && areaOptions.has(detailArea) ? 'saved_detail_verified' : 'unresolved';
    return {
      officialId: String(work.id),
      displayedNumber: work.displayedNumber || null,
      title,
      authors,
      institutions: work.institutionsText ? parseAuthors(work.institutionsText) : [],
      modality: work.modality,
      date: work.date,
      dateIso: dateIso(work.date),
      time,
      room: work.room || null,
      panelNumber: work.panelNumber || null,
      area: areaStatus === 'saved_detail_verified' ? detailArea : null,
      areaStatus,
      source: {
        listUrl: work.listUrl || source.source,
        detailUrl: work.detailUrl || null,
        capturedAt: source.createdAt,
        detailCapturedAt: work.detail?.capturedAt ?? null,
        detailStatus: work.detailStatus,
        verification: work.detailStatus === 'OK' ? 'list_and_saved_detail' : work.detailStatus === 'HTTP_403' ? 'list_only_detail_blocked' : 'list_only_detail_pending'
      },
      validation: {
        dateValid: validDate(work.date),
        metadataDateMatches: !meta.date || meta.date === work.date,
        metadataModalityMatches: !meta.modality || meta.modality === work.modality,
        metadataRoomMatches: !meta.room || meta.room === work.room,
        oralTimeRecovered: oral ? Boolean(time) : null,
        oralTimeAnomaly: Boolean(timeAnomaly),
        authorsStatus,
        titleStatus,
        areaEvidence: detailArea ? 'detail.text' : null,
        missingFields: [
          ...(!work.institutionsText ? ['institutions'] : []),
          ...(areaStatus === 'unresolved' ? ['area'] : []),
          ...(!time ? ['time'] : []),
          ...(work.detailStatus !== 'OK' ? ['detail'] : [])
        ]
      },
      listMetaText: work.listMetaText || null,
      gshCandidate: classificationData ? classification(classificationData, work, { title, authors }) : null,
      raw: work
    };
  });

  const oralWorks = normalizedWorks.filter((work) => work.modality === 'Apresentação Oral');
  const gshWorks = normalizedWorks.filter((work) => work.gshCandidate);
  const dateCounts = Object.fromEntries([...new Set(normalizedWorks.map((work) => work.date))].sort().map((date) => [date, normalizedWorks.filter((work) => work.date === date).length]));
  const modalityCounts = Object.fromEntries([...new Set(normalizedWorks.map((work) => work.modality))].sort().map((modality) => [modality, normalizedWorks.filter((work) => work.modality === modality).length]));
  const areaRows = areaControls.map((area) => ({
    area: area.area,
    controlValue: area.controlValue,
    declaredCount: area.declaredCount,
    recordsWithSavedDetailArea: normalizedWorks.filter((work) => work.area === area.area).length,
  }));
  const report = {
    kind: 'HEMO_B3_WORKS4_OFFLINE_REPORT',
    status: 'READY_FOR_AUDIT',
    generatedAt: new Date().toISOString(),
    source: { url: source.source, exportedAt: source.createdAt, provenance: source.provenance, files: sourceFiles },
    validation: {
      jsonRecords: works.length,
      csvRecords: csvRows.length,
      gshCsvRecords: gshCsvRows.length,
      uniqueIds: new Set(ids).size,
      duplicateIds: duplicateIds.length,
      coverageTextRecords: Number(coverageText.match(/Trabalhos individuais: (\d+)/)?.[1] ?? 0),
      sourceCoverageUnique: source.coverage.unique,
      areaSubjects: areaControls.length,
      areaDeclaredTotal: areaControls.reduce((sum, area) => sum + area.declaredCount, 0),
      areaAssociationsFromSavedDetails: normalizedWorks.filter((work) => work.areaStatus === 'saved_detail_verified').length,
      areaAssociationsUnresolved: normalizedWorks.filter((work) => work.areaStatus === 'unresolved').length,
      inferredAreaAssignments: 0,
      oralExpected: oralWorks.length,
      oralTimesRecovered: oralWorks.filter((work) => work.time).length,
      oralTimesMissing: oralWorks.filter((work) => !work.time).length,
      oralTimeAnomalies: oralWorks.filter((work) => work.validation.oralTimeAnomaly).map((work) => ({ id: work.officialId, time: work.time })),
      titleCorrections: corrections.filter((item) => item.field === 'title').length,
      authorCorrections: corrections.filter((item) => item.field === 'authors').length,
      detailOk: works.filter((work) => work.detailStatus === 'OK').length,
      detailPending: works.filter((work) => work.detailStatus === 'PENDENTE').length,
      detailBlocked: works.filter((work) => work.detailStatus === 'HTTP_403').length,
      dates: dateCounts,
      modalities: modalityCounts,
      gshCandidates: gshWorks.length,
      gshByStatus: Object.fromEntries([...new Set(gshWorks.map((work) => work.gshCandidate.status))].sort().map((status) => [status, gshWorks.filter((work) => work.gshCandidate.status === status).length]))
    },
    areaReconciliation: areaRows,
    corrections,
    limitations: [
      'A área individual só foi atribuída quando aparece no detalhe oficial já salvo; não houve inferência por ordem dos IDs ou por contagem acumulada.',
      'O PDF complementar foi preservado e teve metadados conferidos, mas não foi convertido integralmente nesta rodada.',
      'Detalhes pendentes ou bloqueados não foram requisitados novamente.'
    ]
  };
  const inventory = {
    kind: 'HEMO_B3_WORKS4_INVENTORY',
    schemaVersion: '1.0',
    status: 'READY_FOR_AUDIT',
    event: 'HEMO 2026',
    generatedAt: report.generatedAt,
    source: report.source,
    coverage: report.validation,
    areaReconciliation: areaRows,
    corrections,
    works: normalizedWorks
  };
  const gshInventory = {
    kind: 'HEMO_B3_WORKS4_GSH_INVENTORY',
    schemaVersion: '1.0',
    status: 'READY_FOR_AUDIT',
    event: 'HEMO 2026',
    generatedAt: report.generatedAt,
    concept: 'Trabalho GSH',
    source: report.source,
    counts: report.validation.gshByStatus,
    works: gshWorks.map((work) => ({
      officialId: work.officialId,
      title: work.title,
      authors: work.authors,
      modality: work.modality,
      date: work.date,
      time: work.time,
      room: work.room,
      area: work.area,
      areaStatus: work.areaStatus,
      source: work.source,
      validation: work.validation,
      gsh: work.gshCandidate,
      raw: work.raw
    })),
    filterProposal: { tab: 'Trabalhos científicos', singleFilter: 'Trabalhos GSH', publishable: false }
  };
  const outputs = [
    ['b3-works4-inventory.json', inventory],
    ['b3-works4-gsh.json', gshInventory],
    ['b3-works4-report.json', report]
  ];
  for (const [name, data] of outputs) {
    const serialized = `${JSON.stringify(data, null, 2)}\n`;
    await writeFile(path.join(repoDataDir, name), serialized, 'utf8');
    const stem = name.replace('b3-works4-', '').replace('.json', '').toUpperCase();
    await writeFile(path.join(localOutDir, `HEMO2026_B3_WORKS4_${stem}.json`), serialized, 'utf8');
  }
  console.log(JSON.stringify({
    status: report.status,
    records: inventory.works.length,
    areas: areaRows.length,
    areaDeclaredTotal: report.validation.areaDeclaredTotal,
    oralTimesRecovered: report.validation.oralTimesRecovered,
    gsh: report.validation.gshByStatus,
    corrections: corrections.length,
    repoDataDir,
    localOutDir
  }, null, 2));
}

await main();

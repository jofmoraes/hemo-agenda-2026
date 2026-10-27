export const WORKS_PAGE_SIZE = 30;
export const WORKS_GSH_STATUSES = Object.freeze(['AUTHORSHIP_CONFIRMED', 'INSTITUTION_CONFIRMED', 'TITLE_RELATED_PENDING_AFFILIATION']);

export function normalizeWork(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function auditWorksCatalog(data) {
  const errors = [];
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['Catálogo ausente ou inválido'];
  if (data.kind !== 'HEMO_2026_WORKS_CATALOG') errors.push('Identidade do catálogo inválida');
  if (data.schemaVersion !== '1.0') errors.push('Versão do catálogo inválida');
  if (data.status !== 'partial_catalog') errors.push('Catálogo não está marcado como parcial');
  if (data.timezone !== 'America/Sao_Paulo') errors.push('Fuso do catálogo inválido');
  if (!Array.isArray(data.works)) errors.push('Coleção de trabalhos inválida');
  if (errors.length) return errors;
  const ids = new Set();
  for (const work of data.works) {
    if (!work || typeof work !== 'object') { errors.push('Trabalho inválido'); continue; }
    if (!/^\d{1,8}$/.test(String(work.id)) || ids.has(work.id)) errors.push('ID inválido/duplicado: '+work.id);
    ids.add(work.id);
    if (typeof work.title !== 'string' || !work.title.trim()) errors.push('Título ausente: '+work.id);
    if (!Array.isArray(work.authors) && work.authors !== null) errors.push('Autores inválidos: '+work.id);
    if (!['Apresentação Oral', 'Painel', 'Visita Guiada'].includes(work.modality)) errors.push('Modalidade inválida: '+work.id);
    if (!/^2026-10-(28|29|30|31)$/.test(work.day)) errors.push('Data inválida: '+work.id);
    if (typeof work.sourceUrl !== 'string' || !/^https:\/\//.test(work.sourceUrl)) errors.push('Fonte inválida: '+work.id);
    if (work.time !== null && (!work.time || !/^\d{2}:\d{2}$/.test(work.time.start) || !/^\d{2}:\d{2}$/.test(work.time.end))) errors.push('Horário inválido: '+work.id);
    if (work.modality === 'Apresentação Oral' && work.id === '3855' && work.time !== null) errors.push('Horário anômalo publicado: 3855');
    if (work.gsh && !WORKS_GSH_STATUSES.includes(work.gsh.status)) errors.push('Status GSH inválido: '+work.id);
    if (work.gsh && work.id === '3566') errors.push('Falso positivo GSH publicado: 3566');
    if (Object.keys(work).some(key => ['raw', 'detail', 'listMetaText', 'sanitizedHTML', 'summary', 'keywords', 'resources'].includes(key))) errors.push('Campo bruto proibido: '+work.id);
  }
  if (data.source?.completenessVerified !== false) errors.push('Catálogo não declara cobertura parcial');
  if (data.works.length !== 1987) errors.push('Total de trabalhos divergente');
  return errors;
}

export function workSearchText(work) {
  return [work.id, work.title, ...(work.authors || []), work.modality, work.day, work.room, work.area, work.gsh?.label].filter(Boolean).join(' ');
}

export function filterWorks(works, opts = {}, prefs = new Map()) {
  const query = normalizeWork(opts.search).trim();
  return works.filter(work => {
    const preference = prefs.get(work.id) || {};
    const saved = preference.interest && preference.interest !== 'Não analisado';
    return (!query || normalizeWork(workSearchText(work)).includes(query))
      && (!opts.day || work.day === opts.day)
      && (!opts.modality || work.modality === opts.modality)
      && (!opts.gshOnly || Boolean(work.gsh))
      && (!opts.savedOnly || saved);
  });
}

export function paginateWorks(works, page = 1, pageSize = WORKS_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(works.length / pageSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  return {items: works.slice((safePage - 1) * pageSize, safePage * pageSize), page: safePage, totalPages};
}

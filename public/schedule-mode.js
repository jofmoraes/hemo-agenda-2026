import {auditSchedule,minutes} from './schedule-utils.js';
export const PREVIEW_QUERY='preview';
export const PREVIEW_STATUS='partial_preview';
export const PROGRAM_KIND='HEMO_2026_PROGRAM';
export const EXPECTED_DAYS=['2026-10-28','2026-10-29','2026-10-30','2026-10-31'];
export const SOURCE_URL='https://hemo.org.br/evento/hemo2026/pt/programacao/lista';

// Preview is opt-in. No fallback from bad preview data to "verified" or vice versa.
export function previewRequested(query=''){
 const params=new URLSearchParams(query);
 return params.get(PREVIEW_QUERY)==='1';
}
export function schedulePath(query=''){
 return previewRequested(query)?'/preview-schedule.json':'/schedule.json';
}
export function auditProgramDataset(data,{preview=false}={}){
 const errors=[];
 if(!data||typeof data!=='object'||Array.isArray(data))return ['Documento HEMO ausente/inválido'];
 if(data.kind!==PROGRAM_KIND)errors.push('Identidade HEMO inválida');
 if(data.timezone!=='America/Sao_Paulo')errors.push('Fuso HEMO inválido');
 if(JSON.stringify(data.days)!==JSON.stringify(EXPECTED_DAYS))errors.push('Quatro dias não conferem');
 for(const k of ['sessions','talks','works','exhibitors'])if(!Array.isArray(data[k]))errors.push('Coleção inválida: '+k);
 if(errors.length)return errors;
 const status=preview?PREVIEW_STATUS:data.status;
 if(data.status!==status&&preview)errors.push('Modo de prévia não autorizado pelo status');
 if(!preview&&!['pending_b2','verified'].includes(data.status))errors.push('Contrato de produção rejeita prévia');
 if(data.status==='pending_b2'&&['sessions','talks','works','exhibitors'].some(k=>data[k].length))errors.push('Pendente não pode ter registros');
 if(data.status==='verified'&&(!data.sessions.length||!data.checkedAt||!Number.isFinite(Date.parse(data.checkedAt))))errors.push('Verificado sem data ou sessões');
 if(data.status==='verified'&&(data.coverage?.completenessVerified===false||data.sourceInventory?.status==='PARTIAL_NOT_PUBLISHABLE'))errors.push('Produção verificada não aceita inventário parcial');
 if(preview){
  if(data.coverage?.completenessVerified!==false)errors.push('Prévia não pode declarar completude');
  if(data.sourceInventory?.status!=='PARTIAL_NOT_PUBLISHABLE')errors.push('Inventário de prévia sem proveniência de parcialidade');
  if(!data.sessions.length||!data.checkedAt||!Number.isFinite(Date.parse(data.checkedAt)))errors.push('Prévia sem registros ou data');
  if(data.coverage?.availableSessions!==data.sessions.length||data.coverage?.availableTalks!==data.talks.length)errors.push('Contagem de registros disponíveis diverge');
  if(data.coverage?.missingStage!==data.sessions.filter(s=>typeof s.stage!=='string'||!s.stage.trim()).length)errors.push('Contagem de salas a confirmar diverge');
  for(const day of EXPECTED_DAYS){
   const count=data.sessions.filter(s=>s.day===day).length;
   if(!count||data.coverage?.knownSessions?.[day.slice(-2)]!==count)errors.push('Cobertura parcial não reconciliada: '+day);
  }
 }
 errors.push(...auditSchedule(data.sessions).errors);
 const ids=new Set(data.sessions.map(s=>s.id)),childIds=new Set();
 for(const talk of data.talks){
  if(!talk||typeof talk!=='object'){errors.push('Palestra inválida');continue}
  if(typeof talk.id!=='string'||!/^h26-[a-z0-9._-]{3,130}$/i.test(talk.id)||childIds.has(talk.id))errors.push('ID de fala inválido/duplicado: '+talk.id);
  childIds.add(talk.id);
  const parent=data.sessions.find(s=>s.id===talk.parentSessionId);
  if(!ids.has(talk.parentSessionId)||!parent)errors.push('Palestra órfã: '+talk.id);
  else if(minutes(talk.start)===null||minutes(talk.end)===null||minutes(talk.start)>=minutes(talk.end)||talk.start<parent.start||talk.end>parent.end)errors.push('Palestra fora do intervalo: '+talk.id);
  if(typeof talk.sourceUrl!=='string'||!/^https:\/\//.test(talk.sourceUrl)||!Number.isFinite(Date.parse(talk.verifiedAt)))errors.push('Fonte da fala incompleta: '+talk.id);
 }
 if(preview){
  const privateFields=['interest','attending','priority','preference','comment','questions','notes'];
  if(data.sessions.some(s=>privateFields.some(field=>Object.prototype.hasOwnProperty.call(s,field))))errors.push('Preferências pessoais em prévia');
  for(const s of data.sessions){
   const r=s.recommendation;
   if(!r||r.targetProfile!=='Flora'||!['alta','media','baixa'].includes(r.level)||!['media','baixa'].includes(r.confidence)||typeof r.rationale!=='string'||!r.rationale.trim())errors.push('Curadoria não identificada: '+s.id);
  }
 }
 return errors;
}

export function stageLabel(session){return String(session?.stage||'').trim()||'A confirmar';}
export function uncertainRole(role){return !role||/a confirmar|Papel exibido|não verificado/i.test(String(role));}
export function talksForSession(talks,id){
 return talks.filter(t=>t.parentSessionId===id).sort((a,b)=>a.start.localeCompare(b.start));
}

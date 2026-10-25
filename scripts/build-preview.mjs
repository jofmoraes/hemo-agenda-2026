// Reproducible, offline-only preview snapshot generator. Never touches public/schedule.json.
import {readFileSync,writeFileSync} from 'node:fs';
const input=url=>JSON.parse(readFileSync(new URL(url,import.meta.url),'utf8'));
const inventory=input('../data/b2-indexed-candidates.json');
const overrides=input('../data/b2-preview-curation-overrides.json');
if(inventory.kind!=='HEMO_B2_INDEXED_CANDIDATES'||inventory.status!=='PARTIAL_NOT_PUBLISHABLE'||inventory.coverage?.completenessVerified!==false)
 throw Error('O inventário não é candidato parcial B2');
if(overrides.kind!=='HEMO_B2_PREVIEW_CURATION_OVERRIDES')throw Error('Curadoria de prévia inválida');
const sessions=structuredClone(inventory.sessions),talks=structuredClone(inventory.talks);
const byId=new Map(sessions.map(s=>[s.id,s]));
if(byId.size!==sessions.length||new Set(talks.map(t=>t.id)).size!==talks.length)throw Error('IDs duplicados');
for(const item of overrides.entries){
 const s=byId.get(item.sessionId);
 if(!s)throw Error('Override órfão: '+item.sessionId);
 for(const tid of item.talkIds){
  if(!talks.some(t=>t.id===tid&&t.parentSessionId===item.sessionId))throw Error('Fala não vinculada: '+tid);
 }
 if(item.confidence!==s.recommendation.confidence)throw Error('Override não pode alterar confiança sem evidência');
 s.recommendation={...s.recommendation,rationale:item.rationale,evidenceBasis:item.evidenceBasis};
 s.curationEvidence={basis:'session_and_indexed_talk_titles',talkIds:item.talkIds,sourceLimited:true};
}
const preview={
 kind:'HEMO_2026_PROGRAM',status:'partial_preview',timezone:inventory.timezone,
 days:inventory.days,checkedAt:inventory.checkedAt,
 sourceUrl:'https://hemo.org.br/evento/hemo2026/pt/programacao/lista',
 coverage:{completenessVerified:false,scope:'Prévia de registros identificados, não total do congresso',
   availableSessions:sessions.length,availableTalks:talks.length,knownSessions:inventory.coverage.knownSessions,
   missingStage:sessions.filter(s=>!s.stage.trim()).length},
 sourceInventory:{kind:inventory.kind,status:inventory.status,path:'data/b2-indexed-candidates.json',
   sourceCommit:'a5eaeb144a547b8f4b18a9a5edbbec00a0bab1ea',
   evidenceLimit:'Pesquisa oficial indexada parcialmente; confirmação de lista/grade integrais pendente'},
 sessions,talks,works:[],exhibitors:[],curationOverridesApplied:overrides.entries.length
};
const output=JSON.stringify(preview,null,2)+'\n';
const target=new URL('../public/preview-schedule.json',import.meta.url);
if(process.argv.includes('--check')){
  // Git may materialize the tracked JSON with CRLF on Windows; compare content, not checkout line endings.
  const current=readFileSync(target,'utf8').replace(/\r\n?/g,'\n');
 if(current!==output){console.error('FAIL: prévia não corresponde ao inventário e às justificativas');process.exitCode=1}
 else console.log('PASS: preview-schedule.json reproduzível; '+sessions.length+' sessões, '+talks.length+' falas');
}else{
 writeFileSync(target,output,'utf8');
 console.log('Prévia gerada; NÃO publica:',sessions.length,'sessões e',talks.length,'falas');
}

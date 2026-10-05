import { useCallback, useEffect, useState } from 'react';
import type { AnalysisResult, DealData } from '../types/deal';
import { analyzeDeal, demoDeal, emptyDeal } from '../services/riskEngine';
import { AnalysisLoader } from './AnalysisLoader';
import { DealForm } from './DealForm';
import { Landing } from './Landing';
import { Report } from './Report';

type Screen='home'|'form'|'analysis'|'report';
export function ExportPatrolApp(){
  const [screen,setScreen]=useState<Screen>('home'); const [deal,setDeal]=useState<DealData>(emptyDeal); const [result,setResult]=useState<AnalysisResult|null>(null);
  useEffect(()=>{const hash=location.hash.slice(1) as Screen;if(['form','report'].includes(hash))setScreen(hash==='report'?'home':hash);const handler=()=>{if(!location.hash)setScreen('home')};addEventListener('hashchange',handler);return()=>removeEventListener('hashchange',handler)},[]);
  const go=(next:Screen)=>{setScreen(next);location.hash=next==='home'?'':next;window.scrollTo(0,0)};
  const start=()=>{setDeal(emptyDeal);go('form')}; const demo=()=>{setDeal(demoDeal);go('form')};
  const complete=useCallback(()=>{const analyzed=analyzeDeal(deal);setResult(analyzed);go('report')},[deal]);
  if(screen==='form')return <DealForm deal={deal} setDeal={setDeal} onSubmit={()=>go('analysis')} onHome={()=>go('home')} onDemo={()=>setDeal(demoDeal)}/>;
  if(screen==='analysis')return <AnalysisLoader onComplete={complete}/>;
  if(screen==='report'&&result)return <Report deal={deal} result={result} onNew={start} onHome={()=>go('home')}/>;
  return <Landing onStart={start} onDemo={demo}/>;
}

import { useEffect, useState } from 'react';

const stages=['Анализ страны назначения','Анализ товарной категории','Проверка параметров контрагента','Анализ способа расчетов','Формирование карты рисков'];

export function AnalysisLoader({onComplete}:{onComplete:()=>void}) {
  const [current,setCurrent]=useState(0);
  useEffect(()=>{const timer=setInterval(()=>setCurrent(v=>{if(v>=stages.length){clearInterval(timer);setTimeout(onComplete,250);return v}return v+1}),420);return()=>clearInterval(timer)},[onComplete]);
  return <main className="analysis-screen"><div className="radar"><i/><i/><i/><span>EP</span></div><div><span className="eyebrow">Анализ сделки</span><h1>Проверяем параметры</h1><p>Сопоставляем данные с демонстрационной базой комплаенс-правил.</p><ul>{stages.map((stage,index)=><li className={index<current?'done':index===current?'active':''} key={stage}><span>{index<current?'✓':index===current?'◌':'·'}</span>{stage}</li>)}</ul></div></main>;
}

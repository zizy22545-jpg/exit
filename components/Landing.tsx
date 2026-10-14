import { useEffect, useRef } from 'react';
import { Header } from './Header';

export function Landing({ onStart, onDemo }:{onStart:()=>void;onDemo:()=>void}) {
  const videoRef=useRef<HTMLVideoElement>(null);
  useEffect(()=>{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) videoRef.current?.pause()},[]);
  return <main className="landing-page">
    <div className="hero-stage" id="top">
      <video ref={videoRef} className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="./assets/images/ocean-poster.jpg" aria-hidden="true">
        <source src="./assets/videos/ocean.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <Header onCheck={onStart}/>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Цифровой комплаенс-помощник</div>
          <h1>Проверьте внешнеторговую сделку</h1>
          <h2>До её заключения</h2>
          <p>Предварительная оценка правовых и регуляторных рисков экспорта и импорта товаров с участием России.</p>
          <div className="hero-actions"><button className="button button-primary" onClick={onStart}>Проверить сделку</button><a className="text-link" href="#how">Как это работает?</a></div>
        </div>
        <div className="hero-mark" aria-hidden="true"><img src="./assets/images/lighthouse-logo.png" alt="" /></div>
      </section>
    </div>
    <section className="features" id="features">
      <div className="section-heading"><span>Возможности</span><h2>Правовая навигация<br/>для внешней торговли</h2></div>
      <div className="feature-grid">{[['01','Экспорт и импорт','Отдельные сценарии проверки для вывоза из России и ввоза в Россию.'],['02','Структура рисков','Параметры страны, товара, расчётов и маршрута в едином отчёте.'],['03','Чёткие статусы','Подтверждённые данные отделены от потенциальных рисков и вопросов для проверки.'],['04','Готовность к базе','Модуль анализа отделён от интерфейса и готов к будущему подключению правил.']].map(x=><article key={x[0]}><b>{x[0]}</b><h3>{x[1]}</h3><p>{x[2]}</p></article>)}</div>
    </section>
    <section className="how-section" id="how"><div className="section-heading"><span>Как это работает</span><h2>От параметров сделки —<br/>к понятному плану действий</h2></div><div className="steps">{[['01','Выберите направление','Экспорт из России или импорт в Россию.'],['02','Опишите сделку','Укажите страну, товар, стоимость, расчёты и условия поставки.'],['03','Получите отчёт','Изучите риски, направления проверки, документы и следующие шаги.']].map(x=><article key={x[0]}><strong>{x[0]}</strong><div><h3>{x[1]}</h3><p>{x[2]}</p></div></article>)}</div></section>
    <section className="about-section" id="about"><div><span className="eyebrow">О проекте</span><h2>Предварительная проверка до обязательств</h2></div><div><p>«Экспортный патруль» помогает российским компаниям увидеть зоны правового и регуляторного внимания до заключения внешнеторговой сделки.</p><button className="demo-link" onClick={onDemo}>Открыть демонстрационный пример →</button></div></section>
    <footer><span>© 2026 Экспортный патруль</span><span>Информационный прототип · не является юридическим заключением</span></footer>
  </main>;
}

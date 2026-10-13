export function Header({ onCheck, compact=false }:{ onCheck:()=>void; compact?:boolean }) {
  return <header className={`site-header no-print ${compact?'compact':''}`}>
    <button className="brand brand-button" onClick={()=>location.hash=''} aria-label="Экспортный патруль — главная">
      <img src="./assets/images/export-patrol-logo.png" width={219} height={74} alt="Экспортный патруль" />
    </button>
    {!compact && <nav aria-label="Главная навигация"><a href="#features">Возможности</a><a href="#how">Как работает</a><a href="#about">О проекте</a></nav>}
    <button className="button button-dark" onClick={onCheck}>{compact?'На главную':'Проверить сделку'}</button>
  </header>;
}

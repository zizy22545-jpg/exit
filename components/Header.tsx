export function Header({ onCheck, compact=false }:{ onCheck:()=>void; compact?:boolean }) {
  return <header className={`site-header no-print ${compact?'compact':''}`}>
    <button className="brand brand-button" onClick={()=>location.hash=''} aria-label="Экспортный патруль — главная">
      <img src="./logo.jpg" width={318} height={125} alt="Экспортный патруль" />
    </button>
    {!compact && <nav aria-label="Главная навигация"><a href="#features">Возможности</a><a href="#how">Как работает</a><a href="#about">О проекте</a></nav>}
    <button className="button button-dark" onClick={onCheck}>{compact?'Новая проверка':'Проверить сделку'} <span>↗</span></button>
  </header>;
}

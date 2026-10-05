import { Header } from './Header';

export function Landing({ onStart, onDemo }:{onStart:()=>void;onDemo:()=>void}) {
  return <main>
    <Header onCheck={onStart}/>
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><span /> Цифровой комплаенс-помощник</div>
        <h1>Проверьте экспортную сделку <em>до ее заключения</em></h1>
        <p>Предварительный анализ страны, товара, способа оплаты и основных комплаенс-рисков в одном сервисе.</p>
        <div className="hero-actions"><button className="button button-primary" onClick={onStart}>Начать проверку <span>→</span></button><a className="text-link" href="#how">Как это работает <span>↓</span></a></div>
        <button className="demo-link" onClick={onDemo}>▣ &nbsp; Загрузить пример сделки</button>
        <div className="trust-row"><span>Демо-модель</span><span>Без передачи данных</span><span>Отчет за несколько минут</span></div>
      </div>
      <div className="report-preview" aria-label="Пример результата проверки">
        <div className="preview-top"><span>Результат анализа</span><b>EP-2026-01842</b></div>
        <div className="score-block"><div className="score-ring"><strong>42</strong><small>/ 100</small></div><div><span className="muted-label">Риск сделки</span><h2>Средний</h2><p>Требуются уточнения до заключения сделки</p></div></div>
        <div className="deal-summary"><div><span>Страна</span><b>Китай</b></div><div><span>Товар</span><b>Промышленное оборудование</b></div><div><span>Расчеты</span><b>Аккредитив · CNY</b></div></div>
        <div className="attention-card"><span>!</span><div><b>2 фактора требуют внимания</b><p>Классификация товара и конечный пользователь</p></div><strong>Подробнее →</strong></div>
        <div className="preview-note">Демонстрационный пример · не является юридическим заключением</div>
      </div>
    </section>
    <section className="features" id="features">
      {[['01','Комплексная проверка','Страна, товар, расчеты и ограничения анализируются совместно.'],['02','Понятный результат','Структурированная карта рисков вместо массива нормативных документов.'],['03','Экономия времени','Первичный комплаенс-анализ сделки занимает несколько минут.'],['04','Актуализируемая база','Архитектура предусматривает обновление правовой и страновой информации.']].map(x=><article key={x[0]}><b>{x[0]}</b><h3>{x[1]}</h3><p>{x[2]}</p></article>)}
    </section>
    <section className="how-section" id="how"><div className="section-heading"><span>Как это работает</span><h2>От параметров сделки —<br/>к понятному плану действий</h2></div><div className="steps">{[['01','Опишите сделку','Укажите страну, товар, стоимость и способ оплаты.'],['02','Запустите проверку','Система сопоставит параметры сделки с демонстрационной базой правил.'],['03','Получите отчет','Сервис покажет риски, требования, документы и рекомендации.']].map(x=><article key={x[0]}><strong>{x[0]}</strong><div><h3>{x[1]}</h3><p>{x[2]}</p></div></article>)}</div></section>
    <section className="about-section" id="about"><div><span className="eyebrow">О проекте</span><h2>Единый сценарий предварительной проверки</h2></div><div><p>«Экспортный патруль» объединяет информацию о стране назначения, товаре, контрагенте и расчетах, чтобы российский экспортер заранее увидел ключевые зоны внимания.</p><ul><li>Расширение страновой и товарной базы</li><li>Интеграции с внешними источниками</li><li>Автоматическая актуализация правил</li><li>Расширенный комплаенс-отчет</li></ul></div></section>
    <footer><span>© 2026 Экспортный патруль</span><span>Демонстрационный прототип · не является юридическим заключением</span></footer>
  </main>;
}

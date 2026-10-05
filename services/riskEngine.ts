import { countries, countryByCode } from '../data/countries';
import { productByCode } from '../data/products';
import { paymentByCode } from '../data/paymentMethods';
import { regulations } from '../data/regulations';
import type { AnalysisResult, DealData, Finding, RiskCategory, RiskLevel } from '../types/deal';

const levelFor = (score:number): RiskLevel => score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low';
const categoryLevel = (score:number): RiskLevel => score >= 20 ? 'high' : score >= 10 ? 'medium' : 'low';

export function analyzeDeal(deal: DealData): AnalysisResult {
  const country = countryByCode(deal.destinationCountry)!;
  const product = productByCode(deal.productCategory)!;
  const payment = paymentByCode(deal.paymentMethod)!;
  const transitScore = deal.transit === 'yes' ? (deal.transitCountry ? 10 : 15) : 0;
  const endUserScore = deal.endUserKnown === 'no' ? 12 : deal.civilianUse === 'unsure' ? 8 : deal.civilianUse === 'no' ? 16 : 2;
  const counterpartyScore = deal.counterpartyChecked ? 3 : 10;
  const paymentScore = payment.risk + (deal.intermediaryBank ? 7 : 0) + (['USD','EUR'].includes(deal.paymentCurrency) ? 4 : 0);
  const productScore = product.baseRisk + (!deal.hsCode ? 6 : 0);
  const raw = country.baseRisk + productScore + paymentScore + transitScore + endUserScore + counterpartyScore;
  const totalScore = Math.min(100, Math.round(raw * .78));

  const findings: Finding[] = [];
  if (!deal.hsCode) findings.push({ status:'warning', title:'Требуется уточнить код ТН ВЭД', description:'Для выбранной товарной категории результат проверки существенно зависит от точной классификации.', recommendation:'Уточнить код ТН ВЭД до заключения сделки.' });
  if (deal.endUserKnown === 'no' || !deal.endUser) findings.push({ status:'warning', title:'Проверьте конечного пользователя', description:'Для выбранной категории оборудования имеет значение фактическое назначение товара и его конечный пользователь.', recommendation:'Получить сведения о конечном пользователе и назначении оборудования.' });
  if (deal.civilianUse === 'unsure') findings.push({ status:'warning', title:'Уточните назначение товара', description:'Гражданское назначение товара не подтверждено, поэтому требуется дополнительный анализ характеристик.', recommendation:'Зафиксировать назначение товара в договоре и технической документации.' });
  if (deal.civilianUse === 'no') findings.push({ status:'critical', title:'Необходимо углубленное исследование товара', description:'Указано негражданское назначение, что повышает значимость экспортного контроля.', recommendation:'Не заключать сделку без профессиональной проверки применимых требований.' });
  if (deal.transit === 'yes') findings.push({ status:'warning', title:'Есть транзит через третью страну', description:`Маршрут через ${countryByCode(deal.transitCountry)?.name || 'третью страну'} добавляет участников и документы в цепочку поставки.`, recommendation:'Проверить транзитный маршрут, перевозчиков и риск изменения конечного направления.' });
  if (deal.intermediaryBank) findings.push({ status:'warning', title:'В расчетах участвует банк-посредник', description:'Платежный маршрут включает дополнительную финансовую организацию.', recommendation:'Согласовать полный банковский маршрут до отгрузки.' });
  findings.push({ status:'success', title:'Базовая проверка контрагента', description: deal.counterpartyChecked ? 'В демонстрационной базе критические признаки не выявлены.' : 'Автоматическая демо-проверка не запускалась.', recommendation: deal.counterpartyChecked ? 'Статус: пройдено в демо-режиме.' : 'Запустить демо-проверку и проверить контрагента по актуальным источникам.' });

  const categories: RiskCategory[] = [
    { key:'country', label:'Страновой риск', score:country.baseRisk, level:categoryLevel(country.baseRisk), icon:'◎', note:country.checks[0] },
    { key:'product', label:'Товарный риск', score:productScore, level:categoryLevel(productScore), icon:'◇', note:product.focus[0] },
    { key:'payment', label:'Платежный риск', score:paymentScore, level:categoryLevel(paymentScore), icon:'₽', note:deal.intermediaryBank ? 'Есть банк-посредник' : 'Стандартный маршрут' },
    { key:'counterparty', label:'Риск контрагента', score:counterpartyScore, level:categoryLevel(counterpartyScore), icon:'○', note:deal.counterpartyChecked ? 'Демо-проверка пройдена' : 'Нужна проверка' },
    { key:'route', label:'Транзит / конечный пользователь', score:transitScore + endUserScore, level:categoryLevel(transitScore + endUserScore), icon:'↗', note:deal.transit === 'yes' ? 'Усложненный маршрут' : 'Прямой маршрут' },
  ];

  const documents = [
    'внешнеторгового договора','спецификации','корректного кода ТН ВЭД',...product.documents,
    'документов о происхождении товара','информации о конечном пользователе',
    `документов по форме расчетов «${payment.name}»`,'результатов проверки контрагента',
    'необходимых разрешительных документов, если применимо',
  ];

  const recommendations = [
    ...(!deal.hsCode ? ['Уточнить код ТН ВЭД товара.'] : []),
    `Проверить ${product.focus.slice(0,2).join(' и ').toLowerCase()}.`,
    ...(deal.endUserKnown === 'no' ? ['Получить сведения о конечном пользователе.'] : ['Подтвердить сведения о конечном пользователе документально.']),
    ...country.recommendations.map((item) => `${item}.`),
    'Проверить иностранного контрагента по доступным официальным и коммерческим источникам.',
    'Согласовать возможность проведения платежа с обслуживающим банком.',
    'Провести итоговую юридическую проверку сделки.',
  ];

  return {
    id:`EP-${new Date().getFullYear()}-${String(Math.abs(hash(JSON.stringify(deal))) % 100000).padStart(5,'0')}`,
    date:new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'long',year:'numeric'}).format(new Date()),
    totalScore, level:levelFor(totalScore), categories, findings, documents:[...new Set(documents)], recommendations:[...new Set(recommendations)], regulations,
  };
}

function hash(value:string) { let result = 0; for (let i=0;i<value.length;i++) result=((result<<5)-result)+value.charCodeAt(i)|0; return result; }

export const emptyDeal: DealData = {
  destinationCountry:'', counterpartyCountry:'', counterpartyName:'', registrationNumber:'', counterpartyChecked:false,
  productCategory:'', productName:'', hsCode:'', value:'', currency:'CNY', paymentMethod:'', paymentCurrency:'CNY', payerBank:'', recipientBank:'',
  intermediaryBank:false, intermediaryBankName:'', transit:'no', transitCountry:'', endUserKnown:'yes', endUser:'', civilianUse:'yes',
};

export const demoDeal: DealData = {
  destinationCountry:'CN', counterpartyCountry:'CN', counterpartyName:'Shanghai Industrial Technologies Co., Ltd.', registrationNumber:'91310000DEMO2026', counterpartyChecked:true,
  productCategory:'machines', productName:'Промышленный фрезерный станок', hsCode:'', value:'5000000', currency:'CNY', paymentMethod:'letter', paymentCurrency:'CNY',
  payerBank:'АО «Банк экспортера»', recipientBank:'Bank of Shanghai', intermediaryBank:false, intermediaryBankName:'', transit:'no', transitCountry:'',
  endUserKnown:'yes', endUser:'Shanghai Manufacturing Group', civilianUse:'yes',
};

export const registrationCountries = countries;

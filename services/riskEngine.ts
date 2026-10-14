import { countryByCode } from '../data/countries';
import { productByCode } from '../data/products';
import { paymentByCode } from '../data/paymentMethods';
import { legalSourcesFor } from '../data/regulations';
import type { AnalysisResult, DealAnalyzer, DealData, Finding, RequirementItem, RiskCategory, RiskLevel } from '../types/deal';

const levelFor = (score:number): RiskLevel => score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low';
const categoryLevel = (score:number): RiskLevel => score >= 20 ? 'high' : score >= 10 ? 'medium' : 'low';

const exportAreas = [
  ['export-restrictions','Экспортные ограничения'], ['export-control','Экспортный контроль'], ['customs','Таможенное оформление'],
  ['permits','Лицензии и разрешения'], ['currency','Валютное регулирование'], ['restrictions','Санкционные и иные ограничительные меры'],
  ['documents','Документальное сопровождение'],
] as const;

const importAreas = [
  ['customs','Таможенное декларирование'], ['duties','Ввозные пошлины и налоги'], ['non-tariff','Нетарифные ограничения'],
  ['technical','Техническое регулирование'], ['conformity','Подтверждение соответствия'], ['marking','Маркировка'],
  ['permits','Лицензии и разрешения'], ['currency','Валютное регулирование'], ['restrictions','Санкционные и иные ограничительные меры'],
] as const;

function buildRequirements(deal: DealData): RequirementItem[] {
  const areas = deal.direction === 'export' ? exportAreas : importAreas;
  return areas.map(([id, area]) => ({
    id: `${deal.direction}-${id}`,
    area,
    status: 'additional-review',
    requirement: `Применимость требований по направлению «${area.toLowerCase()}» не может быть подтверждена по демонстрационной базе.`,
    action: deal.hsCode ? 'Сверить код ТН ВЭД и параметры сделки с актуальными официальными источниками.' : 'Сначала определить код ТН ВЭД, затем проверить актуальные официальные источники.',
    documents: [],
  }));
}

export function analyzeDeal(deal: DealData): AnalysisResult {
  const country = countryByCode(deal.partnerCountry)!;
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
  if (!deal.hsCode) findings.push({ status:'warning', title:'Не указан код ТН ВЭД', description:'Без точной классификации нельзя подтвердить применимые меры и требования.', recommendation:'Уточнить код ТН ВЭД до заключения сделки.' });
  if (deal.endUserKnown === 'no' || !deal.endUser) findings.push({ status:'warning', title:'Недостаточно данных о конечном пользователе', description:'Фактическое назначение товара и его получатель могут влиять на оценку.', recommendation:'Получить сведения о конечном пользователе и назначении.' });
  if (deal.transit === 'yes') findings.push({ status:'warning', title:'Маршрут через третью страну', description:`Транзит через ${countryByCode(deal.transitCountry)?.name || 'третью страну'} добавляет участников и документы в цепочку.`, recommendation:'Проверить транзитный маршрут, перевозчиков и конечное направление.' });
  if (deal.intermediaryBank) findings.push({ status:'warning', title:'В расчётах участвует банк-посредник', description:'Платёжный маршрут включает дополнительную финансовую организацию.', recommendation:'Согласовать полный банковский маршрут до отгрузки.' });
  findings.push({ status:'success', title:'География сделки корректна', description: deal.direction === 'export' ? 'Россия зафиксирована как страна отправления.' : 'Россия зафиксирована как страна назначения.', recommendation:'Сохранить эту географию в договоре и логистических документах.' });

  const categories: RiskCategory[] = [
    { key:'country', label:'Страновой риск', score:country.baseRisk, level:categoryLevel(country.baseRisk), icon:'01', note:country.checks[0] },
    { key:'product', label:'Товарный риск', score:productScore, level:categoryLevel(productScore), icon:'02', note:product.focus[0] },
    { key:'payment', label:'Платёжный риск', score:paymentScore, level:categoryLevel(paymentScore), icon:'03', note:deal.intermediaryBank ? 'Есть банк-посредник' : 'Указан прямой маршрут' },
    { key:'counterparty', label:'Контрагент', score:counterpartyScore, level:categoryLevel(counterpartyScore), icon:'04', note:deal.counterpartyChecked ? 'Локальная демо-проверка запущена' : 'Нужна проверка' },
    { key:'route', label:'Маршрут и назначение', score:transitScore + endUserScore, level:categoryLevel(transitScore + endUserScore), icon:'05', note:deal.transit === 'yes' ? 'Усложнённый маршрут' : 'Прямой маршрут' },
  ];

  const documents = ['внешнеторгового договора','спецификации','коммерческого инвойса','транспортных документов','документов о происхождении товара',...product.documents,'сведений о конечном пользователе',`документов по форме расчётов «${payment.name}»`,'результатов проверки контрагента','разрешительных документов, если их необходимость будет подтверждена'];
  const recommendations = [...(!deal.hsCode ? ['Уточнить код ТН ВЭД товара.'] : []),`Проверить ${product.focus.slice(0,2).join(' и ').toLowerCase()}.`,'Подтвердить сведения о конечном пользователе документально.',...country.recommendations.map(item=>`${item}.`),'Проверить иностранного контрагента по актуальным источникам.','Согласовать платёжный маршрут с обслуживающим банком.','Провести итоговую юридическую проверку до совершения сделки.'];

  return { id:`EP-${new Date().getFullYear()}-${String(Math.abs(hash(JSON.stringify(deal))) % 100000).padStart(5,'0')}`, date:new Intl.DateTimeFormat('ru-RU',{day:'2-digit',month:'long',year:'numeric'}).format(new Date()), totalScore, level:levelFor(totalScore), categories, findings, requirements:buildRequirements(deal), documents:[...new Set(documents)], recommendations:[...new Set(recommendations)], legalSources:legalSourcesFor(deal.direction) };
}

export const localDealAnalyzer: DealAnalyzer = { analyze: analyzeDeal };
function hash(value:string) { let result=0; for(let i=0;i<value.length;i++) result=((result<<5)-result)+value.charCodeAt(i)|0; return result; }

export const emptyDeal: DealData = {
  direction:'export', partnerCountry:'', originCountry:'RU', counterpartyCountry:'', counterpartyName:'', registrationNumber:'', counterpartyChecked:false,
  productCategory:'', productName:'', hsCode:'', value:'', currency:'CNY', paymentMethod:'', paymentCurrency:'CNY', payerBank:'', recipientBank:'', incoterms:'',
  intermediaryBank:false, intermediaryBankName:'', transit:'no', transitCountry:'', endUserKnown:'yes', endUser:'', civilianUse:'yes', additionalInfo:'',
};

export const demoDeal: DealData = {
  ...emptyDeal, direction:'import', partnerCountry:'CN', originCountry:'CN', counterpartyCountry:'CN', counterpartyName:'Shanghai Industrial Technologies Co., Ltd.', registrationNumber:'91310000DEMO2026', counterpartyChecked:true,
  productCategory:'machines', productName:'Промышленный фрезерный станок', value:'5000000', currency:'CNY', paymentMethod:'letter', paymentCurrency:'CNY', payerBank:'Банк импортёра', recipientBank:'Bank of Shanghai', incoterms:'CIF', endUser:'Российское производственное предприятие',
};

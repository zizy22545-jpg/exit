import type { DealDirection, LegalSource } from '../types/deal';

const common: LegalSource[] = [
  { title:'Федеральный закон № 164-ФЗ «Об основах государственного регулирования внешнеторговой деятельности»', url:'https://pravo.gov.ru/', note:'Общая нормативная рамка; применимость к сделке требует проверки.' },
  { title:'Федеральный закон № 173-ФЗ «О валютном регулировании и валютном контроле»', url:'https://pravo.gov.ru/', note:'Проверить актуальную редакцию и требования обслуживающего банка.' },
  { title:'Таможенный кодекс Евразийского экономического союза', url:'https://docs.eaeunion.org/', note:'Конкретные положения определяются по направлению, товару и процедуре.' },
];

const exportOnly: LegalSource = { title:'Федеральный закон № 183-ФЗ «Об экспортном контроле»', url:'https://pravo.gov.ru/', note:'Применимость зависит от товара, технологий, назначения и конечного пользователя.' };

export const legalSourcesFor = (direction: DealDirection): LegalSource[] => direction === 'export' ? [...common, exportOnly] : common;

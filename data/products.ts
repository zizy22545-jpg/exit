export interface ProductProfile { code:string; name:string; baseRisk:number; focus:string[]; documents:string[]; }

export const products: ProductProfile[] = [
  { code:'industrial', name:'Промышленное оборудование', baseRisk:10, focus:['Технические характеристики','Классификация товара'], documents:['технической документации на товар'] },
  { code:'machines', name:'Станки и производственные линии', baseRisk:17, focus:['Технические характеристики','Код ТН ВЭД','Назначение','Конечный пользователь'], documents:['технического паспорта и описания назначения'] },
  { code:'electronics', name:'Электронное оборудование', baseRisk:21, focus:['Технические характеристики','Конечный пользователь','Потенциальные экспортные ограничения','Классификация товара'], documents:['подробного описания компонентов и характеристик'] },
  { code:'telecom', name:'Телекоммуникационное оборудование', baseRisk:23, focus:['Функциональные характеристики','Шифрование и передача данных','Конечный пользователь'], documents:['технического заключения и описания функций'] },
  { code:'laboratory', name:'Лабораторное оборудование', baseRisk:15, focus:['Назначение оборудования','Техническая документация','Разрешительные требования'], documents:['документов о назначении и области применения'] },
];

export const productByCode = (code:string) => products.find((item) => item.code === code);

export const paymentMethods = [
  { code:'transfer', name:'Банковский перевод', risk:8 },
  { code:'letter', name:'Аккредитив', risk:5 },
  { code:'collection', name:'Документарное инкассо', risk:7 },
  { code:'advance', name:'Авансовый платеж', risk:12 },
  { code:'postpay', name:'Постоплата', risk:10 },
];

export const currencies = ['RUB','USD','EUR','CNY','AED','INR','KZT','TRY'];
export const paymentByCode = (code:string) => paymentMethods.find((item) => item.code === code);

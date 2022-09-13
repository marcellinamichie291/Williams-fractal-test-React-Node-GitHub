const timeFrames = {
  timeFrame2h: '2h',
  timeFrame15m: '15m',
  timeFrame1m: '1m',
}

const nameStrategy = {
  notice2h382: `Стратегия №3.8.2: Без теневая на ${timeFrames.timeFrame2h}`,
  notice15m382: `Стратегия №3.8.2: Без теневая на ${timeFrames.timeFrame15m}`,
}

// 13.09.2022
const symbols2h38 = [
  '1000SHIBUSDT',
  '1INCHUSDT',
  'AAVEUSDT',
  'ADAUSDT',
  'ALGOUSDT',
  'APEUSDT',
  'API3USDT',
  'ARPAUSDT',
  'ATOMUSDT',
  'BLZUSDT',
  'C98USDT',
  'CELOUSDT',
  'CTKUSDT',
  'DARUSDT',
  'DASHUSDT',
  'DGBUSDT',
  'ENSUSDT',
  'EOSUSDT',
  'ETCUSDT',
  'FILUSDT',
  'GALUSDT',
  'HNTUSDT',
  'HOTUSDT',
  'KAVAUSDT',
  'LINAUSDT',
  'MANAUSDT',
  'PEOPLEUSDT',
  'SANDUSDT',
  'SNXUSDT',
  'UNFIUSDT',
  'XRPUSDT',
]

// 12.09.2022
/*
const symbols2h38 = [
  '1000SHIBUSDT',
  '1INCHUSDT',
  'AAVEUSDT',
  'ADAUSDT',
  'ALGOUSDT',
  //'ALPHAUSDT',
  'ANCUSDT',
  'APEUSDT',
  'API3USDT',
  'ARPAUSDT',
  'ATOMUSDT',
  //'AVAXUSDT',
  //'BANDUSDT',
  'BLZUSDT',
  'C98USDT',
  'CELOUSDT',
  //'COMPUSDT',
  //'CRVUSDT',
  'CTKUSDT',
  'DARUSDT',
  'DASHUSDT',
  'DGBUSDT',
  //'DOTUSDT',
  //'EGLDUSDT',
  //'ENJUSDT',
  'ENSUSDT',
  'EOSUSDT',
  'ETCUSDT',
  'FILUSDT',
  'GALUSDT',
  //'GMTUSDT',
  'HNTUSDT',
  'HOTUSDT',
  'KAVAUSDT',
  'LINAUSDT',
  //'LINKUSDT',
  'MANAUSDT',
  'PEOPLEUSDT',
  //'RSRUSDT',
  //'RVNUSDT',
  'SANDUSDT',
  'SNXUSDT',
  //'STORJUSDT',
  'UNFIUSDT',
  'XRPUSDT',
]
*/

// 03.09.2022 для alex38Notice2h (внесли дополнительные условия)
/*
const symbols2h38 = [
  //'1000SHIBUSDT',
  '1INCHUSDT',
  'AAVEUSDT',
  'ADAUSDT',
  'ALGOUSDT',
  'ALPHAUSDT',
  'ANCUSDT',
  'APEUSDT',
  'API3USDT',
  'ARPAUSDT',
  'ATOMUSDT',
  'AVAXUSDT',
  'BANDUSDT',
  'BELUSDT',
  'BLZUSDT',
  'BNBUSDT',
  'C98USDT',
  'CELOUSDT',
  'COMPUSDT',
  'CRVUSDT',
  'CTKUSDT',
  'DARUSDT',
  'DASHUSDT',
  'DGBUSDT',
  'DOTUSDT',
  'EGLDUSDT',
  'ENJUSDT',
  //'ENSUSDT',
  'EOSUSDT',
  'ETCUSDT',
  'ETHUSDT',
  'FILUSDT',
  //'FTMUSDT',
  'GALUSDT',
  'GMTUSDT',
  'HBARUSDT',
  'HNTUSDT',
  'HOTUSDT',
  'KAVAUSDT',
  'LINAUSDT',
  'LINKUSDT',
  'MANAUSDT',
  'PEOPLEUSDT',
  'RSRUSDT',
  'RVNUSDT',
  'SANDUSDT',
  'SNXUSDT',
  //'SOLUSDT',
  'STORJUSDT',
  'THETAUSDT',
  'TRBUSDT',
  'TRXUSDT',
  'UNFIUSDT',
  'UNIUSDT',
  'VETUSDT',
  'WAVESUSDT',
  'XMRUSDT',
  'XRPUSDT',
  //'XTZUSDT',
]
*/

const symbols15m38 = [
  //'1000SHIBUSDT',
  //'1INCHUSDT',
  'AAVEUSDT',
  'ADAUSDT',
  'ALGOUSDT',
  //'ALPHAUSDT',
  'ANCUSDT',
  'APEUSDT',
  'API3USDT',
  'ARPAUSDT',
  //'ATOMUSDT',
  'AVAXUSDT',
  'BANDUSDT',
  'BELUSDT',
  'BLZUSDT',
  'BNBUSDT',
  //'C98USDT',
  //'CELOUSDT',
  'COMPUSDT',
  //'CRVUSDT',
  //'CTKUSDT',
  'DARUSDT',
  //'DASHUSDT',
  'DGBUSDT',
  //'DOTUSDT',
  //'EGLDUSDT',
  //'ENJUSDT',
  //'ENSUSDT',
  'EOSUSDT',
  'ETCUSDT',
  'ETHUSDT',
  'FILUSDT',
  //'FTMUSDT',
  'GALUSDT',
  'GMTUSDT',
  //'HBARUSDT',
  //'HNTUSDT',
  'HOTUSDT',
  //'KAVAUSDT',
  //'LINAUSDT',
  //'LINKUSDT',
  //'MANAUSDT',
  'PEOPLEUSDT',
  'RSRUSDT',
  //'RVNUSDT',
  'SANDUSDT',
  'SNXUSDT',
  //'SOLUSDT',
  'STORJUSDT',
  'THETAUSDT',
  //'TRBUSDT',
  //'TRXUSDT',
  'UNFIUSDT',
  'UNIUSDT',
  //'VETUSDT',
  //'WAVESUSDT',
  //'XMRUSDT',
  'XRPUSDT',
  //'XTZUSDT',
]

// 01.09.2022 для alex38Notice2hHard
// const symbols38hard2h = ['HOTUSDT', 'ENJUSDT', 'SUSHIUSDT', 'FLOWUSDT']

// 01.09.2022 для alex38Notice4hHard
// const symbols38hard4h = ['UNFIUSDT', 'PEOPLEUSDT', 'BANDUSDT', 'XRPUSDT', 'DGBUSDT']

module.exports = {
  symbols2h38,
  symbols15m38,
  // symbols38hard2h,
  // symbols38hard4h,
  timeFrames,
  nameStrategy,
}

const config = require('config')
const candlesToObject4test = require('../common.func/candlesToObject4test')
const diffCandle = require('../common.func/diffCandle')
const getCandles = require('../../API/binance.engine/usdm/getCandles.5param')
const timestampToDateHuman = require('../common.func/timestampToDateHuman')
// const alex37testMain = require('./alex37test/alex37testMain')
const tradeAlex35 = require('./tradeAlex3.5') // тестер стратегии 3.5
// const alex37testMainMod = require('./alex37testMod/alex37testMainMod')
// const alex37testMain2 = require('../../backup/Alex/AlexTest/alex37test/alex37testMain2')
const alex37test3 = require('./test/alex37test/alex37test3')
// const alex38test = require('./alex38test/alex38test')
const alex39test = require('./test/alex39test/alex39test')
const alex38test2 = require('./test/alex38test/alex38test2')
const alex38test10g = require('./test/alex38test/alex38test10g')
const alex38test2hard = require('./test/alex38test/alex38test2hard')
const alex310testH = require('./test/alex310testH/alex310testH')
const alex311test = require('./test/alex311test/alex311test')
const alex312test = require('./test/alex312test/alex312test')
const alex312test4h = require('./test/alex312test/alex312test4h')
const alex311test2 = require('./test/alex311test/alex311test2')
const alex312test2 = require('./test/alex312test/alex312test2')
const alex312test4h2 = require('./test/alex312test/alex312test4h2')
const alex311test3 = require('./test/alex311test/alex311test3')
const Candles = require('../../models/candles')
const alex38test3 = require('./test/alex38test/alex38test3')
const alex38test4 = require('./test/alex38test/alex38test4')
const alex38test42 = require('./test/alex38test/alex38test42')
const alex38test22 = require('./test/alex38test/alex38test22')
const alex38test23 = require('./test/alex38test/alex38test23')
const alex38test24 = require('./test/alex38test/alex38test24')
const alex38test25 = require('./test/alex38test/alex38test25')
// const bookTickerFunc = require('./bookOfSymbol')

const limitSeniorTrend = config.get('limitSeniorTrend') || 1000

async function startAlex(
  symbol,
  timeFrame,
  dateStart,
  dateFinish,
  deposit,
  partOfDeposit,
  multiplier,
  diffVolumeUser,
  takeProfit,
  stopLoss,
  diffShadow35big, // стратегия 3.5
  diffShadow35small, // стратегия 3.5
  delta // стратегия 3.7
) {
  // const bookOfSymbol = bookTickerFunc()
  const startProgramAt = timestampToDateHuman(new Date().getTime()) // для расчета времени работы приложения
  console.log(`тест стратегий запущен в ${startProgramAt}`)

  const arrayOf1kPeriod = diffCandle(dateStart, dateFinish, timeFrame)
  let candlesSeniorFull = []

  try {
    for (let i = 0; i < arrayOf1kPeriod.length; i++) {
      const candlesSenior = await getCandles(
        symbol,
        timeFrame,
        arrayOf1kPeriod[i].dateFirst,
        arrayOf1kPeriod[i].dateSecond,
        limitSeniorTrend
      )
      candlesSeniorFull = candlesSeniorFull.concat(candlesSenior)
    }
  } catch (err) {
    console.error('get Account Trade List error: ', err)
  }

  const objectSenior = candlesToObject4test(candlesSeniorFull)

  // второй вариант преобразовать массив полученных свечей в объект
  /*
    const kkk = []
    candlesSeniorFull.forEach(function (candle, i) {
      kkk[i] = new Candles(candle)
    })
    console.table(kkk)
    */

  // заливаем свечи в БД
  /*
    // ConfigurationError: bulk helper: the datasource is required (Ошибка конфигурации: массовый помощник: требуется источник данных)
    const elasticPutFromTest = require('../../API/elastic.search/elastic.putFtest')
    await elasticPutFromTest(symbol, timeFrame, objectSenior).catch((err) => {
      console.log(err)
      process.exit(1)
    })
    */

  // Слот 1
  const [deals35, statistics35] = alex38test23(
    objectSenior,
    deposit,
    partOfDeposit,
    multiplier,
    takeProfit,
    stopLoss,
    diffShadow35big,
    diffShadow35small,
    delta
  )

  // Слот 2
  const [deals37, statistics37] = alex38test25(
    objectSenior,
    deposit,
    partOfDeposit,
    multiplier,
    takeProfit,
    stopLoss,
    diffShadow35big,
    diffShadow35small,
    delta,
    symbol
  )

  // Слот 3
  const [deals38, statistics38] = alex38test2(
    objectSenior,
    deposit,
    partOfDeposit,
    multiplier,
    takeProfit,
    stopLoss,
    diffShadow35big,
    diffShadow35small,
    delta,
    symbol
  )

  // Слот 4
  const [deals39, statistics39] = alex38test42(
    objectSenior,
    deposit,
    partOfDeposit,
    multiplier,
    takeProfit,
    stopLoss,
    symbol
  )

  console.log(`программа завершена (ОК)`)

  return {
    deals35,
    statistics35,
    deals37,
    statistics37,
    deals38,
    statistics38,
    deals39,
    statistics39,
    startProgramAt,
  }
}

module.exports = startAlex

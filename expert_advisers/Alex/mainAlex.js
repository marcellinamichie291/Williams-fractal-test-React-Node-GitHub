const config = require('config')
const candlesToObject = require('../Alex/candlesToObject')
const diffCandle = require('../Williams_fractal/diffCandle')
const getCandles = require('../Williams_fractal/getCandles')
const timestampToDateHuman = require('../Williams_fractal/timestampToDateHuman')
const tradeAlex1 = require('./tradeAlex1')
const tradeAlex2 = require('./tradeAlex2')
// const bookTickerFunc = require('./bookOfSymbol')

const limitSeniorTrend = config.get('limitSeniorTrend') || 1000

async function startAlex(
  symbol,
  TimeFrame,
  dateStart,
  dateFinish,
  deposit,
  partOfDeposit,
  multiplier,
  diffVolumeUser,
  takeProfit
) {
  // const bookOfSymbol = bookTickerFunc()
  const startProgramAt = timestampToDateHuman(new Date().getTime()) // для расчета времени работы приложения

  const arrayOf1kPeriod = diffCandle(dateStart, dateFinish, TimeFrame)
  let candlesSeniorFull = []

  try {
    for (let i = 0; i < arrayOf1kPeriod.length; i++) {
      const candlesSenior = await getCandles(
        symbol,
        TimeFrame,
        arrayOf1kPeriod[i].dateFirst,
        arrayOf1kPeriod[i].dateSecond,
        limitSeniorTrend
      )
      candlesSeniorFull = candlesSeniorFull.concat(candlesSenior)
    }

    const objectSenior = candlesToObject(candlesSeniorFull)
    const deals = tradeAlex1(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      diffVolumeUser,
      takeProfit
    )

    const deals2 = tradeAlex2(
      objectSenior,
      deposit,
      partOfDeposit,
      multiplier,
      takeProfit
    )

    console.log(`программа завершена (ОК)`)

    return { deals, deals2, startProgramAt }
  } catch (err) {
    console.error('get Account Trade List error: ', err)
  }
}

module.exports = startAlex

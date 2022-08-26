function testOfNewFuctiouns() {
  workingFunctions()
  //testWilliams() // тест одновременного запуска оповещений на разных стратегиях
  //testBinanceTrade() // тест торговых функций
}

function workingFunctions() {
  // const alex37tradeMain = require('./expert_advisers/Alex/trade37WS(1symbol)/alex37tradeMain')
  //const alex37tradeMain4s = require('./expert_advisers/Alex/trade37WS(4symbols)/alex37tradeMain4s')
  // const alex38notice8s = require('./expert_advisers/Alex/notice38WS(8s)/alex38notice8s')
  const alex3notice12s = require('./expert_advisers/Alex/notice/notice3WS(12s)/alex3notice12s') // оповещения 3.7-3.9 на 12 монетах
  const { tgBotExample } = require('./API/telegram/telegram.bot')
  // alex37tradeMain() // стратегия 3.7 оповещения на одной монете
  //alex37tradeMain4s() // стратегия 3.7 оповещения на четырех монетах
  // alex38notice8s() // стратегия 3.8 оповещения на восьми монетах
  alex3notice12s() // оповещения 3.7-3.9 на 12 монетах
  tgBotExample()
}

function testBinanceTrade() {
  // эксперименты с торговыми функциями binance
  // SyntaxError: Cannot use import statement outside a module
  // Толя предложил: ищи видос вебпак+тайпскрипт
  const spotTrade = require(`./binance_Engine/tests_Ivan/spot-trade.ts`)
  spotTrade()
}

async function testWilliams() {
  // проверка - возможно ли одновременный запуск web socket для Alex и для Williams fractal
  const getLastCandle4s = require('./API/binance.engine/alex/getLastCandle4s')
  const symbols = ['ETHUSDT', 'BTCUSDT']
  const timeFrame = '1m'
  let lastCandle

  await getLastCandle4s(
    symbols,
    timeFrame,
    async ({
      symbol: symbol,
      startTime: openTime,
      open: openPrice,
      close: closePrice,
      low: lowPrice,
      high: highPrice,
      volume: volume,
      final: final,
    }) => {
      // сохраняем новую свечку
      lastCandle = {
        symbol: symbol,
        openTime: openTime,
        openPrice: openPrice,
        closePrice: closePrice,
        lowPrice: lowPrice,
        highPrice: highPrice,
        volume: volume,
        final: final,
      }
      if (lastCandle.final) {
        console.table(lastCandle)
        console.log(`test of Williams noteice is END`)
        //process.exit(0) // изучить https://runebook.dev/ru/docs/node/process
      }
      console.log(`test of Williams noteice is processing...`)
    }
  )
}

function alexTestStrategy() {
  //const tradeAlex3bot = require('./expert_advisers/Alex/trade35trade(fail)/alex35.botMain')
  // тесты с получением сигналов на основе стратегии Alex 3.5
  // tradeAlex3bot() // первая попытка разработки слишком сложного торгового робота
}

function alexTradeStrategy() {
  // !!!! const alex35tradeBotWSrjxs = require('./expert_advisers/Alex/trade35WS_RxJS/alex35tradeMain')
  //const alex35tradeBotWSrjxs = require('./expert_advisers/Alex/trade35WS_RxJS/alex351TradeMain')
  // !!!! alex35tradeBotWSrjxs() // вторая попытка (пока без стрима)
}

function testRxJS() {
  //const rxjsexample2 = require('./binance_Engine/tests_Ivan/rxjsExample2')
  // const rxjsExampleObservable = require('./binance_Engine/tests_Ivan/rxjsExample2')
  // rxjsexample2() // примеры rxjs
  //rxjsExampleObservable()
}

function testWebSocket() {
  // тесты с web socket
  // const testWSPublic = require('./binance_Engine/webSocket/examples/ws-public.ts')
  // const testWSClose = require('./binance_Engine/binance_WebSocket/examples/ws-close.ts')
  // const testWSUserData = require('./binance_Engine/binance_WebSocket/examples/ws-userdata.ts')
  // testWSPublic() // работает
  // testWSClose() // пока не работает
  // testWSUserData() // пока не работает
}

function testTelegramBot() {
  // тесты telegram bot's
  // const tgBotExpress = require('./expert_advisers/Alex/trade35WS_RxJS/tg.Bot.Express')
  // tgBotExpress() // не работает
}

module.exports = testOfNewFuctiouns

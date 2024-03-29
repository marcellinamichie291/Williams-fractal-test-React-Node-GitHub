/*
создаем класс

1. берем сохраненные свечи
2. добавляем НЕ финальную свечку
3. ищем фрактал
*/
//////////////////////////////

const getCandles = require('../../../API/binance.engine/usdm/getCandles.3param')
const { sendInfoToUser } = require('../../../API/telegram/telegram.bot')
const candlesToObject = require('../../common.func/candlesToObject')
const fractal_Bearish = require('../../common.func/fractal_Bearish')
const timestampToDateHuman = require('../../common.func/timestampToDateHuman')
//const choiceSymbol = require('../choiceSymbol')

/*
в начале запуска приложения:
1. запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

в call back: 
1. когда получили финальную свечку, запрашиваем 4 свечи в файле Class и храним их
2. получаем нефинальную последнюю свечю и отправляем ее в файл Class

пункты 1 и 2 прописать отдельными функциями в файле Class
*/

class alex4142Class1h {
  constructor(
    symbol,
    nameStrategy,
    takeProfitFloating,
    takeProfitConst,
    stopLossConst,
    shiftTime
  ) {
    this.symbol = symbol
    this.nameStrategy = nameStrategy

    this.takeProfitFloating = takeProfitFloating // плавающий TP
    this.takeProfitConst = takeProfitConst
    this.stopLossConst = stopLossConst
    this.shiftTime = shiftTime // сдвиг на одну свечу любого ТФ

    this.partOfDeposit = 0.25 // доля депозита на одну сделку
    this.multiplier = 10 // плечо

    this.candlesForFractal = [] // свечи для поиска фрактала

    // статистика
    this.countAllDeals = 0
    this.countOfPositive = 0 // кол-во положительных сделок
    this.countOfNegative = 0 // кол-во отрицательных сделок
    this.countOfZero = 0 // кол-во нулевых сделок

    //this.inOneDeal = new choiceSymbol()

    this.reset()
  }

  reset() {
    // общее для сигналов
    this.searchFractal = false // шаг 1: факт поиска неподтверждённого фрактала

    this.search1Step = false // шаг 2: факт поиска предварительного сигнала
    this.sygnal1Step = false // шаг 2: наличие предварительного сигнала

    this.brokenFractal = false // шаг 3: наличие сломанного фрактала
    this.canShort = false // шаг 4: определили цену для входа

    //this.fractalShadowLength = 0 // длина верхней тени фрактальной свечи
    this.fractalBearish = {
      isFractal: false,
    }

    //this.upperShadowRed = 0 // верхняя тень красной свечи
    //this.lowerShadowRed = 0 // верхняя тень красной свечи
    //this.diffShadowRed = 0 // отношение теней на красной свечи
    //this.fractalLengthCalc = 0 // для расчета отношения между high и low на фрактальной свече

    // для сигнала №1
    this.bodyLength1g = 0 // длина тела 1й зеленой свечи
    this.bodyLength2g = 0 // длина тела 2й зеленой свечи
    this.fractalBodyLength = 0 // длина тела фрактальной свечи
    this.middleShadow4 = 0 // середина верхней тени 4й свечи

    // для сигнала №2
    this.middleShadow3 = 0 // середина верхней тени 3й свечи
    this.bodyLength5g = 0 // длина тела 5й зеленой свечи
    this.upperShadow5g = 0 // верхняя тень 5й зеленой свечи

    // для сделки
    //this.sygnalSent = false
    //this.aboutBrokenFractal = false
    this.inPosition = false
    this.deposit = 1000
    this.whitchSignal = '' // для вывода клиенту
    this.whitchSignalTrue = 0 // для проверок внтури кода
    this.openShort = 0
    this.positionTime = 0
    this.sygnalTime = 0
    this.amountOfPosition = 0
    this.takeProfit = 0
    this.stopLoss = 0

    //this.fractalHigh = 0 // хай фрактала для отмены сигнала

    // для TP SL
    //this.openCandleIsGreen = false // свеча, на которой вошли в сделку, оказалась зеленой

    return this
  }

  // (0) подготовка данных для поиска фрактала
  async Alex4prepair5Candles(interval) {
    this.reset()
    const limitOfCandle = 5 // кол-во свечей для поиска фрактала
    const candles = await getCandles(this.symbol, interval, limitOfCandle) // получаем первые n свечей
    this.candlesForFractal = candlesToObject(candles) // преобрзауем массив свечей в объект
    //console.table(this.candlesForFractal)
    //console.log(`alex412: prepair5Candles(): прилетело ${this.candlesForFractal.length} свечей`) // удалить
    return this
  } // async prepair5Candles(interval

  prepairDataforFindFractal(lastCandle) {
    // заменяем последнюю свечку по примеру кода Толи
    if (
      this.candlesForFractal
        .map(({ startTime }) => startTime)
        .includes(lastCandle.startTime)
    ) {
      //console.log(`${this.symbol}: время последних свечей совпадает`) // закомментировать
      const delLastCandle = this.candlesForFractal.pop() // для начала удаляем незавршенную свечку
      //console.log(`${this.symbol}: убираем последнюю свечку`)
      //console.table(delLastCandle)
      //console.log(`${this.symbol}: кол-во свечей после удаления последней = ${this.candlesForFractal.length}`)
    } else {
      //console.log(`${this.symbol}: время последних свечей НЕ совпадает`)
      const delFirstCandle = this.candlesForFractal.shift() // удаляем первую свечку
      //console.log(`${this.symbol}: кол-во свечей после удаления первой = ${this.candlesForFractal.length}`) // закомментировать

      // выводим проверки
      //console.table(this.candlesForFractal)
      //console.table(lastCandle)
    }

    // далее добавляем последнюю свечку из WS
    this.candlesForFractal = this.candlesForFractal.concat(lastCandle)
    //console.log(`${this.symbol}: после замены свечек`)
    //console.table(this.candlesForFractal)
    //console.log(`${this.symbol}: итого кол-во свечей = ${this.candlesForFractal.length}`) // закомментировать

    return this
  } //prepairDataforFindFractal(lastCandle)

  // (1) ищем неподтвержденный фрактал
  alex4FindUnconfirmedFractal(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // await this.Alex4prepair5Candles(interval) // заново запрашиваем свечки
      //console.log(`\n---=== ${timestampToDateHuman(new Date().getTime())} ===---`)
      //console.log(`${this.symbol}: первоначальные свечи для поиска фрактала`)
      //console.table(this.candlesForFractal)

      this.prepairDataforFindFractal(lastCandle) // подготавливаем данные для поиска фрактала
      //console.log(`${this.symbol}: вторичные свечи для поиска фрактала`)
      //console.table(this.candlesForFractal)

      this.fractalBearish = fractal_Bearish(this.candlesForFractal) // ищем фрактал
      //console.log(this.symbol + ': фрактал ', this.fractalBearish)
      if (this.fractalBearish.isFractal) {
        // const message0 = `\n---=== ${timestampToDateHuman(new Date().getTime())} ===---`
        // const message1 = `\n${this.nameStrategy}, ${this.symbol}: нашли НЕПОДТВЕРЖДЕННЫЙ фрактал = ${this.fractalBearish.high} USD, его время: ${this.fractalBearish.timeH}`
        // console.log(message0 + message1)
      }
      this.searchFractal = true // ждем закрытие свечи для поиска следующего фрактала (нужен только для одноразового поиска фрактала, чтобы не загружать сервер проверкой на каждой нефинальной свечке)

      return this
    }
  } // alex4FindUnconfirmedFractal(lastCandle, interval)

  // (2) ищем сигнал. Часть 1
  alex4FindSygnal1Step(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      if (this.fractalBearish.isFractal) {
        // ищем сигнал №1: 3 зелёных, 1 красная
        // console.log(`шаг2: ищем ПРЕДВАРИТЕЛЬНЫЙ сигнал №1: 3 зелёных, 1 красная:`)

        // вычисляем длину зеленых свечей
        this.bodyLength1g =
          this.candlesForFractal[0].close / this.candlesForFractal[0].open - 1
        this.bodyLength2g =
          this.candlesForFractal[1].close / this.candlesForFractal[1].open - 1

        // готовим данные по свече фрактала
        this.fractalBodyLength =
          this.candlesForFractal[2].close / this.candlesForFractal[2].open - 1
        // this.fractalShadowLength = this.candlesForFractal[2].high / this.candlesForFractal[2].close - 1

        // const message = `bodyLength1g = ${this.bodyLength1g}\nbodyLength2g = ${this.bodyLength2g}\nfractalBodyLength = ${this.fractalBodyLength}\nmiddleShadow = ${this.middleShadow}`
        // console.log(message)

        if (
          // три первых свечи - ЗЕЛЕНЫЕ
          this.candlesForFractal[0].close > this.candlesForFractal[0].open && // 1я свеча ЗЕЛЕНАЯ
          this.candlesForFractal[1].close > this.candlesForFractal[1].open && // 2я свеча ЗЕЛЕНАЯ
          this.candlesForFractal[2].close > this.candlesForFractal[2].open && // 3я свеча фрактала ЗЕЛЕНАЯ
          // объемы растут (каждая зелёная больше объёмом)
          this.candlesForFractal[0].volume < this.candlesForFractal[1].volume &&
          this.candlesForFractal[1].volume < this.candlesForFractal[2].volume &&
          // тело каждой след-й зеленой больше предыдущей
          this.bodyLength1g < this.bodyLength2g &&
          this.bodyLength2g < this.fractalBodyLength &&
          // далее
          this.candlesForFractal[3].open > this.candlesForFractal[3].close // 4я свеча КРАСНАЯ
          // this.candlesForFractal[4].close > this.candlesForFractal[4].open && // 5 свеча зелёная
          // this.candlesForFractal[4].close >= this.middleShadow // и закрылась выше либо на середине тени 4й свечи
        ) {
          this.whitchSignalTrue = 1
          this.sygnal1Step = true

          // середина верхней тени 4й красной свечи
          this.middleShadow4 =
            (this.candlesForFractal[3].open + this.candlesForFractal[3].high) /
            2

          // console.log(`!!! шаг 2: нашли ПРЕДВАРИТЕЛЬНЫЙ сигнал №1: 3 зелёных, 1 красная !!!`)
        } else {
          // const message = `${this.nameStrategy}: [${this.symbol}]: шаг 2: ПРЕДВАРИТЕЛЬНЫЙ сигнал №1 ОТСУТСТВУЕТ: 3 зеленых и 1 красная`
          // console.log(message)
        }

        // ищем сигнал №2: 1 зелёная 2 красных
        // console.log(`\nшаг 2: ищем ПРЕДВАРИТЕЛЬНЫЙ сигнал №2: 1 зелёная 2 красных:`)
        if (
          this.candlesForFractal[0].open > this.candlesForFractal[0].close && // первая свеча - красная
          this.candlesForFractal[1].close > this.candlesForFractal[1].open && // вторая свеча - зеленая
          this.candlesForFractal[2].open > this.candlesForFractal[2].close && // свеча фрактала КРАСНАЯ
          this.candlesForFractal[3].open > this.candlesForFractal[3].close // 4я свеча КРАСНАЯ
          // this.candlesForFractal[4].close > this.candlesForFractal[4].open && // 5я свеча зеленая
          // this.candlesForFractal[4].close >= this.middleShadow && // и закрылась выше либо на середине тени 3й свечи
          //this.candlesForFractal[4].high >= this.candlesForFractal[2].high && // и хай 5-ой должен быть выше хая 3 красной
          // this.upperShadow5g < this.bodyLength5g
        ) {
          this.whitchSignalTrue = 2
          this.sygnal1Step = true

          // середина верхней тени фрактала
          this.middleShadow3 =
            (this.candlesForFractal[2].open + this.candlesForFractal[2].high) /
            2

          // console.log(`!!! шаг2: нашли ПРЕДВАРИТЕЛЬНЫЙ сигнал №2: 1 зелёная 2 красных !!!`)
        } else {
          // const message = `${this.nameStrategy}: [${this.symbol}]: шаг 2: ПРЕДВАРИТЕЛЬНЫЙ сигнал №2 ОТСУТСТВУЕТ: 1 зелёная и 2 красных`
          // console.log(message)
        }
      } // if (this.fractalBearish.isFractal)

      this.search1Step = true // чтобы больше не искали сигнал
      return this
    }
  } // findSygnal2(lastCandle, interval)

  // (3) ждем когда рынок сломает неподтвержденный фрактал
  alex4FindBrokenFractal(lastCandle) {
    if (this.fractalBearish.isFractal) {
      if (lastCandle.close > this.fractalBearish.high) {
        this.whitchSignal = this.nameStrategy // + ': 1 зелёная, 2 красных'
        this.brokenFractal = true
        //this.fractalOfBearish.isFractal = false

        const message = `\n-=${timestampToDateHuman(new Date().getTime())}=-\n${
          this.whitchSignal
        }\nМонета: ${this.symbol}\n--== Сломали фрактал ==--\nТекущая цена: ${
          lastCandle.close
        } USDT \nУровень фрактала: ${this.fractalBearish.high} USDT`
        // sendInfoToUser(message)
        // console.log(message)
        //this.reset()
        return this
      }
    }

    /*
    if (this.inPosition && !this.aboutBrokenFractal) {
      if (lastCandle.close > this.fractalHigh) {
        sendInfoToUser(
          `${this.whitchSignal}\n\nМонета: ${this.symbol}\n\n--== Сломали фрактал ==--\nТекущая цена: ${lastCandle.close} USDT \nУровень фрактала: ${this.fractalHigh} USDT\n\n--== Переноси Take Profit в БУ ==--\nTake Profit = ${this.openShort}`
        )
        this.changeTPSLCommon(lastCandle)
        this.aboutBrokenFractal = true
      }
    }
    return this
    */
  }

  // "отключил"
  async alex4FindSygnal(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // подготавливаем данные для проверки условий
      await this.Alex4prepair5Candles(interval)
      console.log(
        `\n---=== ${timestampToDateHuman(new Date().getTime())}: ${
          this.nameStrategy
        }: [${this.symbol}] новые свечи для поиска сигнала ===---`
      )
      console.table(this.candlesForFractal)

      // подготавливаем данные для поиска фрактала
      // this.prepairDataforFindFractal(lastCandle)

      // ищем фрактал
      // this.fractalBearish = fractal_Bearish(this.candlesForFractal)

      // расчет отношения между high и low на фрактальной свече
      // this.fractalLengthCalc = (this.candlesForFractal[2].high / this.candlesForFractal[2].low - 1) * 100

      // вычисляем тени на 4й красной свече
      // this.upperShadowRed = this.candlesForFractal[3].high / this.candlesForFractal[3].open - 1
      // this.lowerShadowRed = this.candlesForFractal[3].close / this.candlesForFractal[3].low - 1
      // this.diffShadowRed = this.lowerShadowRed / this.upperShadowRed - 1
      //console.log(`this.diffShadowRed: ${this.diffShadowRed}`)

      // готовим свечки для анализа
      //this.Alex4prepair5Candles(interval)
      //console.log(`\nAlex4FindSygnal: свечи для поиска фрактала`)
      //console.table(this.candlesForFractal)
      //this.fractalBearish = fractal_Bearish(this.candlesForFractal) // ищем фрактал

      if (this.brokenFractal) {
        // ищем сигнал №1: 3 зелёных, 1 красная
        console.log(`ищем сигнал №1: 3 зелёных, 1 красная:`)

        // вычисляем длину зеленых свечей
        this.bodyLength1g =
          this.candlesForFractal[0].close / this.candlesForFractal[0].open - 1
        this.bodyLength2g =
          this.candlesForFractal[1].close / this.candlesForFractal[1].open - 1

        // готовим данные по свече фрактала
        this.fractalBodyLength =
          this.candlesForFractal[2].close / this.candlesForFractal[2].open - 1
        // this.fractalShadowLength = this.candlesForFractal[2].high / this.candlesForFractal[2].close - 1

        // середина верхней тени 4й красной свечи
        this.middleShadow =
          (this.candlesForFractal[3].open + this.candlesForFractal[3].high) / 2

        const message = `bodyLength1g = ${this.bodyLength1g}\nbodyLength2g = ${this.bodyLength2g}\nfractalBodyLength = ${this.fractalBodyLength}\nmiddleShadow = ${this.middleShadow}`
        console.log(message)

        if (
          // три первых свечи - ЗЕЛЕНЫЕ
          this.candlesForFractal[0].close > this.candlesForFractal[0].open && // 1я свеча ЗЕЛЕНАЯ
          this.candlesForFractal[1].close > this.candlesForFractal[1].open && // 2я свеча ЗЕЛЕНАЯ
          this.candlesForFractal[2].close > this.candlesForFractal[2].open && // 3я свеча фрактала ЗЕЛЕНАЯ
          // объемы растут (каждая зелёная больше объёмом)
          this.candlesForFractal[0].volume < this.candlesForFractal[1].volume &&
          this.candlesForFractal[1].volume < this.candlesForFractal[2].volume &&
          // тело каждой след-й зеленой больше предыдущей
          this.bodyLength1g < this.bodyLength2g &&
          this.bodyLength2g < this.fractalBodyLength &&
          // далее
          this.candlesForFractal[3].open > this.candlesForFractal[3].close && // 4я свеча КРАСНАЯ
          this.candlesForFractal[4].close > this.candlesForFractal[4].open && // 5 свеча зелёная
          this.candlesForFractal[4].close >= this.middleShadow // и закрылась выше либо на середине тени 4й свечи
        ) {
          //if (!this.sygnalSent) {
          this.whitchSignal = this.nameStrategy + ': 3 зеленых и 1 красная'
          this.openShortCommon()

          console.log(`!!! нашли ${this.whitchSignal} !!!`)

          //}
          // console.table(this.fractalBearish)
        } // else this.brokenFractal = false
        else {
          console.log(
            `${this.nameStrategy}: [${this.symbol}]: сигнал №1 отсутствует: 3 зеленых и 1 красная`
          )
        }

        // ищем сигнал №2: 1 зелёная 2 красных
        console.log(`\nищем сигнал №2: 1 зелёная 2 красных:`)
        // середина верхней тени фрактала
        this.middleShadow =
          (this.candlesForFractal[2].open + this.candlesForFractal[2].high) / 2

        // длина тела 5й зеленой свечи
        this.bodyLength5g =
          this.candlesForFractal[4].close / this.candlesForFractal[4].open - 1

        // верхняя тень 5й зеленой свечи
        this.upperShadow5g =
          this.candlesForFractal[4].high / this.candlesForFractal[4].close - 1

        const message2 = `middleShadow = ${this.middleShadow}\nbodyLength5g = ${this.bodyLength5g}\nupperShadow5g = ${this.upperShadow5g}`
        console.log(message2)

        if (
          this.candlesForFractal[0].open > this.candlesForFractal[0].close && // первая свеча - красная
          this.candlesForFractal[1].close > this.candlesForFractal[1].open && // вторая свеча - зеленая
          this.candlesForFractal[2].open > this.candlesForFractal[2].close && // свеча фрактала КРАСНАЯ
          this.candlesForFractal[3].open > this.candlesForFractal[3].close && // 4я свеча КРАСНАЯ
          this.candlesForFractal[4].close > this.candlesForFractal[4].open && // 5я свеча зеленая
          this.candlesForFractal[4].close >= this.middleShadow && // и закрылась выше либо на середине тени 3й свечи
          //this.candlesForFractal[4].high >= this.candlesForFractal[2].high && // и хай 5-ой должен быть выше хая 3 красной
          this.upperShadow5g < this.bodyLength5g
        ) {
          //if (!this.sygnalSent) {
          this.whitchSignal = this.nameStrategy + ': 1 зелёная и 2 красных'
          this.openShortCommon()

          console.log(`!!! нашли ${this.whitchSignal} !!!`)
          //}
        } // else this.brokenFractal = false
        else {
          console.log(
            `${this.nameStrategy}: [${this.symbol}]: сигнал №2 отсутствует: 1 зелёная и 2 красных`
          )
        }
      } // if (this.brokenFractal)

      // если сигналов не было, то можно сбросить флаги this.brokenFractal и по фракталу
      if (!this.canShort) {
        this.reset()
      }
      //console.table(this.fractalBearish)
      return this
    }
  } // findSygnal(lastCandle, interval)

  // (4) ищем сигнал. Часть 2
  alex4FindSygnal2(lastCandle, interval) {
    // допроверка сигнала №1: 3 зелёных, 1 красная
    // console.log('вторая проверка наличия сигнала. lastCandle:')
    // console.table(lastCandle)
    if (
      this.whitchSignalTrue == 1 &&
      lastCandle.close > lastCandle.open && // 5 свеча зелёная
      lastCandle.close >= this.middleShadow4 // и закрылась выше либо на середине тени 4й свечи
    ) {
      this.whitchSignal = this.nameStrategy + ': 3 зеленых и 1 красная'
      console.log(`!!! нашли ${this.whitchSignal} !!!`)
      this.openShortCommon(lastCandle)
    } else {
      console.log('нет сигнала №1')
    } // if (this.whitchSignalTrue == 1)

    // допроверка сигнала №2: 1 зелёная 2 красных
    if (
      this.whitchSignalTrue == 2 &&
      lastCandle.close > lastCandle.open && // 5 свеча зелёная
      lastCandle.close >= this.middleShadow3 // и закрылась выше либо на середине тени 3й свечи
    ) {
      this.bodyLength5g = lastCandle.close / lastCandle.open - 1 // длина тела 5й зеленой свечи
      this.upperShadow5g = lastCandle.high / lastCandle.close - 1 // верхняя тень 5й зеленой свечи

      if (this.upperShadow5g < this.bodyLength5g) {
        this.whitchSignal = this.nameStrategy + ': 1 зелёная и 2 красных'
        console.log(`!!! нашли ${this.whitchSignal} !!!`)
        this.openShortCommon(lastCandle)
      } else {
        console.log('нет сигнала №2')
      }
    } // if (this.whitchSignalTrue == 2)

    if (!this.canShort) {
      this.reset()
    }
    return this
  }

  // функция openShortCommon с общими полями для входа в сделку
  openShortCommon(lastCandle) {
    //this.fractalHigh = this.fractalBearish.high
    //this.fractalBearish.isFractal = false
    //this.sygnalSent = true
    this.canShort = true // !!!! закоментировать это
    this.openShort = lastCandle.close
    //this.middleShadow = (this.candlesForFractal[3].open + this.candlesForFractal[3].high) / 2 // середина верхней тени
    //this.openShort = this.middleShadow
    this.sygnalTime = lastCandle.startTime + this.shiftTime

    // вычисляем уровень take profit
    this.takeProfit = +(this.openShort * (1 - this.takeProfitConst)).toFixed(5)

    // вычисляем уровень Stop Loss
    this.stopLoss = +(this.openShort * (1 + this.stopLossConst)).toFixed(5)

    // считаем объем сделки
    this.amountOfPosition = +(
      (this.deposit / this.openShort) *
      this.partOfDeposit *
      this.multiplier
    ).toFixed(8)

    const message = `---=== НОВЫЙ СИГНАЛ ===---\n${
      this.whitchSignal
    }\nМонета: ${this.symbol}\n\nЦена для входа в SHORT: ${
      this.openShort
    }\n\nКол-во монет: ${this.amountOfPosition}\nВзяли ${
      this.partOfDeposit * 100
    }% c плечом ${this.multiplier}x от депозита = ${
      this.deposit
    } USDT\n\nПоставь:\nTake Profit: ${this.takeProfit} (${
      this.takeProfitConst * 100
    }%)\nStop Loss: ${this.stopLoss} (${
      this.stopLossConst * 100
    }%)\n\nЖдем цену на рынке для входа в SHORT...`

    //sendInfoToUser(message)
    console.log(message)

    // !!! отправляем в общий класс информацию о: монете, длине 5й свечи, цене входа. Будем сравнивать по длине 5й свечи
    //this.inOneDeal.symbolAdd(this.symbol, this.openShort, this.bodyLength5g)
    return this
  } // openShortCommon()

  // (5) отправляем ордер на биржу
  alex4CanShortPosition(lastCandle, interval) {
    if (this.canShort) {
      if (lastCandle.interval == interval) {
        if (lastCandle.close > this.openShort) {
          //this.canShort = false
          this.inPosition = true
          this.positionTime = new Date().getTime()

          // !!! отправляем ордер на биржу. Если в ответе есть кол-во монет, тогда отправляем следующее сообщение

          sendInfoToUser(
            `${this.whitchSignal}\n\nМонета: ${
              this.symbol
            }\n\n--== Вошли в SHORT ==--\nпо цене: ${
              this.openShort
            } USDT\nТекущая close цена: ${
              lastCandle.close
            } USD\n\nВремя сигнала: ${timestampToDateHuman(
              this.sygnalTime
            )}\nВремя входа: ${timestampToDateHuman(
              this.positionTime
            )}\n\nЖдем цену на рынке для выхода из сделки...`
          )
        }
      }
    }
    return this
  } // canShortPosition(lastCandle, interval)

  ///////////////////////
  //// закрытие шорт позиции по Take Profit или Stop Loss
  alex4CloseShortPosition(lastCandle, interval) {
    if (this.inPosition) {
      // условия выхода из сделки по TP
      if (lastCandle.interval == interval) {
        //if (lastCandle.low <= this.takeProfit) {
        if (lastCandle.close <= this.takeProfit) {
          //this.closeShort = lastCandle.low
          this.closeShort = this.takeProfit
          //this.closeTime = lastCandle.startTime
          this.closeTime = new Date().getTime()

          this.profit = +(
            (this.openShort - this.closeShort) *
            this.amountOfPosition
          ).toFixed(2)

          this.percent = +((this.profit / this.deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

          // this.inPosition = false

          // статистика
          this.countAllDeals++
          if (this.profit > 0) {
            this.countOfPositive++
          } else {
            this.countOfZero++
          }

          // отправка сообщения
          // console.log(`Close SHORT with takeProfit: ${this.closeShort}`)
          const message1 = `${this.whitchSignal}\n${timestampToDateHuman(
            this.closeTime
          )}\n\nМонета: ${this.symbol}\nТекущая close цена: ${
            lastCandle.close
          } USD\n\n--== Close SHORT ==--\nwith Take Profit: ${
            this.closeShort
          }\nПрибыль = ${this.profit} USDT (${this.percent}% от депозита)`

          const message2 = `\n\nСтатистика по ${this.symbol}:\nВсего сделок: ${this.countAllDeals}, среди которых\nПоложительных: ${this.countOfPositive}\nОтрицательных: ${this.countOfNegative}\nНулевых: ${this.countOfZero}`

          sendInfoToUser(message1 + message2)
          this.reset()
          //this.inOneDeal.reset414()
        } // условия выхода из сделки по TP

        // условия выхода из сделки по SL
        else if (lastCandle.close >= this.stopLoss) {
          //this.closeShort = lastCandle.high
          this.closeShort = this.stopLoss
          //this.closeTime = lastCandle.startTime
          this.closeTime = new Date().getTime()

          this.profit = +(
            (this.openShort - this.closeShort) *
            this.amountOfPosition
          ).toFixed(2)

          this.percent = +((this.profit / this.deposit) * 100).toFixed(2) // считаем процент прибыли по отношению к депозиту до сделки

          //this.inPosition = false

          // статистика
          this.countAllDeals++
          if (this.profit < 0) {
            this.countOfNegative++
          } else {
            this.countOfZero++
          }

          // отправка сообщения
          //console.log(`Close SHORT with stopLoss: ${this.closeShort}`)
          const message1 = `${this.whitchSignal}\n${timestampToDateHuman(
            this.closeTime
          )}\n\nМонета: ${this.symbol}\nТекущая close цена: ${
            lastCandle.close
          } USD\n\n--== Close SHORT ==--\nwith Stop Loss: ${
            this.closeShort
          }\nУбыток = ${this.profit} USDT (${this.percent}% от депозита)`

          const message2 = `\n\nСтатистика по ${this.symbol}:\nВсего сделок: ${this.countAllDeals}, среди которых\nПоложительных: ${this.countOfPositive}\nОтрицательных: ${this.countOfNegative}\nНулевых: ${this.countOfZero}`

          sendInfoToUser(message1 + message2)
          this.reset()
        } // отработка выхода из сделки по SL
      } // if (lastCandle.interval == interval)
    } // if (this.inPosition)

    return this
  } // closeShortPosition(lastCandle, interval)

  ///////////////////////////
  //// общие функции для условия переноса Take Profit или Stop Loss
  changeTPSLCommon(lastCandle) {
    // отправка сообщения для контроля расчета времени сдвига
    /*
    sendInfoToUser(
      `${
        this.whitchSignal
      }\nПроверка расчета времени переноса TP и SL\nМонета: ${
        this.symbol
      }:\n\nВремя появления сигнала:\n${timestampToDateHuman(
        this.sygnalTime
      )}\n\nВремя свечи для изменения TP и SL:\n${timestampToDateHuman(
        this.sygnalTime + this.shiftTime * 2
      )}\n\nВремя входа в позицию:\n${timestampToDateHuman(this.positionTime)}`
    )
    */

    // моделирование условия if (i >= indexOfPostion + 2)
    //if (lastCandle.startTime >= this.sygnalTime + this.shiftTime) {
    // изменение TP: если мы в просадке
    if (this.openShort < lastCandle.close) {
      if (!this.changedTP) {
        this.takeProfit = this.openShort * (1 - 0.001)
        // dateChangeTP = array[i].startTime
        this.changedTP = true
        sendInfoToUser(
          `${this.whitchSignal}\nМонета: ${
            this.symbol
          }\n\nВремя появления сигнала:\n${timestampToDateHuman(
            this.sygnalTime
          )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
            this.positionTime
          )}\n\n--== Мы в вариативной просадке ==--\nМеняем take profit на (точку входа - 0.1%): ${
            this.takeProfit
          }`
        )
      }
    } else {
      if (!this.changedSL) {
        // изменение SL: если мы в прибыли
        this.stopLoss = this.openShort * (1 - 0.001)
        // dateChangeSL = array[i].startTime
        this.changedSL = true
        sendInfoToUser(
          `${this.whitchSignal}\nМонета: ${
            this.symbol
          }\n\nВремя появления сигнала:\n${timestampToDateHuman(
            this.sygnalTime
          )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
            this.positionTime
          )}\n\n--= Мы в вариативной прибыли ==--\nМеняем stop loss на (точку входа - 0.1%): ${
            this.stopLoss
          }`
        )
      }
    }
    //} // if (lastCandle.startTime >= this.startTime + shiftTime)
    return this
  }
  //// условия переноса Take Profit или Stop Loss
  alex4ChangeTPSL(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      /*
      // 1. Если тело свечи открытия выше цены точки входа тогда тейк переносится на точку входа
      if (lastCandle.startTime == this.sygnalTime) {
        if (lastCandle.close > lastCandle.open) {
          // проверяем на зеленой свече
          this.changeTPSL2(lastCandle.close)
        } else {
          // свеча оказалась красной
          this.changeTPSL2(lastCandle.open)
        }
      }
      */

      // 30.09.2022
      // (1) Если свеча открытия зеленая, тогда перенос после закрытия свечи входа в позицию
      if (
        lastCandle.startTime == this.sygnalTime &&
        lastCandle.close > lastCandle.open
      ) {
        // перенос стопа или тейка после закрытия свечи открытия
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }

      // (2) иначе перенос TPSL после закрытия третьей свечи
      if (lastCandle.startTime == this.sygnalTime + this.shiftTime * 2) {
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }

      // 03.10.2022
      /*
      // (1) Если свеча открытия зеленая и следующая свеча зеленая, то TP переносится БУ
      if (
        lastCandle.startTime == this.sygnalTime &&
        lastCandle.close > lastCandle.open
      ) {
        this.openCandleIsGreen = true
      }
      if (
        lastCandle.startTime == this.sygnalTime + this.shiftTime &&
        lastCandle.close > lastCandle.open && // следующая свеча зеленая
        this.openCandleIsGreen // свеча открытия зеленая
      ) {
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }

      // (2) В остальных случая стоп тейк переносится в БУ после 5й свечи
      if (lastCandle.startTime == this.sygnalTime + this.shiftTime * 4) {
        this.changeTPSLCommon(lastCandle) // проверка общих условий по переносу TP и SL
      }
      */
    }
    return this
  }

  alex4ChangeTPSLOnMarket(lastCandle, interval) {
    if (lastCandle.interval == interval) {
      // при достижении профита 1.5% стоп переносим в б.у.
      if (lastCandle.close < this.openShort * (1 - this.takeProfitFloating)) {
        if (!this.changedSL) {
          // изменение SL: если мы в прибыли
          this.stopLoss = this.openShort
          this.changedSL = true
          sendInfoToUser(
            `${this.whitchSignal}\nМонета: ${
              this.symbol
            }\n\nВремя появления сигнала:\n${timestampToDateHuman(
              this.sygnalTime
            )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
              this.positionTime
            )}\n\n--= Мы в вариативной прибыли > ${
              this.takeProfitFloating * 100
            }% ==--\nМеняем Stop Loss на точку входа: ${this.stopLoss}`
          )
        } // if (!this.changedSL)
      } // if (lastCandle.close < this.openShort * (1-0.008))

      // Если от точки входа -0.5% тейк переносится в БУ
      /*
      if (lastCandle.close > this.openShort * (1 + 0.005)) {
        if (!this.changedTP) {
          this.takeProfit = this.openShort
          this.changedTP = true
          sendInfoToUser(
            `${this.whitchSignal}\nМонета: ${
              this.symbol
            }\n\nВремя появления сигнала:\n${timestampToDateHuman(
              this.sygnalTime
            )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
              this.positionTime
            )}\n\n--== Мы в вариативной просадке -0.5% ==--\nМеняем Take Profit на точку входа: ${
              this.takeProfit
            }`
          )
        } // if (!this.changedTP)
      } // if (lastCandle.close > this.openShort * (1 + 0.005))
      */
    } // if (lastCandle.interval == interval)
    return this
  } // changeTPSLOnMarket()

  /*
  changeTPSL2(price) {
    if (this.openShort < price) {
      if (!this.changedTP) {
        this.takeProfit = this.openShort
        // dateChangeTP = array[i].startTime
        this.changedTP = true
        sendInfoToUser(
          `${this.whitchSignal}\nМонета: ${
            this.symbol
          }\n\nВремя появления сигнала:\n${timestampToDateHuman(
            this.sygnalTime
          )}\n\nВремя входа в позицию:\n${timestampToDateHuman(
            this.positionTime
          )}\n\n--== Мы в вариативной просадке ==--\nМеняем take profit на точку входа: ${
            this.takeProfit
          }`
        )
      }
    }
  }
  */
}
module.exports = alex4142Class1h

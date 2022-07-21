// like as AuthPage.js
import React, { useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'
import { useMessage } from '../hooks/message.hook'
// import Loader from '../loader'

export const MainPage = () => {
  const message = useMessage()

  const { loading, error, request, clearError } = useHttp()
  // hook для валидации на frontend
  const [form, setForm] = useState({
    symbol: '',
    seniorTimeFrame: '',
    lowerTimeFrame: '',
  })

  // обработка ошибок на клиенте
  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  // обработка формы (метод принимает нативный js event)
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  // создаем запрос на сервер на основе своего hook

  const registerHandler = async () => {
    try {
      //const data = await request('/api/userrequest/datarequest', 'POST', {
      const data = await request('/', 'POST', {
        ...form,
      })
      //message(data.message)
      console.log(data)
      setData(data) //  установил данные в React
      //setStartTrend(data.startOfTrend)
    } catch (e) {}
  }

  const [data, setData] = useState({})
  //const [startTrend, setStartTrend] = useState(0)
  // const [loading2, setLoading2] = useState(true)

  /*
  const registerHandler = async () => {
    try {
      const data = await request('/api/userrequest/datarequest', {
        method: 'POST',
        headers: {
          //'Content-Type': 'application/json;charset=utf-8',
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: JSON.stringify(...form),
      })
      message(data.message)
    } catch (e) {}
  }
  */

  return (
    <>
      {/* Запрос пользователя */}
      <h2>Тестер стратегии</h2>
      <h3>фракталы Билла Вильямса</h3>
      <hr></hr>
      <form action="/" method="POST">
        <h4>Введите параметры:</h4>

        <div class="input-field">
          <input type="text" name="symbol" onChange={changeHandler} />
          <label>Инструмент. Например: btcusdt, ETHUSDT</label>
        </div>

        <p>
          Ниже введи старший и младщий таймфрейм. Таймфреймы бывают: 1m, 3m, 5m,
          15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
        </p>
        <p>где: m - minutes; h - hours; d - days; w - weeks; M - months</p>
        <p>
          <b>ВАЖНО! Приложение пока работает на ТФ: 2h, 1h, 15, 5m</b>
        </p>
        <div class="input-field">
          <input type="text" name="seniorTimeFrame" onChange={changeHandler} />
          <label>Старший тайм фрейм. Например: 1h</label>
        </div>

        <div class="input-field">
          <input type="text" name="lowerTimeFrame" onChange={changeHandler} />
          <label>Младший тайм фрейм. Например: 5m</label>
        </div>

        <p>
          Ниже укажи временной интервал в формате YYYY-MM-DDTHH:mm:ss.sss, где:
          YYYY-MM-DD – дата в формате год-месяц-день. Обычный символ T
          используется как разделитель. HH:mm:ss.sss – время:
          часы-минуты-секунды-миллисекунды.
        </p>

        <div class="input-field">
          <input type="text" name="dateStart" onChange={changeHandler} />
          <label>
            Дата и время первой свечи. Например: 2022-01-01T00:00:00.000
          </label>
        </div>

        <div class="input-field">
          <input type="text" name="dateFinish" onChange={changeHandler} />
          <label>
            Дата и время последней свечи. Например: 2022-02-30T00:00:00.000
          </label>
        </div>

        <div class="input-field">
          <input type="text" name="deposit" onChange={changeHandler} />
          <label>Введите размер депозита</label>
        </div>

        <div class="input-field">
          <input type="text" name="partOfDeposit" onChange={changeHandler} />
          <label>Введите % от депозита для работы: от 0.01 до 1</label>
        </div>

        <div class="input-field">
          <input type="text" name="multiplier" onChange={changeHandler} />
          <label>Введите плечо: от 1 до 20</label>
        </div>

        <h6>
          Внимание! Отсутствует защита от дурака! Поэтому проверь корректность
          данных
        </h6>

        <button
          type="submit"
          class="btn"
          onClick={registerHandler}
          disabled={loading}
        >
          Запустить тест!
        </button>
      </form>

      {/*<div>re re: {startTrend}</div> */}
      <hr></hr>
      {/* справочные данные */}
      <h4>Общая статистика:</h4>

      <div>Время запуска скрипта: {data.startProgramAtToHuman}</div>
      {data && data.statistics && (
        <div>
          <div>
            Депозит: {data.statistics.deposit} USD (равен цене входа в первую
            сделку)
          </div>
          <div>Всего сделок: {data.statistics.allDealsCount} штук</div>
          <div>Итоговая прибыль: {data.statistics.globalProfit} USD</div>
          <div>ROI: {data.statistics.roi} %</div>
          <div>Дней торговли: {data.statistics.dayOfTrade}</div>
          <div>ROI годовых: {data.statistics.roiPerYear} %</div>
          <div>
            Максимальная просадка: {data.statistics.drawdown} USD, (
            {data.statistics.drawdownPer} % (соответственно, можно рассчитать
            плечо))
          </div>
          <div>
            кол-во положительных сделок: {data.statistics.countOfPositive}
          </div>
          <div>
            кол-во отрицательных сделок: {data.statistics.countOfNegative}
          </div>
          <div>
            Время выполнения скрипта: {data.statistics.diffInSecond} секунд
          </div>
        </div>
      )}

      <p>Ниже вся детальная информация</p>
      <hr></hr>
      {/* Список трендов (после фильтрации) */}
      <h4>Список трендов</h4>
      {/*<p>PS: соединил повторяющиеся тренды</p>*/}
      <div>
        {' '}
        {/*обёртка*/}
        <table>
          {/*таблица*/}
          <tr>
            {/*строка*/}
            <td>№</td> {/*ячейка*/}
            <td>Тренд</td>
            <td>Время фрактала</td>
            <td>Цена фрактала</td>
            <td>Начало тренда</td>
            <td>Экстремум цены пробития</td>
          </tr>
          {data &&
            data.trends &&
            data.trends.map((trend, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{trend.trend}</td>
                <td>{trend.fractalTime}</td>
                <td>{trend.fractalPrice}</td>
                <td>{trend.priceTime}</td>
                <td>{trend.price}</td>
              </tr>
            ))}
        </table>
      </div>
      <hr></hr>
      {/* Статистика внутри трендов*/}
      <h4>Статистика внутри трендов</h4>
      <p>Прибыль или убыток внутри каждого тренда:</p>
      <div>
        {' '}
        {/*обёртка*/}
        <table>
          {/*таблица*/}
          <tr>
            {/*строка*/}
            <td>№</td> {/*ячейка*/}
            <td>Тренд</td>
            <td>Начало</td>
            <td>Завершение</td>
            <td>Результат</td>
          </tr>
          {data &&
            data.statInTredn &&
            data.statInTredn.map((stat) => (
              <tr>
                <td>{stat.indexOfTrend + 1}</td>
                <td>{stat.trendIs}</td>
                <td>{stat.startTrend}</td>
                <td>{stat.endTrend}</td>
                <td>{stat.profitInTrend}</td>
              </tr>
            ))}
        </table>
      </div>
      <hr></hr>
      {/*таблица всех сделок*/}
      <h4>Таблица всех сделок</h4>
      <p>
        <b>Цена выхода</b> - закрытие сделки по последнему фракталу
      </p>
      <p>
        <b>varMaxProfit</b> - Потенциальная максимальая прибыль до закрытия
        сделки по stopLoss.
      </p>
      <p>
        <b>procentVMP</b> - процент varMaxProfit. Можно вычислить средний
        процент.
      </p>
      <p>
        <b>timeOfVMP</b> - время наступленмя varMaxProfit.
      </p>
      <p>
        <b>lastPrice</b> - закрытие сделки по цене последней свечки в конце
        тренда.
      </p>
      <div className="table">
        {' '}
        {/*обёртка*/}
        <table>
          {/*таблица*/}
          <tr>
            {/*строка*/}
            <td>№</td> {/*ячейка*/}
            <td>Открываем</td>
            <td>Цена входа</td>
            <td>Время входа</td>
            <td>Закрываем</td>
            <td>Цена выхода</td>
            <td>Время выхода</td>
            <td>Прибыль / Убыток</td>
            <td>в процентах</td>
            <td>varMaxProfit</td>
            <td>procentVMP</td>
            <td>timeOfVMP</td>
            <td>lastPrice</td>
          </tr>
          {data &&
            data.allDeals &&
            data.allDeals.map((deal, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{deal.openPosition}</td>
                <td>{deal.openPrice}</td>
                <td>{deal.openTime}</td>
                <td>{deal.closePosition}</td>
                <td>{deal.closePrice}</td>
                <td>{deal.closeTime}</td>
                <td>{deal.profit}</td>
                <td>{deal.percent}</td>
                <td>{deal.varMaxProfit}</td>
                <td>{deal.procentVMP}</td>
                <td>{deal.timeOfVMP}</td>
                <td>{deal.lastPrice}</td>
              </tr>
            ))}
        </table>
      </div>
      <hr></hr>
      <p>Спасибо!</p>
    </>
  )
}

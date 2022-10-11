const { sendInfoToUser } = require('../../API/telegram/telegram.bot')
const timestampToDateHuman = require('../common.func/timestampToDateHuman')
const {
  symbolsPart1,
  symbolsPart2,
  nameStrategy,
  options,
  timeFrames,
} = require('./input_parameters')
const robotMain = require('./robot_main')

function robotStart() {
  // 1h
  robotMain(
    symbolsPart1, // 1я часть монет
    timeFrames.timeFrame1h,
    nameStrategy.notice1h,
    options.takeProfitFloating1h,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )

  robotMain(
    symbolsPart2, // 2я часть монет
    timeFrames.timeFrame1h,
    nameStrategy.notice1h,
    options.takeProfitFloating1h,
    options.takeProfitConst1h,
    options.stopLossConst1h,
    options.shiftTime1h
  )

  // 30 min
  robotMain(
    symbolsPart1, // 1я часть монет
    timeFrames.timeFrame30m,
    nameStrategy.notice30m,
    options.takeProfitFloating30m,
    options.takeProfitConst30m,
    options.stopLossConst30m,
    options.shiftTime30m
  )

  robotMain(
    symbolsPart2, // 2я часть монет
    timeFrames.timeFrame30m,
    nameStrategy.notice30m,
    options.takeProfitFloating30m,
    options.takeProfitConst30m,
    options.stopLossConst30m,
    options.shiftTime30m
  )

  // отправка сообщения в телеграм
  const message0 = `--== Торговый робот запущен ==--\n${timestampToDateHuman(
    new Date().getTime()
  )}`
  const message1hPart1 = `\n\n${nameStrategy.notice1h}. Монет ${symbolsPart1.length}`
  const message1hPart2 = `\n${nameStrategy.notice1h}. Монет ${symbolsPart2.length}`
  const message30mPart1 = `\n\n${nameStrategy.notice30m}. Монет ${symbolsPart1.length}`
  const message30mPart2 = `\n${nameStrategy.notice30m}. Монет ${symbolsPart2.length}`

  sendInfoToUser(
    message0 +
      message1hPart1 +
      message1hPart2 +
      message30mPart1 +
      message30mPart2
  )
}

module.exports = robotStart

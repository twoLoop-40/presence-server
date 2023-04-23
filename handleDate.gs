function getRangeOfDate (sheetName, row = 3) {
  return (ssName) => pipe(
    getSpreadSheet,
    (ss) => {
      const sheet = ss.getSheetByName(sheetName)
      return {sheet, row}
    },
    getOneRowRange,
  )(ssName)
}

function getDateInfo(sheetName, row) {
  const SS_NAME = 'kongLecture'
  const getDateValues = attachSSName(getRangeOfDate)
  const dateValuesUnfiltered = getDateValues(SS_NAME, sheetName, row).getValues();
  let dateInfo = []
  deepMap(dateValuesUnfiltered, 0,(value, index) => {
    if(value !== undefined && value instanceof Date){
      const dateTime = value.getTime()
      const position = index
      const info = {dateTime, position}
      dateInfo.push(info)
      return info    
    }
    return null    
  })
  return dateInfo
}

function getMonthAndDate(dateTime) {
  const dateObj = new Date(dateTime)
  return {month: dateObj.getMonth() + 1, date: dateObj.getDate()}
}

function getDateMonthAndDate(sheetName, row) {
  return pipe(
    getDateInfo,
    (dateInfoArr) => dateInfoArr.map(({dateTime, position}) => {
      return {monthDate: getMonthAndDate(dateTime), position}
    })
  )(sheetName, row)
}
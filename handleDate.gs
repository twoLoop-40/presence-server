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
  const dateValuesUnfiltered = pipe(
    attachSSName,
    (getDateValues) => getDateValues(SS_NAME, sheetName, row).getValues()
  )(getRangeOfDate)

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

function getTimeFrom(fullYear, month, time) {
  const date = new Date(fullYear, month, time)
  return date.getTime()
}

function getDateMonthAndDate(sheetName, row) {
  return pipe(
    getDateInfo,
    (dateInfoArr) => dateInfoArr.map(({dateTime, position}) => {
      return {monthDate: getMonthAndDate(dateTime), position}
    })
  )(sheetName, row)
}

function getDateRange(startDay, endDay) {
  return [startDay, endDay].map((date) => {
    return pipe(
      (dateString) => dateString.split('-'),
      ([fullYear, month, date]) => getTimeFrom(fullYear, month, date)
    )(date)
  })
}

function getPositionOfRange(startDay, endDay) {
  const findValidateIndex = pipe(
    ([startDay, endDay]) => getDateRange(startDay, endDay),
    ([startDateTime, endDateTime]) => (dateTimes) => {
      return parallel(
        (dateTimes) => dateTimes.map((dateTime) => dateTime >= startDateTime), 
        (dateTimes) => dateTimes.map((dateTime) => dateTime <= endDateTime)
      )(dateTimes)(
        ([greater, less]) => {
          let validated = []
          greater.forEach((value, idx) => {
            if(value && less[idx]){
              validated.push(idx)
            }
          })
          return validated
        })
      }
  )([startDay, endDay])
  
  return (sheetName, row) => {
    const CurrentFullYear = 2023
    return parallel(
      (dateInfo) => 
        pipe(
          (dateInfo) => dateInfo.map(({monthDate}) => getTimeFrom(CurrentFullYear, monthDate.month, monthDate.date)),
          (dateTimes) => {
            return findValidateIndex(dateTimes)
          }      
        )(dateInfo),
      (dateInfo) => 
        {
          return dateInfo.map(({position}) => position)
        }
    )(getDateMonthAndDate(sheetName, row))(
      ([validateIndex, positions]) => validateIndex.map((idx) => positions[idx])
    )    
  }
}
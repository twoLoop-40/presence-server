function test() {
  const SS_NAME = 'kongLecture'
  const SHEET_NAME = '2023 1학기'
  const ROW = 3
  const startDay = '2023-4-6'
  const endDay = '2023-5-17'
  
  console.log(getDateMonthAndDate(SHEET_NAME, ROW))
  console.log(getDateRange(startDay, endDay))

}

function doGet(e) {
  const type = getTypeOf(e)
}
  

function getPropertyFromRequest(propName) {
  return (e) => {
    const prop = e.parameter[propName]
    if(!prop) return null
    return prop
  }
}

function getTypeOf(e) {
  return getPropertyFromRequest('type')(e)  
}

function getStartDayFromRequest(e) {
  return getPropertyFromRequest('startDay')(e)
}

function getEndDayFromRequest(e) {
  return getPropertyFromRequest('endDay')(e)
}

function getSheetNameFromRequest(e) {
  return getPropertyFromRequest('sheetName')(e)
}

function getSheetIdFromRequest(e) {
  return getPropertyFromRequest('sheetId')(e)
}

function getContentsOf(e) {
  const { postData } = e
  if(!postData) {
    return 
  }
  return JSON.parse(postData.contents)
}


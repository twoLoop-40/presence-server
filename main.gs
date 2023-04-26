function doGet(e) {
  const SS_NAME = 'kongLecture'
  const SHEET_NAME = '2023 1학기'
  const DATE_ROW = 3
  const TOTAL_LECTURE_COUNT = 12
 
  const type = getTypeOf(e)

  if (type === 'lectureName') {
    const lectureNameList = getLectureNameList('사용자코드')
    return lectureNameList 
      ? makeJSONresponse({ok: true, data: lectureNameList})
      : makeJSONresponse({ok: false})
  }
  
  if (type === 'presenceInfoReq'){
    const sheetName = getSheetNameFromRequest(e)
    try{
      const positionsLecture = pipe(
      parallel(
        getStartDayFromRequest,
        getEndDayFromRequest
      ),
      (dateTimesHandler) => dateTimesHandler((dates) => getPositionOfRange(...dates)),
      (getPositionFromSheet) => getPositionFromSheet(sheetName, DATE_ROW),
    )(e)

    const result = pipe(
     getSpreadSheet,
      (spreadsheet) => spreadsheet.getSheetByName(sheetName),
      (sheet) => sheet.getDataRange().getValues(),
      (matrix) => matrix.filter((row) => isUserRow(row)),
      (filteredMatrix) => filteredMatrix.map((row) => {
        const userCode = getUserCode(row)
        const userName = getUserName(row)
        const lectureCount = pipe(
          (positions) => positions.findIndex((position) => row[position] === 'out'),
          (count) => count < 0 ? positionsLecture.length : count
        )(positionsLecture)
        
        return { userCode, userName, lectureCount }
      })
    )(SS_NAME)
      return makeJSONresponse({ok: true, data: result})
    } catch(err) {
      return makeJSONresponse({ok: false, data: err})
    }
    
  }
  
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


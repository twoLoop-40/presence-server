function getSpreadSheet(ssName = 'kongLecture') {
  const ssIds = {'kongLecture': '1ZWQ8cKBdYHu7JUij5dsWxqMf2rE4wGQ5fKOuZ1Uqk20'}
  return SpreadsheetApp.openById(ssIds[ssName])  
}

function getOneRowRange({sheet, row}) {
  const lastColOfContent = sheet.getLastColumn()
  if(lastColOfContent < 1) {
    console.log('no data range: last col num is 0')
    return null
  }
  return sheet.getRange(row, 1, 1, lastColOfContent)
}

function attachSSName(sheetHandler) {
  return (ssName, sheetName, row) => sheetHandler(sheetName, row)(ssName)
}

function attachIdx(...indexNumsInsert) {
  let sortedIdxes = [...indexNumsInsert].sort((a, b) => a - b < 0)
  return (givenIndexNums) => {
    const resultIdxes = []
    givenIndexNums.forEach((idx) => {
      while(sortedIdxes.length > 0 && sortedIdxes[0] <= idx) {
        resultIdxes.push(sortedIdxes[0])
        sortedIdxes = sortedIdxes.slice(1)
      }
      resultIdxes.push(idx)
    })
    return resultIdxes
  }
}

function isInList(elem, list) {
  for (const item of list) {
    if(elem === item) {
      return true
    }
  }
  return false
}

function getLectureNameList (...nonLectureNameList) {
  if(nonLectureNameList.length === 0) {nonLectureNameList.push('사용자코드')}
  
  const lectureList = pipe(
    getSpreadSheet,
    (spreadsheet) => spreadsheet.getSheets()
      .map((sheet) => sheet.getName())
      .filter((name) => !isInList(name, nonLectureNameList)),
    (sheetNames) => {
      console.log(sheetNames)
      return sheetNames.map((sheetName, idx) => transformObject('id', 'lectureName')([idx + 1, sheetName]))
    })()
  console.log(lectureList)
  return lectureList
}


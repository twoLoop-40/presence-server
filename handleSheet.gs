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
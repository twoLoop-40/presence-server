function test() {
  const SS_NAME = 'kongLecture'
  const SHEET_NAME = '2023 1학기'
  const DATE_ROW = 3
  const startDay = '2023-3-6'
  const endDay = '2023-4-25'
  const TOTAL_LECTURE_COUNT = 12
  
  const dates = [startDay, endDay]
  const positionsLecture = pipe(
    parallel(
      (dates) => dates[0],
      (dates) => dates[1]
    ),
    (dateTimesHandler) => dateTimesHandler((dates) => getPositionOfRange(...dates)),
    (getPositionFromSheet) => getPositionFromSheet(SHEET_NAME, DATE_ROW),
  )(dates)
  const result = pipe(
      getSpreadSheet,
      (spreadsheet) => spreadsheet.getSheetByName(SHEET_NAME),
      (sheet) => sheet.getDataRange().getValues(),
      (matrix) => matrix.filter((row) => isUserRow(row)),
      (filteredMatrix) => filteredMatrix.map((row) => {
        const userCode = getUserCode(row)
        const userName = getUserName(row)
        const lectureCount = pipe(
          (positions) => positions.findIndex((position) => row[position] === 'out'),
          (count) => count < 0 ? TOTAL_LECTURE_COUNT : count
        )(positionsLecture)
        
        return { userCode, userName, lectureCount }
      })
    )(SS_NAME)


  const positions = getPositionOfRange(startDay, endDay)(SHEET_NAME, DATE_ROW)
  console.log(positions)
  console.log(result)
  // const arrNum = attachIdx(3, 4, 6)([4, 5, 7])
  // console.log(arrNum)

}

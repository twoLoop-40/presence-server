function pipe (...funs) {
  if(funs.length === 0) {
    return null
  }
  return (arg) => {
    try {
      return funs.reduce((returned, fn) => fn(returned), arg)
    } catch (err) {
      console.error('Error Occured in reduce:', err)
    }
  }    
}

function parallel (...fns) {
  if (fns.length === 0) {
    return null
  }
  return (arg) => {
    try {
      const jobs = fns.map((fn) => fn(arg))
      return (finalWork) => finalWork(jobs)
    } catch (err) {
      console.error('Error Occured in parallel:', err)
    }
  }
}

function transformObject (...keys) {
  const o = {}
  return (values) => {
    pipe(
      (values) => {
        if(values.length !== keys.length) {
          throw new Error('length is different') 
         }
        return values
      },
      (values) => keys.forEach((key, idx) => o[key] = values[idx])
    )(values)
    return o
  }
}

function deepMap(values, index, action) {
  if(!Array.isArray(values)) {
    return action(values, index)
  }
  return values.map((value, index) => deepMap(value, index, action))
}

function getUserCode (row) {
  return row[0]
}

function getUserName (row) {
  return row[1]
}

function isUserRow (row) {
  const fiveDigits = /\d{5}/
  return fiveDigits.test(row[0])
}

function isUserRowTest () {
  const rows = [[12345, '이준호'], [321, '김미진'], ['가방', '이한음']]
  rows.forEach((row) => console.log(isUserRow(row)))
}

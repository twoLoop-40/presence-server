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

function deepMap(values, index, action) {
  if(!Array.isArray(values)) {
    return action(values, index)
  }
  return values.map((value, index) => deepMap(value, index, action))
}

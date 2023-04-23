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

function deepMap(values, index, action) {
  if(!Array.isArray(values)) {
    return action(values, index)
  }
  return values.map((value, index) => deepMap(value, index, action))
}

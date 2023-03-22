export const timestamps = (time) => {
    var d = new Date(time)
    var fd =
      d.toLocaleDateString() +
      ' ' +
      d.toTimeString().substring(0, d.toTimeString().indexOf('GMT'))
    return time?fd:''
  }
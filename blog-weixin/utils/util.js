const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const sortDate = (arr) => {
  let result = [], sortObj = {}, list = [], date = '';
  for (let i = 0; i < arr.length; i++) {
      date = arr[i].createTime.slice(8, 10)
      list = []
      if (sortObj[date]) {
          list = sortObj[date]
          list.push(arr[i])
          sortObj[date] = list
      } else {
          list.push(arr[i])
          sortObj[date] = list
      }
  }
  for (let key in sortObj) {
    let obj = {};
    obj.date = key;
    obj.list = sortObj[key];
    result.push(obj);
  }
  result.sort((item1, item2) => {
    if(item1.date > item2.date) {
      return 1;
    }
  })
  return result
}

module.exports = {
  formatTime: formatTime,
  sortDate: sortDate
}

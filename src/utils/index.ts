import dayjs from "dayjs";


// 格式化时间
export function formatTime(timeStamp: string) {
  return dayjs(+timeStamp).format('YYYY-MM-DD')
}

// 格式化金额
export function formatAmount(amount: string) {
  amount = amount.replace(/00$/,'.00')
  return amount.replace(/\d+/, function (n) { // 整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, $1 => $1 + ',');
  })
}

// 格式化分类
export function formatCategory(id:string,idMap:{[prop:string]:any}){
  return idMap[id]?.name || '未知'
}

// sameMonth
export function isSameMonth(d1:number,d2:number){
  // console.log('选择了',dayjs(d2).get('month'));
  // console.log('当前',dayjs(d1).get('month'));
  return dayjs(d1).isSame(d2,'month')
}
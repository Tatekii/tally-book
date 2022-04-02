import { categories } from './types'
import { parse } from 'papaparse'


// csv转换函数
export async function getLocalCsv(path: string) {
  return await new Promise((resolve, reject) => {
    try {
      parse(path, {
        download: true,
        complete: function (results) {
          resolve(results.data)
        }
      });
    } catch (e) {
      reject(new Error(`csv parse Error for : [${path}]`))
    }
  })
}


// 格式化分类
export function formatCsvCategory(data: Array<any[]>) {
  const res: categories = {}
  const header = data[0]
  const dataLen = data.length
  for (let i = 1; i < dataLen; i++) {
    const row = data[i]
    res[row[0]]! = {
      [header[0]!]: row[0],
      [header[1]!]: row[1],
      [header[2]!]: row[2]
    }
  }
  return res
}
// 格式化账单
export function formatBill(data: Array<any[]>) {
  const res: any[] = []
  const header = data[0]
  const dataLen = data.length
  for (let i = 1; i < dataLen; i++) {
    const row = data[i]
    res.push({
      [header[0]!]: row[0],
      [header[1]!]: row[1],
      [header[2]!]: row[2],
      [header[3]!]: row[3],
    })
  }
  return res
}
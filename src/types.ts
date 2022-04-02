export interface Bill {
  amount: string,
  category: string,
  time: string,
  type: string
}

export interface Cate {
  [x: string]: {
    id: string,
    name: string,
    type: string
  }
}
import { Ref, ref, watch } from 'vue'
import { Bill } from '../types'
import dayjs from 'dayjs'
import {AvailableMonth} from './types'


/** 筛选出所有可用日期 */
export default function useAvailableMonth(data: Ref) {
  const availableMonth = ref<AvailableMonth>({})
  watch(() => data.value, (v: Bill[]) => {
    v.forEach(billItem => {
      const d = dayjs(+billItem.time)
      const y:string = d.get('year')+''
      const m = d.get('month')
      availableMonth.value[y] = availableMonth.value[y] ? [...new Set([m,...(availableMonth.value[y])])] : [m]
    });
    // availableMonth.value = [...new Set(v.map(item => {
    //   return [+dayjs(+item.time).get('year'),+dayjs(item.time).get('month')]
    // }))]
    // availableMonth.value = [...new Set(v.map(item=>+item.time))]
  })
  return availableMonth
}
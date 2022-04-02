import {Bill} from '../../types'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

export interface SummaryMethodProps<T = Bill> {
  columns: TableColumnCtx<T>[]
  data: T[]
}
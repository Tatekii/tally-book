<template>
  <el-table
    :data="tableData"
    style="width: 100%;"
    height="500px"
    stripe
    show-summary
    :summary-method="getSummaries"
    :default-sort="{ prop: 'time', order: 'descending' }"
  >
    <!--  日期 -->
    <el-table-column prop="time" label="日期" sortable>
      <template #default="scope">
        <span>{{ formatTime(scope.row.time) }}</span>
      </template>
    </el-table-column>
    <!-- 金额 -->
    <el-table-column prop="amount" label="金额" sortable>
      <template #default="scope">
        <span>￥{{ formatAmount(scope.row.amount) }}</span>
      </template>
    </el-table-column>

    <!-- 分类 -->
    <el-table-column prop="category" label="分类">
      <template #default="scope">
        <span>{{ formatCategory(scope.row.category, category) }}</span>
      </template>
    </el-table-column>>
    <!-- 类型 -->
    <el-table-column prop="type" label="类型">
      <template #default="scope">
        <el-tag
          :type="scope.row.type === '1' ? 'success' : ''"
          disable-transitions
        >{{ scope.row.type === '1' ? '收入' : '支出' }}</el-tag>
      </template>
    </el-table-column>

    <!-- <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row.time)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row.time)">删除</el-button>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script lang='ts' setup>
import { formatTime, formatAmount, formatCategory } from '../../utils/index'
import { Bill } from '../../types';
import { SummaryMethodProps } from './types'

const props = defineProps<{ tableData: Bill[], category: {} }>()

// 搞不动了放假！
// // 删除条目按钮
// const handleDelete = function (i: any, row: any) {
//   console.log('delete', i, row);

// }
// // 编辑条目按钮
// const handleEdit = function (i: any, row: any) {
//   console.log('edit', i, row)
// }

// 合集收支金额
const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  const values = data.map(item => item)
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[0] = '合计'
      return
    }
    if (index === 1) {
      const total = values.reduce((pre, cur) => {
        if (cur.type === '1') {
          pre += +cur.amount
        }
        return pre
      }, 0)
      sums[index] = `收入：￥${formatAmount(total + '')}`
    } else if (index === 2) {
      const total = values.reduce((pre, cur) => {
        if (cur.type === '0') {
          pre += +cur.amount
        }
        return pre
      }, 0)
      sums[index] = `支出：￥${formatAmount(total + '')}`
    } else {
      sums[index] = ''
    }
  })
  return sums
}


</script>

<style lang="" scoped>

</style>

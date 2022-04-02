<script setup lang="ts">
import { onMounted, ref, watch, reactive } from 'vue';
import { getLocalCsv, formatCsvCategory, formatBill } from './utils/csv'
import { isSameMonth } from './utils'
import { Bill, Cate } from './types'
import BillTable from './components/BillTable/BillTable.vue'
import useAvailableMonth from './hooks/useAvailableMonth'
import { FormInstance } from 'element-plus'

// 分类数据
const category = ref<Cate>({})
// 原始数据
const basicData = ref<Bill[]>([])
// 列表展示数据
const tableData = ref<Bill[]>([])
// 日期选择器
const selectedMonth = ref<Date>()
// 分类选择器
const selectedCategory = ref<string>()
// 筛选条件数组
const commonFilter = ref<Function[]>([
  () => true,
  () => true
])
// 账单条目对话框显示flag
const dialogFormVisible = ref<boolean>(false)
// 条目form
const ruleFormRef = ref<FormInstance>()
// 新的账单条目
const form = reactive<Bill>({
  time: '',
  type: '',
  amount: '',
  category: ''
})
// 保存新条目
const addBill = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!', form)
      // 格式化金额小数点后两个0
      let formatAmount = form.amount
      if (!/\./g.test(form.amount)) {
        formatAmount = form.amount + '00'
      }else{
        formatAmount = form.amount.replace(/\./,'')
      }
      const _obj = {
        amount: formatAmount,
        category: form.category,
        time: form.time + '',
        type: form.type
      }
      console.log(_obj);
      // return 
      basicData.value = [_obj, ...basicData.value]
      // 更新localStorage
      localStorage.setItem('bills', JSON.stringify(basicData.value))
      // 判断是否也符合当前页面的筛选条件
      // 符合的话直接显示
      if (commonFilter.value[0](_obj, selectedMonth.value) && commonFilter.value[1](_obj, selectedCategory.value)) {
        tableData.value.unshift(_obj)
      }

      // 提交后也要reset
      resetForm(ruleFormRef.value)
      dialogFormVisible.value = false
    } else {
      console.log('error submit!', fields)
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

/** 可选月份，月份索引0-11 * */
const availableMonth = useAvailableMonth(basicData)
/** 日期选择器禁用值过滤器 */
const availableMonthFilter = function (d: Date) {
  const pivot = new Date(d)
  const _y = pivot.getFullYear()
  const _m = pivot.getMonth()
  const refData = availableMonth.value
  if (!refData[_y]) return true
  if (!refData[_y].includes(_m)) return true
}


/**  监听日期选择值变化 */
const monthFilter = (item: Bill, v: any) => isSameMonth(+item.time, +v)
watch(() => selectedMonth.value, (v) => {
  if (!v) {
    // 删除筛选条件
    commonFilter.value[0] = () => true
  } else {
    // 将日期添加进筛选条件
    commonFilter.value[0] = monthFilter
  }
  tableData.value = basicData.value.filter(billItem => {
    return commonFilter.value[0](billItem, v) && commonFilter.value[1](billItem, selectedCategory.value)
  })
})
/** 监听分类变化 */
const cateFilter = (item: Bill, v: any) => item.category === v
watch(() => selectedCategory.value, (v) => {
  if (!v) {
    // 删除筛选条件
    commonFilter.value[1] = () => true
  } else {
    // 将分类筛选添加进筛选条件
    commonFilter.value[1] = cateFilter
  }
  tableData.value = basicData.value.filter(billItem => {
    return commonFilter.value[0](billItem, selectedMonth.value) && commonFilter.value[1](billItem, v)
  })
})

/** 表单验证规则 */
const rules = reactive({
  type: [{ required: true }],
  category: [],
  time: [{ required: true }],
  amount: [{
    required: true,
    message: '金额不能为空'
  },
  {
    validator: (rule: any, val: any, cb: any) => {
      const _r = /^-?\d+(,\d{3})*(\.\d{1,2})?$/
      if (!_r.test(val)) {
        cb(new Error('输入非法'))
      } else {
        cb()
      }
    },
    trigger: 'blur'
  }]
})

onMounted(async () => {
  // 检查localStorage内有没有缓存了  
  // 分类
  if (localStorage.getItem('category')) {
    category.value = JSON.parse(localStorage.getItem('category')!)
  } else {
    const originCate: any = await getLocalCsv('/devData/categories.csv');
    category.value = formatCsvCategory(originCate)
    localStorage.setItem('category', JSON.stringify(category.value))
  }
  // 账单
  if (localStorage.getItem('bills')) {
    basicData.value = JSON.parse(localStorage.getItem('bills')!)
  } else {
    const originDetail: any = await getLocalCsv('/devData/bill.csv');
    basicData.value = formatBill(originDetail)
    localStorage.setItem('bills', JSON.stringify(basicData.value))
  }

  // 显示原始数据
  tableData.value = [...basicData.value]
})
</script>

<template>
  <el-container class="border border-8 border-gray-300">
    <el-header
      style="height: 2.25rem;"
      class="m-2 height-3 text-center bg-gray-300 text-3xl"
    >Tally-Book @siyn</el-header>
    <main class="m-2">
      <div class="flex gap-4">
        <!-- 日期选择器 -->
        <el-date-picker
          v-model="selectedMonth"
          type="month"
          placeholder="按月查看"
          :disabled-date="availableMonthFilter"
          clearable
          format="YYYY-MM"
          value-format="x"
        />
        <!-- 分类选择器 -->
        <el-select v-model="selectedCategory" placeholder="按分类" clearable>
          <template v-for="item of category">
            <el-option :label="item.name" :value="item.id"></el-option>
          </template>
        </el-select>
        <el-button type="primary" @click="dialogFormVisible = true">新增账单</el-button>
      </div>

      <!-- 账单表格 -->
      <BillTable :tableData="tableData" :category="category" />

      <!-- 账单对话框 -->
      <div class="custom-dialog">
        <el-dialog
          v-model="dialogFormVisible"
          title="编辑账单"
          width="320px"
          :show-close="false"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
        >
          <el-form :model="form" ref="ruleFormRef" :rules="rules">
            <el-form-item label="账单日期" prop="time">
              <el-date-picker
                v-model="form.time"
                value-format="x"
                type="datetime"
                placeholder="选择账单日期"
              />
            </el-form-item>
            <div class="flex gap-2">
              <el-form-item label="类型" prop="type">
                <el-select v-model="form.type">
                  <el-option label="支出" value="1" />
                  <el-option label="收入" value="0" />
                </el-select>
              </el-form-item>
              <el-form-item label="分类" prop="category">
                <el-select v-model="form.category">
                  <el-option v-for="item in category" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
            </div>

            <el-form-item label="金额" prop="amount">
              <el-input v-model="form.amount">
                <template #prefix>￥</template>
              </el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="{ resetForm(ruleFormRef);dialogFormVisible = false }">取消</el-button>
              <el-button type="success" @click="addBill(ruleFormRef)">保存</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </main>
  </el-container>
</template>

<style lang='scss' scoped>
:global(#app) {
  min-width: 600px;
}
.custom-dialog {
  :deep(div.el-dialog__header) {
    @apply m-0 p-3 bg-gray-300;
  }
  :deep(div.el-dialog__body) {
    @apply p-3;
  }
  :deep(div.el-dialog__footer) {
    @apply p-3;
  }
}
</style>

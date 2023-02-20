<template>
  <div>
    <el-card>
      <el-form ref="ruleFormRef" :inline="true" :model="query">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="query.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            查询
          </el-button>
          <el-button type="primary" @click="resetForm(ruleFormRef)"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-table :data="compData" style="width: 100%" size="small">
      <el-table-column align="center" prop="name" label="姓名" />
      <el-table-column align="center" label="性别">
        <template #default="scope">{{ sex(scope.row.sex) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="age" label="年龄" />
      <el-table-column align="center" prop="number" label="学号" />
      <el-table-column align="center" prop="class" label="班级" />
      <el-table-column align="center" label="状态">
        <template #default="scope">{{ state(scope.row.state) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="address" label="地址" />
      <el-table-column align="center" prop="phone" label="联系方式" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            :icon="Delete"
            @click="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="query.currentPage"
      :page-size="query.pageSize"
      :page-sizes="[5, 10, 15, 20]"
      small
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
import { students, delStudents, searchStudents } from "../../api";

interface TableItem {
  id: number;
  name: string;
  sex: number;
  age: number;
  number: number;
  class: number;
  state: string;
  address: string;
  phone: string;
}

const ruleFormRef = ref<FormInstance>();

const query = reactive({
  name: "",
  currentPage: 1,
  pageSize: 10,
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

const compData = computed(() => {
  return tableData.value.slice(
    (query.currentPage - 1) * query.pageSize,
    query.currentPage * query.pageSize
  );
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(() => {
    searchStudents(query.name).then((res) => {
      query.pageSize = 1;
      tableData.value = res.data.data;
    });
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const getData = () => {
  students().then((res) => {
    const { total, data } = res.data;
    pageTotal.value = total;
    tableData.value = data;
  });
};

getData();

const sex = (sex: number) => {
  return sex == 1 ? "男" : "女";
};

const state = (state: string) => {
  return state === "1" ? "已入学" : state === "2" ? "未入学" : "休学中";
};

const handleDelete = (row: TableItem) => {
  delStudents(row.id).then((res) => {
    if (res.data.status === 200) {
      ElMessage({
        type: "success",
        message: res.data.message,
      });
      getData();
    }
  });
};

const handleSizeChange = (val: number) => {
  query.pageSize = val;
  query.currentPage = 1;
};
const handleCurrentChange = (val: number) => {
  query.currentPage = val;
};
</script>

<style scoped lang="less">
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-pagination,
.el-table {
  margin-top: 20px;
}
</style>

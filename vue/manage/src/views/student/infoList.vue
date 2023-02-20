<template>
  <div>
    <el-card>
      <el-button type="primary" @click="add">新增</el-button>
    </el-card>

    <el-table :data="compData" style="width: 100%" size="small">
      <el-table-column align="center" prop="name" label="姓名" />
      <el-table-column align="center" label="性别">
        <template #default="scope">{{ sex(scope.row.sex) }}</template>
      </el-table-column>
      <el-table-column align="center" prop="age" label="年龄" />
      <el-table-column align="center" prop="father" label="父亲" />
      <el-table-column align="center" prop="mather" label="母亲" />
      <el-table-column align="center" prop="address" label="家庭住址" />
      <el-table-column align="center" prop="time" label="入校时间" />
      <el-table-column align="center" prop="phone" label="联系方式" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            :icon="Edit"
            @click="handleEdit"
          />
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

    <!-- 添加 -->
    <el-dialog v-model="addVisible" title="新增信息列表">
      <el-form :model="addForm" label-width="70px">
        <el-form-item label="姓名">
          <el-input v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="addForm.age" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="addForm.sex">
            <el-option label="男" value="1" />
            <el-option label="女" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="父亲姓名">
          <el-input v-model="addForm.father" />
        </el-form-item>
        <el-form-item label="母亲姓名">
          <el-input v-model="addForm.mather" />
        </el-form-item>
        <el-form-item label="入校时间">
          <el-input v-model="addForm.time" />
        </el-form-item>
        <el-form-item label="家庭住址">
          <el-input v-model="addForm.address" />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="addForm.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addVisible = false">Cancel</el-button>
          <el-button type="primary" @click="Confirm"> Confirm </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import { Delete, Edit } from "@element-plus/icons-vue";
import { info, addInfo } from "../../api";

interface TableItem {
  id: string;
  name: string;
  sex: string;
  age: string;
  father: string;
  mather: string;
  address: string;
  phone: string;
  time: string;
}

const query = reactive({
  currentPage: 1,
  pageSize: 10,
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

const addVisible = ref(false);
const editVisible = ref(true);

const add = () => {
  addVisible.value = true;
};

let txt = "1234567890"; //生成的随机机器码
let len = 13; //机器码有多少位
let pwd = ""; //定义空变量用来接收机器码
for (let i = 0; i < len; i++) {
  pwd += txt.charAt(Math.floor(Math.random() * txt.length)); //循环机器码位数随机填充
}

const addForm = reactive({
  id: pwd,
  name: "",
  age: "",
  sex: "",
  father: "",
  mather: "",
  time: "",
  address: "",
  phone: "",
});

const Confirm = () => {
  addInfo(addForm).then((res) => {
    if (res.data.status === 200) {
      ElMessage({
        type: "success",
        message: res.data.message,
      });
      getData();
      addVisible.value = false;
    }
  });
};

const getData = () => {
  info().then((res) => {
    const { total, data } = res.data;
    pageTotal.value = total;
    tableData.value = data;
  });
};

getData();

const compData = computed(() => {
  return tableData.value.slice(
    (query.currentPage - 1) * query.pageSize,
    query.currentPage * query.pageSize
  );
});

const sex = (sex: string) => {
  return sex === "1" ? "男" : "女";
};

const handleDelete = (row: TableItem) => {
  // delStudents(row.id).then((res) => {
  //   if (res.data.status === 200) {
  //     ElMessage({
  //       type: "success",
  //       message: res.data.message,
  //     });
  //     getData();
  //   }
  // });
  console.log(row);
};

const handleEdit = () => {
  editVisible.value = true;
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

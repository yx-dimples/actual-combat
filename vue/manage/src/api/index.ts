import request from '../utils/request'

export interface IUserData {
  username: string
  password: string
}

export interface InfoDate {
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

// 登录接口
export const login = (data: IUserData) => {
  return request({
    method: 'post',
    url: '/login',
    data
  })
}
// 学生列表
export const students = () => {
  return request({
    method: 'get',
    url: '/students'
  })
}

// 删除学生
export const delStudents = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/students/:${id}`
  })
}

// 查询学生
export const searchStudents = (name: string) => {
  return request({
    method: 'GET',
    url: `/students?name=${name}`
  })
}

// 信息列表
export const info = () => {
  return request({
    method: 'get',
    url: '/info'
  })
}

// 新增信息
export const addInfo = (data: InfoDate) => {
  return request({
    method: 'post',
    url: '/info',
    data
  })
}


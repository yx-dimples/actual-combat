export const remBase = 14

let htmlFontSize: any

// 根据基准字号计算
// 用于静态样式
export function toRem(px: any) {
  return `${px / remBase}rem`
}

// 根据当前的html根字体大小计算
// 用于某些js的动态计算
export function toCurrentRem(px: any) {
  return `${px / htmlFontSize}rem`
}
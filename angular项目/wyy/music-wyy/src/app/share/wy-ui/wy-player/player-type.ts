export interface PlayMode {
  // 三种模式 循环 随机 单曲循环
  type: 'loop' | 'random' | 'singleLoop';
  label: '循环' | '随机' | '单曲循环';
}

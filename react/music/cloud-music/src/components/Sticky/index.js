import React, { Component, createRef } from 'react'
import './index.less'
export default class Sticky extends Component {
  originalRef = createRef()
  placeholderRef = createRef()
  componentDidMount() {
    window.addEventListener('scroll', this.handlescroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handlescroll)
  }
  handlescroll = (e) => {
    // 获取dom对象
    const originalEl = this.originalRef.current
    const placeholderEL = this.placeholderRef.current
    // 获得元素相对浏览器视窗top的距离。
    const { top, height } = originalEl && originalEl.getBoundingClientRect()
    const { top: topTmp } = placeholderEL && placeholderEL.getBoundingClientRect()
    // 判断元素是否到达顶端
    if (top < 0) {
      placeholderEL.style.height = height + 'px'
      originalEl.classList.add('originalFixedClass')
    }
    // 判断占位元素是否返回顶端
    if (top === 0 && topTmp > 0) {
      placeholderEL.style.height = 0
      originalEl.classList.remove('originalFixedClass')
    }
  }
  render() {
    return (
      <div className='sticky'>
        {/* 传过来的组件 */}
        <div className="flex" ref={this.originalRef} >{this.props.children}</div>
        {/* 占位符 */}
        <div ref={this.placeholderRef}></div>
      </div>
    )
  }
}
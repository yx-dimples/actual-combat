import React from 'react'
import './index.less'

export default class Progress extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      offsetWidth: 0,
      status: false, // 是否可拖动
      startX: 0, // 记录最开始点击的X坐标
      left: 0 // 记录当前已经移动的距离
    }
    this.barClick = this.barClick.bind(this)
    this.barDown = this.barDown.bind(this)
  }

  componentDidMount() {
    this.bindEvent()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.status && nextProps.percent !== this.props.percent) {
      this.setState({
        offsetWidth: this.progress.clientWidth * nextProps.percent
      })
    }
  }

  componentWillUnmount() {
    this.unbindEvents()
  }

  // 添加绑定事件
  bindEvent() {
    document.addEventListener('mousemove', this.barMove)
    document.addEventListener('mouseup', this.barUp)

    document.addEventListener('touchmove', this.barMove)
    document.addEventListener('touchend', this.barUp)
  }
  // 移除绑定事件
  unbindEvents() {
    document.removeEventListener('mousemove', this.barMove)
    document.removeEventListener('mouseup', this.barUp)

    document.removeEventListener('touchmove', this.barMove)
    document.removeEventListener('touchend', this.barUp)
  }

  //鼠标/触摸移动事件
  barMove = (e) => {
    if (this.state.status) {
      let endX = e.clientX || e.touches[0].pageX,
        dist = endX - this.state.startX
      let offsetWidth = Math.min(
        this.progress.clientWidth,
        Math.max(0, this.state.left + dist)
      )
      this.setState({ offsetWidth })
    }
  }
  //鼠标/触摸释放事件
  barUp = () => {
    if (this.state.status) {
      this.setState({
        status: false
      })
      if (this.props.dragEnd) {
        this.props.dragEnd(this.state.offsetWidth / this.progress.clientWidth)
      }
    }
  }

  // 点击事件
  barClick(e) {
    let rect = this.progress.getBoundingClientRect()
    let offsetWidth = Math.min(rect.width, Math.max(0, e.clientX - rect.left))
    this.setState({ offsetWidth })
    if (this.props.dragEnd) {
      this.props.dragEnd(offsetWidth / this.progress.clientWidth)
    }
  }

  // 鼠标/触摸开始事件
  barDown(e) {
    this.setState({
      status: true,
      startX: e.clientX || e.touches[0].pageX,
      left: this.progressInner.clientWidth
    })
  }

  render() {
    const { offsetWidth } = this.state
    return (
      <div className='progress' ref={(ref => this.progress = ref)} onClick={this.barClick}>
        <div className='progress-bar' />
        <div className='progress-outer' ref={(ref) => this.percentProgress = ref} />
        <div
          className='progress-inner'
          ref={(ref) => this.progressInner = ref}
          style={{ width: `${offsetWidth}px` }}>
          <div
            className='progress-dot'
            onMouseDown={this.barDown}
            onTouchStart={this.barDown}
          />
        </div>
      </div>
    )
  }
}
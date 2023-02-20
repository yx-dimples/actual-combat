import React, { ReactNode, Component, createRef } from "react";
import './index.scss'

class ProgressBar extends Component<any, any> {
 
  private progress: React.RefObject<any>
  private progressInner: React.RefObject<any>
  private percentProgress: React.RefObject<any>
  
  constructor(props: any) {
    super(props)
    this.state = {
      offsetWidth: 0,
      status: false, // 是否可拖动
      startX: 0, // 记录最开始点击的X坐标
      left: 0 // 记录当前已经移动的距离
    }

    this.progress = createRef<HTMLInputElement>()
    this.progressInner = React.createRef<HTMLInputElement>();
    this.percentProgress = createRef<HTMLInputElement>()
    
    this.barClick = this.barClick.bind(this)
    this.barDown = this.barDown.bind(this)
  }

  componentDidMount () {
   this.bindEvent()
  }

  componentWillReceiveProps (nextProps: any) {
    if (!this.state.status && nextProps.percent !== this.props.percent) {
      this.setState({
        offsetWidth: this.progress.current.clientWidth * nextProps.percent
      })
    }
  }

  componentWillUnmount() {
    this.unbindEvents()
  }

  // 添加绑定事件
  bindEvent = () => {
    document.addEventListener('mousemove', this.barMove)
    document.addEventListener('mouseup', this.barUp)

    document.addEventListener('touchmove', this.barMove)
    document.addEventListener('touchend', this.barUp)
  }
  
  // // 移除绑定事件
  unbindEvents = () => {
    document.removeEventListener('mousemove', this.barMove)
    document.removeEventListener('mouseup', this.barUp)

    document.removeEventListener('touchmove', this.barMove)
    document.removeEventListener('touchend', this.barUp)
  }

  // 鼠标/触摸移动事件
  barMove = (e: any) => {
    if (this.state.status) {
      let endX = e.clientX || e.touches[0].pageX,
        dist = endX - this.state.startX
      let offsetWidth = Math.min(
        this.progress.current.clientWidth,
        Math.max(0, this.state.left + dist)
      )

      this.setState({
        offsetWidth
      })
    }
  }
  
  //鼠标/触摸释放事件
  barUp = () => {
    if (this.state.status) {
      this.setState({
        status: false
      })

      if (this.props.dragEnd) {
        this.props.dragEnd(this.state.offsetWidth / this.progress.current.clientWidth)
      }
    }
  }

  // 点击事件
  barClick = (e: any) => {
    let rect = this.progress.current.getBoundingClientRect()
    let offsetWidth = Math.min(rect.width, Math.max(0, e.clientX - rect.left))
    
    this.setState({
      offsetWidth
    })

    if (this.props.dragEnd) {
      this.props.dragEnd(offsetWidth / this.progress.current.clientWidth)
    }
  }

  // 鼠标/触摸开始事件
  barDown = (e: any) => {
    this.setState({
      status: true,
      startX: e.clientX || e.touches[0].pageX,
      left: this.progressInner.current.clientWidth
    })
  }


  render(): ReactNode {

    const { offsetWidth } = this.state

    return (
      <div
        className="progress"
        ref={this.progress}
        onClick={this.barClick}
      >
        <div className='progress-bar' />
        <div className="progress-outer" ref={this.percentProgress} />
        <div
          className='progress-inner'
          ref={this.progressInner}
          style={{ width: `${offsetWidth}px` }}
        >
          <div
            className="progress-dot"
            onMouseDown={this.barDown}
            onTouchStart={this.barDown}
          />
        </div>
      </div>
      // <div className='progress' onClick={barClick} ref={progress}>
      //   <div className='progress-bar' />
      //   <div className="progress-outer" ref={percentProgress} />
      //   <div
      //     className='progress-inner'
      //     ref={progressInner}
      //     style={{ width: `${offsetWidth}px` }}
      //   >
      //     <div
      //       className="progress-dot"

      //     />
      //   </div>
      // </div>
    );
  }
};

export default ProgressBar;
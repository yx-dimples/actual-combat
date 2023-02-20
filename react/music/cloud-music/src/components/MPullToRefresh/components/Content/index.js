import React from 'react'

class Header extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate
  }
  render() {
    const { render } = this.props
    return (
      <div>{render()}</div>
    )
  }
}

export default Header
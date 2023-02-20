import { Component } from 'react'

export const ifLoginFn = Comp => {
  return class extends Component {
    UNSAFE_componentWillMount() {
      let token = localStorage.getItem('token')
      if (!token) {
        this.props.history.push('/login')
      }
    }
    render() {
      return <Comp />
    }
  }
}
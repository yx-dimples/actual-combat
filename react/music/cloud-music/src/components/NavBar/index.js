import React from 'react'
import { NavBar, Icon } from "antd-mobile-v2";
import './index.less'

class Header extends React.Component {

  render() {
    return (
      <div className='headerComponent'>
        <NavBar
          mode={'light'}
          icon={
            <div style={{ whiteSpace: 'nowrap' }}>
              <Icon style={{ marginLeft: 0 }}
                type={'left'}
                size={'lg'}
                color={'rgba(0,0,0,0.65)'}
              />
            </div>
          }
        >
          {this.props.title}
        </NavBar>
      </div>
    )
  }
}

export default Header
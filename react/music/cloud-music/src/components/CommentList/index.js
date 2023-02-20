import React from 'react'
import {
  Drawer, IconButton
} from '@material-ui/core'
import { ThumbUpAlt, ChevronRight } from '@material-ui/icons'
import './index.less'


function CommentList(props) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [commentDetail, setCommentDetail] = React.useState({})

  const handleDrawerToggle = (item) => {
    setCommentDetail(item)
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <div className='comment-drawer'>
      {
        commentDetail.beReplied &&
        <div className='drawer-header'>回复({commentDetail.beReplied.length})</div>
      }
      {
        commentDetail.user && <div className='user'>
          <img src={commentDetail.user.avatarUrl} alt='' />
          <div className='content-info'>
            <div className='user-detail'>
              <div className="user-info">
                <div className="user-nickname">{commentDetail.user.nickname}</div>
                <div>
                  <span className='timeStr'>{commentDetail.timeStr}</span>
                  <span className='location'>{commentDetail.ipLocation.location}</span>
                </div>
              </div>
              <div className='liked-count'>
                {commentDetail.likedCount}
                <ThumbUpAlt style={{ marginLeft: '10px' }} />
              </div>
            </div>
          </div>
        </div>
      }
      {
        commentDetail.beReplied && <div className='replied'>
          <div className='replied-header'>
            <p>全部回复</p>
          </div>
          <ul>
            {
              commentDetail.beReplied.map((item, index) => (
                <li key={index}>
                  <img src={item.user.avatarUrl} alt='' />
                  <div className='content-info'>
                    <div className='user-detail'>
                      <div className="user-info">
                        <div className="user-nickname">{item.user.nickname}</div>
                        <div>
                          <span className='location'>{item.ipLocation.location}</span>
                        </div>
                      </div>
                      <div className='liked-count'>
                        {item.likedCount}
                        <ThumbUpAlt style={{ marginLeft: '10px' }} />
                      </div>
                    </div>
                    <div className='comment-content'>
                      <p>{item.content}</p>
                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      }
    </div>
  )

  return (
    <div className="comment-list">
      {
        props.comment.length === 0 ?
          <div className='empty'>还没有评论</div>
          :
          <ul>
            {
              props.comment.map((item, index) => (
                <li key={index}>
                  <img src={item.user.avatarUrl} alt='' />
                  <div className='item-right'>
                    <div className='user'>
                      <div className="user-info">
                        <div className="user-nickname">{item.user.nickname}</div>
                        <div>
                          <span className='timeStr'>{item.timeStr}</span>
                          <span className='location'>{item.ipLocation.location}</span>
                        </div>
                      </div>
                      <div className='liked-count'>
                        {item.likedCount}
                        <ThumbUpAlt style={{ marginLeft: '10px' }} />
                      </div>
                    </div>
                    <div className='comment-content'>
                      <p>{item.content}</p>
                      {
                        item.beReplied.length === 0 ?
                          <p></p> :
                          <div className='beReplied'>
                            {item.beReplied.length}条回复
                            <IconButton
                              color="inherit"
                              aria-label="open drawer"
                              onClick={handleDrawerToggle.bind(this, item)}
                              style={{ padding: 0 }}
                            >
                              <ChevronRight />
                            </IconButton>
                            {/* <ChevronRight /> */}
                            <Drawer
                              // container={container}
                              variant="temporary"
                              anchor='bottom'
                              open={mobileOpen}

                              onClose={handleDrawerToggle}
                              ModalProps={{
                                keepMounted: true,
                              }}
                            >
                              {drawer}
                            </Drawer>
                          </div>
                      }

                    </div>
                  </div>
                </li>
              ))
            }
          </ul>
      }
    </div>
  )
}

export default CommentList
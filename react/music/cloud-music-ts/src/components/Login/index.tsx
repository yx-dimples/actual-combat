import React, { useState } from 'react';
import { connect } from 'react-redux'
import { Button, Form, Input, message } from 'antd';
import { 
  getQrKey, getQrCreate, getQrCheck, getUserAccount, getLoginCellPhone, 
  getRegisterCellPhone, getSentCode, checkPhone, checkCaptcha, getUserDetail,
  getUserPlaylist, getUserLikeSong
} from '../../api'
import { updateLogin, saveUserInfo, saveUserPlaylist, saveLikeSongIds } from '../../action';
import './index.scss';

interface IProps {
  hideModal: any
  updateLogin: any
  saveUserInfo: any
  saveUserPlaylist: any
  saveLikeSongIds: any
}

const Login = ({ 
  hideModal, updateLogin, saveUserInfo, saveUserPlaylist, saveLikeSongIds
}: IProps )=> {

  const [form] = Form.useForm();
  const registerForm = React.useRef<any>()

  const [loginWay, setLoginWay] = React.useState(0) // 0: 手机登录 1: 二维码登录 2: 注册
  
  // 电话验证规则
  const phoneReg = /^1[356789]\d{9}$/
  // 密码验证规则
  const passReg = /^[a-zA-Z0-9_-]{8,20}$/
  let [timer] = React.useState<any>('')
  const [qrurl, setQrurl] = React.useState<string>('')
  const [failqr , setFailqr ] = React.useState(false)
  const [scanQr , setScanQr ] = React.useState(false)
  const [time, setTime] = useState(60)
  const [isShowCode, setIsShowCode] = useState<boolean>(false)

  const buttonItemLayout = { wrapperCol: { span: 21, offset: 1 } }

  // 切换登录方式
  const changeLoginWay = (val: number) => {
    setLoginWay(val)
    // 如果是手机号登录就清除二维码登录的定时器
    if (val !== 1) {
      clearInterval(timer)
      if (val === 0) {
        form.resetFields(); // 重置表单
      }
    }
    // 二维码登录
    if (val === 1) {
      qrLogin()
    }
  }

  // 手机号登录
  const phoneLogin = (values: any) => {
    getLoginCellPhone({
      phone: values.phone,
      password: values.password
    }).then(res => {
      if (res.data.code === 200) {
        message.success('登录成功')
        loginSuccess(res);
      } else if (res.data.code === 502) {
        message.warning('密码错误')
      } else {
        message.warning('手机号或密码错误')
      }
    }).catch(() => {
      message.warning('网络太拥挤，请稍候再试！')
    })
    
  }

  // 二维码登录
  const  qrLogin = async () => {
    setFailqr(false) // 用于隐藏二维码失效后的文本提示
    setScanQr(false)
    // 获取二维码key
    const { data: { data: { unikey }} } = await getQrKey()
    // 生成二维码
    const { data: { data: { qrimg } } } = await getQrCreate(unikey)
    setQrurl(qrimg)
    
    // 检查二维码状态
    timer = setInterval(async () => {
      const res = await getQrCheck(unikey)   
      const { code } = res.data
      
      if (code === 800) {
        message.error('二维码失效', 2.5);
        clearInterval(timer)
        setFailqr(true)
      }
      if (code === 802) {
        setScanQr(true)
      }

      if (code === 803) {
        clearInterval(timer)
        message.success('登录成功', 2.5);
        getUserLoginAccount()
      }
    }, 3000)
    console.log(timer);
  }

  // 二维码登录 获取用户登录后的账户信息
  const getUserLoginAccount = () => {
    getUserAccount().then(res => {
      // 获取用户个人信息
      const uid = res.data.account.id
      getUserDetail(uid).then(res => {
        loginSuccess(res)        
      })
    })
  }

  // 点击获取验证码
  const getCaptcha = () => {
    if (form.getFieldValue('phone') === '' || form.getFieldValue('phone') === undefined) {
      message.warning('请先输入手机号', 2.5)
    } else {
      // 检测手机号是否注册
      checkPhone(Number(form.getFieldValue('phone'))).then(res => {
        if (res.data.exist === 1) {
          message.warning('该手机号已注册', 2.5)
        } else if (res.data.exist === -1) {
          if (isShowCode) {
            return false
          }
          setIsShowCode(true)
          const active = setInterval(() => {
            setTime((preSecond) => {
              if (preSecond <= 1) {
                setIsShowCode(false)
                clearInterval(active)
                // 重置秒数
                return 60
              }
              return preSecond - 1
            })
          }, 1000)
          getSentCode(Number(form.getFieldValue('phone'))).then(res => {
            if (res.data.code) {
              message.success('验证码已发送', 2.5)
            } else if (res.data.code === 400) {
              message.warning('发送验证码超过限制:每个手机号一天只能发5条验证码')
            } else if (res.data.code === 405) {
              message.warning('发送验证码间隔过短')
            } else {
              message.warning('手机号不符合规范')
            }
          })
        }
      })
    }
  }

  // 注册
  const register = (values: any) => {
    const { captcha, nickname, password, phone } = values
    // 验证验证码
    checkCaptcha({captcha, phone}).then(res => {
      if (res.data.code === 200) {
        getRegisterCellPhone({ captcha, phone, password, nickname}).then(res => {
          if (res.data.code === 200) {
            message.success('注册成功')
          }
          setTimeout(() => {
            changeLoginWay(0)
          })
        }).catch(() => {
          message.warning('该昵称已被占用')
        })
      } else {
        message.warning('验证码错误')
      }
    })
  };

  // 登录成功后的一些操作
  const loginSuccess = (res: any) => {
    // 关闭登录框
    hideModal()
    clearInterval(timer)
    // 更新登录状态
    updateLogin(true)
    // 保存用户信息
    saveUserInfo(res.data.profile)
    // 获取用户歌单数据
    getUserSonglistBy(res.data.profile.userId)
  }

  // 获取用户歌单和喜欢的音乐数据
  const getUserSonglistBy = (uid: number) => {
    // 歌单
    getUserPlaylist(uid).then(res => {
      saveUserPlaylist(res.data.playlist);
    })
    // 音乐
    getUserLikeSong(uid).then(res => {
      saveLikeSongIds(res.data.ids)
    })
  }
  
  return (
    <div className='login'>
      { loginWay === 0 && <>
          <p className='title'>手机登录</p>
          <Form
              {...{ labelCol: { span: 4 }, wrapperCol: { span: 18 } }}
              layout='horizontal'
              form={form}
              initialValues={{ layout: 'horizontal' }}
              onFinish={phoneLogin}
            >
              <Form.Item
                label="手机号" 
                name="phone" 
                validateFirst={true} // 出错时两个校验分别生效
                rules={[
                  { required: true, message: '手机号码不能为空' },
                  { validator: (rule, value) => {
                    let reg = new RegExp(phoneReg);
                    if(!reg.test(value)) {
                      return Promise.reject('手机号格式不正确');
                    } else {
                      return Promise.resolve();
                    }
                  }},
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Form.Item
                label="密码"
                name="password"
                validateFirst={true} // 出错时两个校验分别生效
                rules={[
                  { required: true, message: '密码不能为空' },
                  { validator: (rule, value) => {
                    let reg = new RegExp(passReg);
                    if(!reg.test(value)) {
                      return Promise.reject('密码格式不正确');
                    } else {
                      return Promise.resolve();
                    }
                  }},
                ]}
              >
                <Input.Password placeholder="请输入密码" />
              </Form.Item>
              <Form.Item {...buttonItemLayout}>
                <Button 
                  type="primary"
                  block
                  htmlType="submit"
                >登录</Button>

                <Button 
                  block
                  onClick={() => changeLoginWay(2)}
                >注册</Button>
              </Form.Item>
          </Form>
          <p className='footer' onClick={() => changeLoginWay(1)}>
            <i className='fa fa-qrcode' />
            扫码登录
          </p>
        </>
      }
      {
        loginWay === 1 && <div className='qr-login'>
          <p className='title'>扫码登录</p>
          {
            qrurl.length !== 0 && 
            <div className='img-wrap'>
              <img src={qrurl} alt='' />
            </div>
          }
          {
            failqr && <p className='failqr'>
              二维码已失效 <span onClick={qrLogin}>点击刷新</span>
            </p>
          }
          {
            !scanQr && <p className='text'>
              使用<span style={{color: '#5091ca'}}>网易云音乐APP</span>
              扫码登录
            </p>
          }
          {
            scanQr && <p className='text'>
              扫描成功，请在手机上确认登录
            </p>
          }
          <p className='footer' onClick={() => changeLoginWay(0)}><i className='fa fa-mobile' />手机号登录</p>
          <p className='footer' onClick={() => changeLoginWay(2)}>还没有账号去注册</p>
        </div>
      }
       { loginWay === 2 && <>
          <p className='title'>注册新用户</p>
          <Form
            {...{ labelCol: { span: 4 }, wrapperCol: { span: 'auto' } }}
            layout='horizontal'
            form={form}
            ref={registerForm}
            initialValues={{ layout: 'horizontal' }}
            onFinish={register}
          >
            <Form.Item
              label="手机号" 
              name="phone" 
              validateFirst={true} // 出错时两个校验分别生效
              rules={[
                { required: true, message: '手机号码不能为空' },
                { validator: (rule, value) => {
                    let reg = new RegExp(phoneReg);
                  if(!reg.test(value)) {
                    return Promise.reject('手机号格式不正确');
                  } else {
                    return Promise.resolve();
                  }
                }}
              ]}
            >
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              validateFirst={true} // 出错时两个校验分别生效
              rules={[
                { required: true, message: '密码不能为空' },
                { validator: (rule, value) => {
                  let reg = new RegExp(passReg);
                  if(!reg.test(value)) {
                    return Promise.reject('密码格式不正确');
                  } else {
                    return Promise.resolve();
                  }
                }}
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
            <Form.Item
              label="确认密码"
              name="password1"
              validateFirst={true} // 出错时两个校验分别生效
              dependencies={['password']}
              required
              rules={[
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('新密码与确认新密码不同！');
                  }
                })
              ]}
            >
              <Input.Password placeholder="请确认密码" />
            </Form.Item>
            <Form.Item
              label="昵称"
              name="nickname"
              validateFirst={true} // 出错时两个校验分别生效
              rules={[{ required: true, message: '昵称不能为空' }]}
            >
              <Input placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item
              label="验证码"
              name="captcha"
              validateFirst={true} // 出错时两个校验分别生效
              rules={[{ required: true, message: '验证码不能为空' }]}
            >
              <Input
                placeholder='请输入验证码'
                maxLength={6}
                minLength={4}
                suffix={
                  <p onClick={() => getCaptcha()}>
                    {isShowCode ? `${time}秒后重新发送` : '发送验证码'}
                  </p>
                }
              />
            </Form.Item>
            <Form.Item {...buttonItemLayout}>
              <Button 
                type="primary"
                block
                htmlType="submit"
              >注册</Button>
              <Button 
                block
                onClick={() => changeLoginWay(0)}
              >返回登录</Button>
            </Form.Item>
          </Form>
        </>
      }
    </div>
  );
};

function mapStateToProps(state: any) {  
  return {
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    updateLogin: (res: boolean) => dispatch(updateLogin(res)),
    saveUserInfo: (res: any) => dispatch(saveUserInfo(res)),
    saveUserPlaylist: (res: any) => dispatch(saveUserPlaylist(res)),
    saveLikeSongIds: (res: any) => dispatch(saveLikeSongIds(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
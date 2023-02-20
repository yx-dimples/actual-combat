import { useState } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, Button } from '@material-ui/core'
import { Toast } from 'antd-mobile'
import logo from '../../assets/images/logo.png'
import { login } from '../../api/user'
import { saveUserInfo } from '../../actions'
import './index.less'

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    margin: '100px auto',
    '& > *': {
      width: '100%',
      display: 'block',
      fontSize: '18px',
    },
    '& .MuiTextField-root': {
      fontSize: '18px',
      '& .MuiInputBase-input': {
        fontSize: '18px'
      },
      '& .MuiFormHelperText-contained': {
        color: '#c10d0c',
        fontSize: '20px'
      }
    },
  },
}))

function Login(props) {

  const classes = useStyles()
  const navigate = useNavigate()

  const [phone, setPhone] = useState('18981139719')
  const [password, setPassword] = useState('982524yx')

  const [phone_error, setPhoneError] = useState(false)
  const [phone_error_text, setPhoneErrorText] = useState(null)

  const [password_error, setPasswordError] = useState(false)
  const [password_error_text, setPasswordErrorText] = useState(null)

  const phoneLoginSave = () => {
    if (!phone) {
      setPhoneError(true)
      setPhoneErrorText('请输入手机号码')
    }
    if (!/^1[3456789]\d{9}$/.test(phone)) {
      setPhoneError(true)
      setPhoneErrorText('请输入正确的手机号')
    }

    if (!password) {
      setPasswordError(true)
      setPasswordErrorText('请输入密码')
    }

    login({
      phone, password
    }).then(res => {
      if (res.data.code === 200) {
        props.saveUserInfo(res.data.profile)
        Toast.show({
          icon: 'success',
          content: '成功'
        })
        setTimeout(() => {
          Toast.show({
            icon: 'loading',
            content: '即将返回登录页'
          })
          setTimeout(() => {
            navigate('/discovery')
          }, 1500)
        }, 2000);
      } else {
        Toast.show({
          icon: 'fail',
          content: '登录失败'
        })
      }
    }).catch(() => {
      Toast.show({
        icon: 'fail',
        content: '登录失败'
      })
    })
  }

  return (
    <div className='login'>
      <div className='img-wrap'>
        <img src={logo} alt='网易云音乐' />
      </div>
      <form className={classes.root}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="phone"
          placeholder="请输入手机号码"
          name="phone"
          autoComplete="phone"
          autoFocus
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          helperText={phone_error_text}
          error={phone_error}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          type="password"
          placeholder="请输入手机号码"
          name="password"
          autoComplete="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText={password_error_text}
          error={password_error}
        />
        <Button
          type="button"
          fullWidth
          variant="contained"
          onClick={phoneLoginSave}
        >直接登录</Button>
      </form>
    </div>
  )
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveUserInfo: res => dispatch(saveUserInfo(res))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
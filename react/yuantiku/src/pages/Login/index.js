import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, Button } from '@material-ui/core'
import Logo from '../../images/logo.png'
import './index.less'

const useStyles = makeStyles(() => ({
  form: {
    width: '90%',
    margin: 'auto',
    '& > *': {
      width: '100%',
      display: 'block',
      fontSize: '.5rem',
    },
    '& .MuiTextField-root': {
      fontSize: '.5rem',
      '& .MuiInputBase-input': {
        fontSize: '.5rem'
      }
    },
    '.MuiButton-containedPrimary': {
      backgroundColor: '#02369d',
      color: '#fff',
      fontWeight: 'normal',
    }
  }
}))

export default function Login() {

  const classes = useStyles()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className='login'>
      <img src={Logo} alt='' />
      <div className='login-text'>login page</div>
      <form className={classes.form}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          placeholder="请输入手机号码"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          placeholder="请输入密码"
          name="password"
          autoComplete="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary">
          直接登录
        </Button>
        <div className='form-footer'>
          <Link to="/register" variant="body2" style={{ color: '#02369d' }}>前往注册</Link>
          <Link to="/home" variant="body2" style={{ color: '#999999' }}>返回首页</Link>
        </div>
      </form>
      <section className='copyright'>
        {'Copyright © '}
        <Link color="inherit" to="http://codesohigh.com">
          你单排吧
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </section>
    </div>
  )
}
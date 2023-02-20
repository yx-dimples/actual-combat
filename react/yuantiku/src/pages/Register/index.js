import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { TextField, Button } from '@material-ui/core'
import { RegisterApi } from '../../api/login'
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

export default function Register() {

  const classes = useStyles()

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const register = () => {
    RegisterApi({
      phone: Number(phone),
      password
    }).then(res => {
      console.log(res)
    })
  }

  return (
    <div className='register'>
      <img src={Logo} alt='' />
      <div className='register-text'>register page</div>
      <form className={classes.form}>
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
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
        <Button variant="contained" color="primary" onClick={register}>
          直接注册
        </Button>
        <div className='form-footer'>
          <Link to="/login" variant="body2" style={{ color: '#02369d' }}>前往登录</Link>
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
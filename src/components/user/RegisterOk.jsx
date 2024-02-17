import React from 'react'
import { CiCircleCheck } from "react-icons/ci";
import { NavLink } from 'react-router-dom';

const RegisterOk = () => {
  return (
    <div className='register-ok-modal'>
        <CiCircleCheck color='#BFE1B0' size={64}/>
        <p className='register-modal-p'>Registration successful</p>
        <NavLink to={"/login"} className="register-modal-login-button">Login</NavLink>
    </div>
  )
}

export default RegisterOk
import React, {useContext, useEffect, useState} from 'react'
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MainContext } from '../App';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase"
import { speFetch } from '../services/Services';


const UserLogin = () => {

  const {accessToken,setAccessToken, setUserRole} = useContext(MainContext)

  const [email, setEmail] = useState(null);
  const [isEmailAvaliable, setIsEmailAvaliable] = useState(null);
  const [password, setPassword] = useState(null);
  const [isPasswordAvaliable, setIsPasswordAvaliable] = useState(null)
  const [showButton, setShowButton] = useState(null);
  const [userError, setUserError] = useState("");



  const navigate = useNavigate();
  const auth = getAuth(app);



  useEffect(()=> {
    if(accessToken){navigate("/")}
  }, [])



  useEffect(()=> {
    if(email != null){
      setIsEmailAvaliable(true);
    } else {
      setIsEmailAvaliable(false);
    }
  },[email])

  useEffect(()=> {
    if(password != null) {
      setIsPasswordAvaliable(true);
    } else {
      setIsPasswordAvaliable(false);
    }
  }, [password])

  useEffect(()=> {
    setShowButton(isPasswordAvaliable && isEmailAvaliable)
  }, [isPasswordAvaliable, isEmailAvaliable])

  const login = async (e) => {
    e.preventDefault();
    console.log("Login");
  
    try {
      // Firebase ve kendi sunucunuz üzerinden paralel olarak giriş yapma
      const [firebaseResult, serverResult] = await Promise.all([
        signInWithEmailAndPassword(auth, email, password),
        speFetch("/api/user-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, password: password })
        })
      ]);
  
      // Firebase girişi
      const user = firebaseResult.user;
      console.log(user);
  
      // Sunucu girişi
      if (serverResult.ok) {
        const data = await serverResult.json();
        const {token, refreshToken} = data;
        console.log("Login Success!");
        console.log(data.token);
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);
        setAccessToken(token);
        setUserRole(0);
        navigate("/");
      } else {
        console.log("Sunucu tarafında giriş başarısız.");
      }
    } catch (error) {
      console.log("Giriş işleminde hata:", error);
      handleError(error.message)
      // Burada daha spesifik hata işleme yapabilirsiniz
    }
  };

  const handleError = (errorMessage)=> {
    switch (errorMessage) {
      case "Firebase: Error (auth/invalid-credential).":
        setUserError("Email Address or Password Wrong")
        break;
      case "Firebase: Error (auth/invalid-email).":
        setUserError("Invalid Email Address")  
        break;
      default:
        setUserError(errorMessage)
        break;
    }
  }
  



  return (
    <div className='login-container'>
    
      <form onSubmit={login}>
        <IoShieldCheckmarkOutline size={100} color='#bfe9a9' style={{alignSelf:"center"}}/>
        <input placeholder='email' onChange={(e)=> setEmail(e.target.value)}/>
        <input placeholder='password' type='password' onChange={(e)=> setPassword(e.target.value)}/>
        {showButton ? <button className='login-button'>Login</button> : <p className='login-disabled-button'>Login</p>}
        {userError && <p style={{color:"red"}}>{userError}</p>}
        
      </form>
     
      <div style={{marginTop:"30px"}}>
      <p className='text light-gray mt-10 mb-5'>Do not have an accout?<span><NavLink to={"/register"} className="text yellow ml-5">Register</NavLink></span></p>
      <p className='text light-gray mt-10 mb-5'>Forgot password?<span><NavLink to={"/user-password-reset"} className="text yellow ml-5">Password Reset</NavLink></span></p>
     
      </div>
   
    </div>
  )
}

export default UserLogin
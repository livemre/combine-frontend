import React, { useEffect, useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import { speFetch } from '../../services/Services';


const Register = () => {

    const [publisherName, setPublisherName] = useState("")
    const [emailAddress, setEmailAddress] = useState("")
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState();
    const [passwordMessage, setPasswordMessage] = useState("");
    const [publisherMessage, setPublisherMessage] = useState("");
    const [emailAddressMessage, setEmailAddressMessage] = useState("");
    
    const [publisherOk,setPublisherOk] = useState(false);
    const [emailOk,setEmailOk] = useState(false);
    const [passwordOk,setPasswordOk] = useState(false);

    const [secure, setSecure] = useState("");
    const navigate = useNavigate();

    useEffect(()=> {
        if(publisherName.length > 3) {
            checkPublisherName();
        } else {
            setPublisherMessage("")
        }
    },[publisherName])


    useEffect(() => {
        // E-posta adresi için basit bir regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (emailRegex.test(emailAddress)) {
            // E-posta adresi geçerliyse
            checkEmailAddress();
        } else {
            // Geçersiz veya boşsa
            setEmailAddressMessage("");
        }
    }, [emailAddress]);

    async function checkEmailAddress () {
        try {
            const response = await speFetch("/api/email-check", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body : JSON.stringify({email : emailAddress})
            })

            const data = await response.json();

            console.log(data);

            if(data.emailExist) {
                setEmailAddressMessage("Bu email zaten var!")
                console.log("Kullanıcı var");
                setEmailOk(false);
              
            } else {
                setEmailAddressMessage("Uygun!")
                console.log("Kullanıcı yooook");
                setEmailOk(true);
            }
          
        } catch (error) {
            
        }
    }

    async function checkPublisherName () {
        try {
            const response = await speFetch("/api/publisher-check", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body : JSON.stringify({publisher_name : publisherName})
            })

            const data = await response.json();

            console.log(data);

            if(data.userExist) {
                setPublisherMessage("Bu kullanıcı adı alınamaz!")
                console.log("Kullanıcı var");
                setPublisherOk(false);
            } else {
                setPublisherMessage("Uygun!")
                setPublisherOk(true);
                console.log("Kullanıcı yooook");
            }
          
        } catch (error) {
            
        }
    }

 

    useEffect(()=> {
       if(password.length > 5) {
        if(password !== repeatPassword) {
            console.log("Şifreler eşleşmiyor!");
            setPasswordMessage("!Password did not match!")
            setPasswordOk(false);
        } else {
            console.log("Şifreler aynı!");
            setPasswordMessage("Password Avaliable and Match")
            setPasswordOk(true);
            
        }
       } else {
        setPasswordMessage("!Password must be more than 6")
       }
    },[password,repeatPassword])

    async function register () {
        console.log("Register");
       try {
        const response = await speFetch("/api/publisher", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body : JSON.stringify({
                    publisher_name : publisherName,
                    email: emailAddress,
                    password: password,
                    avatar_image: "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    profile_image:"https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2010&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    secure:secure

                })
            })

            if(response) {
                console.log("Kayıt Oldu!");
                navigate('/admin/login');

            }
       } catch (error) {
        
       }
    }

  return (
    <div className='register-publisher'>
        <div className='register-form'>
        <h1>Publisher Register</h1>
        <label>Publisher Name</label>
        <input className='register-input' placeholder='publisher name' type='email' onChange={(e)=> setPublisherName(e.target.value) } />
        <p className='publisher-message'>{publisherMessage}</p>
        <label>Email Address</label>
        <input className='register-input' placeholder='email' onChange={(e)=> setEmailAddress(e.target.value) }  />
        <p className='publisher-message'>{emailAddressMessage}</p>
        <label>Password</label>
        <input className='register-input' placeholder='password' type='password' onChange={(e)=>setPassword(e.target.value)}/>
        <label>Password Repeat</label>
        <input className='register-input' placeholder='repeat password' type='password' onChange={(e)=>setRepeatPassword(e.target.value)} />
        <p className='publisher-message'>{passwordMessage}</p>
        <label>Secure</label>
        <input className='register-input' placeholder='secure' type='text' onChange={(e)=>setSecure(e.target.value)} />
        {publisherOk && passwordOk && emailOk ? <button onClick={register} className='register-button'>Register</button> : <button className='register-button-disabled'>Register</button>}
        <div className='login-register-div'>
        <p>Already have an account?</p><NavLink to={"/admin/login"} className="login-register-link"> Login</NavLink>
        </div>
        </div>
    </div>
  )
}

export default Register
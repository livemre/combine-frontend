import React, {useState, useEffect, useContext} from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { MainContext } from '../../App';
import { customPubFetch } from '../../services/PublisherServices';
import { speFetch } from '../../services/Services';

const Login = () => {

    const { setAccessToken, setUserRole} = useContext(MainContext)

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState();


 


    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('pat');
        if (token) {
            // Token varsa ve geçerli varsayılarak Dashboard'a yönlendir
            navigate('/admin/combines');
        }
    }, [navigate]);


    async function login(e) {
        // Login İşlemi Burada
        e.preventDefault();

        try {
            const response = await speFetch("/api/publisher-login", {
                method : "POST",
                headers: {"Content-Type" : "application/json"},
                body : JSON.stringify({
                    email:email,
                    password:password
                })
            })

            const data = await response.json();

            if(data.login) {
                console.log("Login Başarılı!");
                console.log(data.accessToken);
                localStorage.setItem("pat", data.publisherToken);
                localStorage.setItem("prt", data.publisherRefreshToken);
                localStorage.setItem("email", email)
                setAccessToken(data.publisherToken)
                setUserRole("publisher")
                console.log("Yönlendirilecek");
          
                navigate('/admin/combines');
            } else {
                console.log("Login Hatası!");
                setMessage("ERROR - Check your mail address and password!")
                
             
            }

           
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div className='login-container'>
        <div className='login-form'>
        <h1>Login</h1>
        <form onSubmit={(e)=> login(e)}>
        <label>Email Address</label>
        <input className='register-input' placeholder='email address' type='email' onChange={(e)=> setEmail(e.target.value)} />
        <label>Password</label>
        <input className='register-input' placeholder='password' type='password' onChange={(e)=> setPassword(e.target.value)} />
        <p className='text text-08' style={{color:"red"}}>{message}</p>
        <button type='submit'>Login</button>
        </form>
        <div className='login-register-div'>
        <p>Does not have any account?</p><NavLink to={"/admin/register"} className="login-register-link"> Register</NavLink>
        </div>
        </div>
    </div>
  )
}

export default Login
import React, {useEffect, useState} from 'react'
import { IoFootball } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import RegisterOk from '../components/user/RegisterOk';
import { newAccount } from "../tron/tronServices";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebase"
import { speFetch } from '../services/Services';

const UserRegister = () => {

  const [username,setUsername] = useState(null);
  const [email,setEmail] = useState(null);
  const [password,setPassword] = useState(null);
  const [passwordRepeat, setPasswordRepeat] = useState(null);
  const [showButton, setShowButton] = useState(false);

  const [isUsernameAvaliable, setIsUsernameAvaliable] = useState(false)
  const [isEmailAvaliable, setIsEmailAvaliable] = useState(false);
  const [isPasswordAvaliable, setIsPasswordAvaliable] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const [address, setAddress] = useState([])
  const [errorMessage, setErrorMessage] = useState("");


  const auth = getAuth(app);


  useEffect(()=> {
    createAddress();
  }, [])



  useEffect(()=> {
    if(username != null) {
      console.log("Username null değil");
     if(username.length > 3) {
      console.log("Username 3 den büyük");
      checkUsername();
     } else {
      console.log("Username 3 den küçük");
      setIsUsernameAvaliable(false)
     }
    } else {
      console.log("Username null");
      setIsUsernameAvaliable(false)
    }
  }, [username])

  useEffect(()=> {
    if(email !=null) {
      console.log("Email null değil");
      if(validateEmail(email)){
        console.log("Email Validate");
        checkEmail();
      } else {
        console.log("Email Uygun Değil!");
      }
    } else {
      console.log("Email null");
    }
  }, [email])

  useEffect(()=> {
    if(password != null) {
      console.log("Password null değil");
      if(password.length > 5) {
        console.log("Password 5 den büyük");
        if(password == passwordRepeat){
          console.log("Şifreler eşleşiyor");
          setPasswordMessage("Password Avaliable")
          setIsPasswordAvaliable(true)
        } else {
          console.log("Şifreler eşleşmiyor");
          setPasswordMessage("Password does not match")
          setIsPasswordAvaliable(false)
        }
      }else {
        console.log("Password 5 den büyük değil!");
        setPasswordMessage("Password must be more than 5 character")
          setIsPasswordAvaliable(false)
      }
    }else {
      console.log("Password null");
    }
  }, [password, passwordRepeat])

  useEffect(()=> {
    setShowButton(isEmailAvaliable && isPasswordAvaliable && isUsernameAvaliable)
  }, [isEmailAvaliable, isUsernameAvaliable, isPasswordAvaliable])

  // const register =  async (e) =>{
  //   e.preventDefault();
  //   try {

    

     

  //     if(address !== null) {
  //       const registerResponse = await speFetch("/api/user", {
  //         method:"POST",
  //         headers: {"Content-Type" : "application/json"},
  //         body: JSON.stringify({
  //           username : username,
  //           email:email,
  //         })
  //       })


  //       if(registerResponse.ok) {
  //         console.log("Register Successfully");

  //         _registerWithEmailAndPassword(auth, email, password);
  
  //         const userData = await registerResponse.json();
  //         const userID = userData.id;

  //         // Create Address
  //         const createAddressResponse = await speFetch("/api/user-key", {
  //           method:"POST",
  //           headers: {"Content-Type" : "application/json"},
  //           body:JSON.stringify({
  //             "user_id":userID,
  //             "address_base58": address.address.base58,
  //             "address_hex" : address.address.hex,
  //             "public_key" :address.publicKey,
  //             "private_key":address.privateKey
  
  //           })
  //         })
  //         if (createAddressResponse.ok) {
  //           console.log("Address created successfully");
  //           setIsRegister(true);
  //         } else {
  //           console.error("Failed to create address");
  //         }
  //       }

  //     } else {
  //       console.log("address empty");
  //     }

    

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const register = async (e) => {
    e.preventDefault();
    if (address !== null) {
      try {
        // Önce Firebase ile e-posta ve şifre kullanarak kayıt işlemi
      
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Signed up
        const user = userCredential.user;

        // Firebase kayıt işleminin sonucunu kontrol et
        if (!user) {
          setErrorMessage("Registration failed")
          throw new Error('Firebase registration failed');
         
        }
  
        console.log("Registered successfully with Firebase");
  
        // Firebase kaydı başarılı olduktan sonra, API ile kullanıcı kaydını yap
        const registerResponse = await speFetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            email: email,
          }),
        });
  
        // API kaydı sonucunu kontrol et
        if (!registerResponse.ok) {
          setErrorMessage("Registration failed")
          throw new Error('API registration failed');
        }
  
        const userData = await registerResponse.json();
        const userID = userData.id;
        console.log("Registered successfully with API");
  
        // Kullanıcı kaydı başarılı olduktan sonra adres oluşturma işlemi
        const createAddressResponse = await speFetch("/api/user-key", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            "user_id": userID,
            "address_base58": address.address.base58,
            "address_hex": address.address.hex,
            "public_key": address.publicKey,
            "private_key": address.privateKey,
          }),
        });
  
        // Adres oluşturma işleminin sonucunu kontrol et
        if (!createAddressResponse.ok) {
          setErrorMessage("Registration failed")
          throw new Error('Address creation failed');
        }
  
        console.log("Address created successfully");
        setIsRegister(true); // Tüm işlemler başarılı
  
      } catch (error) {
        console.error("Registration failed:", error);
        setErrorMessage("Registration failed")
        // Firebase kaydı başarılı olduysa ama diğer adımlarda hata oluştuysa, Firebase kullanıcısını sil
       
        // Burada kullanıcıya hata mesajı gösterebilir ve gerektiğinde ek temizleme işlemleri yapabilirsiniz
      }
    } else {
      console.log("Address is empty");
    }
  };
  

  const checkUsername = async ()=> {
    try {
      const response = await speFetch("/api/user/username-check" , {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          username : username
        })
      })

      if(response) {
        const data = await response.json();
        setIsUsernameAvaliable(!data.userExist)
      
      }

    } catch (error) {
      
    }
  }

  function validateEmail(email) {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  const checkEmail = async ()=> {
    try {
      const response = await speFetch(`/api/user/email-check`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({email:email})
      })
      if(response) {
        const data = await response.json();
        console.log(!data.userExist);
        setIsEmailAvaliable(!data.userExist)
      }

    } catch (error) {
      
    }
  }

  const createAddress = async () => {
    const data = await newAccount();
    setAddress(data);
  }


  
  
return (

  <div className='register-container'>
 
   
    {isRegister ? <RegisterOk /> : <form onSubmit={register}>
      
      <IoFootball className='register-icon' size={100} color="grey" />
        <input placeholder='username' value={username} onChange={(e)=> setUsername(e.target.value)} />
        {username != null ? username.length > 3 ? isUsernameAvaliable ? <p className='text pastel-green jc-r'>Avaliable</p> : <p className='text pastel-red jc-r'>Username already exist</p>:<p className='text pastel-red jc-r'>Username must be min 4 character</p>:""}
        <input placeholder='email' value={email} onChange={(e)=> setEmail(e.target.value)} />
        {validateEmail(email) ? isEmailAvaliable ? <p className='text pastel-green jc-r'>Avaliable</p> : <p className='text pastel-red jc-r'>Email already exist</p> : " " }
        <input type='password' placeholder='password' value={password} onChange={(e)=> setPassword(e.target.value)} />
        <input type='password' placeholder='password' value={passwordRepeat} onChange={(e)=> setPasswordRepeat(e.target.value)} />
        {isPasswordAvaliable ?  <p className='text pastel-green jc-r'>{passwordMessage}</p> :  <p className='text pastel-red jc-r'>{passwordMessage}</p>}
        {showButton ?  <button className='register-button' type='submit'>Register</button> : ""}
        {errorMessage && <p style={{color:"red", margin:"10px"}}>{errorMessage}</p>}
        <p className='text light-gray mt-20 mb-5'>Already have an acount?<span><NavLink to={"/login"} className="text yellow ml-5">Login</NavLink></span></p>
      </form>}
    </div>

)
  
}

export default UserRegister
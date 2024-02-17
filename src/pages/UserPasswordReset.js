import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from 'react';
import app from "../firebase";

const UserPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);

    sendPasswordResetEmail(auth, email)
      .then(() => {
  
        setMessage("Password reset email sent")
        // Burada kullanıcıya bilgi vermek için UI güncellemesi yapabilirsiniz
      })
      .catch((error) => {
        console.error("Şifre sıfırlama hatası:", error);
        setMessage(error.message)
        // Burada hata mesajını kullanıcıya göstermek için UI güncellemesi yapabilirsiniz
      });
  };

  return (
   <div className="password-reset-container">
     <div className="password-reset">
      <form onSubmit={handleSubmit}>
      <div className="password-reset-items">
        <h3>Password Reset</h3>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="E-Mail Address" 
        style={{marginBottom:"10px"}}
      />
      <button type="submit">Send Link</button>
      {message &&  <div style={{backgroundColor:"#ddd", padding:"20px", marginTop:"20px"}}>
      <p>{message}</p>
      </div>}
     
      </div>
    </form>
    </div>
   </div>
  );
};

export default UserPasswordReset;

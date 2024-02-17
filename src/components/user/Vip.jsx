import React, {useEffect, useState} from "react";
import { MdLockOutline } from "react-icons/md";
import { IoIosArrowRoundForward } from "react-icons/io";
import { LuCheckSquare } from "react-icons/lu";

const Vip = ({count, odds, setShowModal, credit, repay, fpurchase}) => {







  return (
    <div className="u-vip-container">
      <div className="u-lock-text">
        <MdLockOutline size={64} color="black" />
        <p> VIP COMBINE {credit} TRX</p>
        <button onClick={()=> setShowModal(true)} className="u-prch-btn">PURCHASE</button>
      </div>
   


    <div style={{marginTop:"20px" , display:"flex", flexDirection:"column", alignItems:"start", justifyContent:"space-between"}}>
    <div className="u-vip-features-item">
    <div>
    <LuCheckSquare size={17} color="green" />
    </div>
    <p style={{textDecoration:"underline"}}>This combine offers a <strong>{repay}%</strong> repay value in case of loss.</p>
    </div>
    <div className="u-vip-features-item">
    <div>
    <LuCheckSquare size={17} color="green" />
    </div>
    <p style={{textDecoration:"underline"}}><strong>{count}</strong> matches <strong>{odds}</strong> odds!</p>
    </div>
    <div className="u-vip-features-item">
    <div>
    <LuCheckSquare size={17} color="green" />
    </div>
    <p style={{textDecoration:"underline"}}><strong>{fpurchase}</strong> users purchased!</p>
    </div>
    </div>
    

    
  
     
    </div>
  );
};

export default Vip;

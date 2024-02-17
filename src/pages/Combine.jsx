import React, { useState, useEffect, useContext } from "react";
import SingleMatch from "../components/user/SingleMatch";
import Publisher from "../components/user/Publisher";
import Warning from "../components/user/Warning";
import CombineFeatures from "../components/user/CombineFeatures";
import Like from "../components/user/Like";
import Vip from "../components/user/Vip";
import { MdPriceCheck } from "react-icons/md";
import { MainContext } from "../App";
import { MdFavoriteBorder } from "react-icons/md";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { customFetch } from "../services/Services";
import { IoClose } from "react-icons/io5";



const Combine = ({ data, publisher_page, getCombines }) => {
  const { userID, setCredit, setShowDepositModal } = useContext(MainContext);
  const { id, credit, publisher_id, status, repay, flike, fpurchase } = data;
  const [showModal, setShowModal] = useState(false);
  const [isFirstPurchase, setIsFirstPurchase] = useState();
  const [message, setMessage] = useState({error:false, msg:""});
  




  const purchase = async () => {
   
    try {

  



      const response = await customFetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          combine_id: id,
        }),
      });
      if (response.ok) {
        const _credit = await response.json();
        setCredit(_credit.credit)
       
      
        getCombines();
        setShowModal(false);
        setIsFirstPurchase(true);
        
 

      } else {
    
        const credit = await response.json();
        setMessage({error:credit.error})
      }
    } catch (error) {
      console.log(error);
    }
  };

 

  return (
   
 <div  className={`u-combine-container ${isFirstPurchase ? 'first' : ''}`} style={{backgroundColor: isFirstPurchase ? "#f3ffec" : "#f4f4f4"}}>
         
     <div  className={`u-modal-confirm-purchase ${!showModal ? 'closed' : "" }`}>
     <IoClose size={24} className="close-button-modal" onClick={() => {
                    setMessage({error:false})
                    setShowModal(false)

                  }}/>
              {message && message.error ? <>
                <MdPriceCheck size={100} color="red" />
              <p style={{fontSize:"18px", margin:"20px 5px"}}>{message.error}</p>
              <div className="modal-btns-sure-cncl">
               
                <button className="md-deposit-btn" onClick={()=> {
                  setMessage({error:false})
                  setShowModal(false);
                  setShowDepositModal(true)
                }}>
                  DEPOSIT
                </button>
              </div>
              </> : <>
              <MdPriceCheck size={100} color="gray" />
              <p style={{fontSize:"18px", margin:"20px 5px"}}>Are you sure to purchase?</p>
              <div className="modal-btns-sure-cncl">
               
                <button className="md-sure-btn" onClick={purchase}>
                  SURE!
                </button>
              </div>
              </>}

            
           
              
            </div>
              
          <Publisher
            key={publisher_id}
            data={data.publisher}
            createdDate={data.date}
            publisher_page={publisher_page}
            status={data.status}
          />
          {!isFirstPurchase && !data.isPurchased && data.status == 0 ? (
          // VIP komponenti sadece isFirstPurchase değilken ve satın alınmamışsa göster
          <Vip
         
            count={data.totalMatches}
            odds={data.totalOdds}
            credit={credit}
            setShowModal={setShowModal}
            repay={repay}
            fpurchase={fpurchase}
          /> 
        ) : (
            data &&
            data.matches.map((item, index) => (
              <SingleMatch key={index} data={item} status={status} date={item.date}/> 
            ))
          )}
          
          {data &&
            data.warnings.map((item, index) => (
              <Warning key={index} title={item.title} _icon={"info"} />
            ))}
       
       {data && credit > 0 && status != 0 ?   <div className='u-warning-container'>
        <div className='u-info-icon'>
          <RiMoneyDollarBoxFill size={18} color='green' /> 
        
        </div>
        <p className='u-war-text'>This combine is a VIP selection and was valued at {credit} credits.</p>
    </div> : ""} 
          {data && <Like combineID={data.id} getCombines={getCombines} credit={credit} isPurchased={data.isPurchased} flike={flike} />}
        
         
        </div>
 
  );
};

export default Combine;

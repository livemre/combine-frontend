import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../App";
import Combine from "../../pages/Combine";
import Loading from "./publisherTabs/Loading";
import { customFetch, getCurrentDateFormatted, sendUserLocalTime, speFetch } from "../../services/Services";

const PurchasedCombines = () => {
  const { userID, token } = useContext(MainContext);
  const [combines, setCombines] = useState([]);
  const [date, setDate] = useState(getCurrentDateFormatted());
  const [isLoading, setIsLoading] = useState(true);


  useEffect(()=> {getCombines()}, [date])



  useEffect(() => {
    if (userID) {
      getCombines();
    }
  }, [userID]);



  
  const timeTest = async ()=> {
    const postData = sendUserLocalTime(date);

try {
    // Sunucuya POST isteği gönder
    const response = await speFetch('/api/date-test', {
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(postData)
    });
    if(response.ok) {
      const data = await response.json();
      console.log(data);
    } 
   // console.log('Sunucudan gelen UTC tarihi:', response.data.utcDateTime);
} catch (error) {
    console.error('İstek sırasında hata oluştu:', error);
}
  }



  const getCombines = async () => {
    setIsLoading(true);
    console.log("Get Combines");
    console.log(userID);
    const postData = sendUserLocalTime(date);
    try {
      const response = await customFetch(
        `/api/purchased/combines/user/${userID}`,
        {
          method: "POST",
          body:JSON.stringify(postData),
          headers: {"Content-Type":"application/json"},
         
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
       
        setCombines(data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      // Hata yönetimi ekle
    }
  };



  return (
    <div className="purchased-combines">
      
      <div className="fav-com-date">
        <h4>Purchased Combines</h4>
        <input
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
       
          }}
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : combines.length > 0 ? (
        combines.map((item) => (
          <Combine
            data={item}
            publisher_page={0}
            key={item.id}
            getCombines={getCombines}
          />
        ))
      ) : (
        <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
          <p>There is no combine</p>
        </div>
      )}
    </div>
  );
};

export default PurchasedCombines;

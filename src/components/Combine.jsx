import React, { useEffect, useState } from "react";
import SinglePrediction from "./SinglePrediction";
import Matches from "./Matches";
import { TiDelete } from "react-icons/ti";
import CombineHeader from "./CombineHeader";
import CombineAction from "./CombineAction";
import StatusCombine from "./StatusCombine";
import WarningsCombine from "./WarningsCombine";
import { customPubFetch } from "../services/PublisherServices";
import { customFetch } from "../services/Services";
import { IoCheckmarkCircle } from "react-icons/io5";


const Combine = ({ id, getCombines,publisher_id, filterCombines }) => {
  const [combine, setCombine] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [warnings, setWarnings] = useState([]);
  const [statusEdit, setStatusEdit] = useState(false);
  const [purchaseCount, setPurchaseCount] = useState()
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState();
  const [likeLoading, setLikeLoading] = useState(true)
  const [count, setCount] = useState();

  useEffect(() => {
    getCombine();
    countLike();
  }, [id]);

  useEffect(() => {
    if (combine !== undefined) {
      console.log(combine.id);
      getWarnings(combine.id);
      getPurchaseCount();
     
    }
  }, [combine, id]);

  const getCombine = async () => {
  
    try {
      const response = await customPubFetch(`/api/combine/${id}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setCombine(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Get combine hata oluştu");
      setIsLoading(false);
    }
  };

  const publish = async () => {
    // Verilen ID deki kombineyi publish yap.
    // is_published değeri true olcak.

    try {
      const request = await customPubFetch(`/api/combine/${id}`, {
        method: "PATCH",
        headers: {
          "publisher-id": publisher_id
        }
      });

      if (request.ok) {
        console.log("İşlem başarılı");
        getCombines();
      } else {
        console.log("Hata oluştu");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const delete_combine = async () => {
    // Verilen ID deki kombineyi publish yap.
    // is_published değeri true olcak.

    console.log(publisher_id);
    try {
      const request = await customPubFetch(`/api/combine/${id}`, {
        method: "DELETE",
        headers: {
          "Publisher-ID": publisher_id
        }
      });

      if (request.ok) {
        console.log("İşlem başarılı silindi!");
        getCombines();
      } else {
        const data = await request.json();
        console.log("Hata oluştu");
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function changeStatus(combine_id, _changed_status) {
    // Verilen ID deki kombinenin statusunu değiştirir

    try {
      const request = await customPubFetch(
        `/api/combine/${combine_id}/status/${_changed_status}`,
        {
          method: "PATCH",
        }
      );

      if (request.ok) {
        console.log("İşlem başarılı change!");
        getCombines();
      } else {
        console.log("Hata oluştu");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const addWarning = async (id, title) => {
    try {
      const request = await customPubFetch("/api/warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          combine_id: id,
        }),
      });

      if (request.ok) {
        console.log("Warning eklendi frontend");
        getWarnings(combine.id);
      } else {
        console.log("Warning eklenmedi hata oluştu frontend");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getWarnings = async (combine_id) => {
    try {
      const request = await customPubFetch(
        `/api/warning/${combine_id}`,
        {
          method: "GET",
        }
      );
      if (request) {
        const data = await request.json();
        setWarnings(data);
        console.log(warnings);
      }
    } catch (error) {}
  };

  const deleteWarning = async (warning_id) => {
    try {
      const request = await customPubFetch(
        `/api/warning/${warning_id}`,
        {
          method: "DELETE",
        }
      );

      if (request) {
        console.log("Warning delete");
        const filtered = warnings.filter((item) => item.id !== warning_id);
        setWarnings(filtered);
      } else {
        console.log("Warning does not delete");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPurchaseCount = async ()=> {
    try {
      const response = await customPubFetch(`/api/combine/purchase/count/${combine.id}` , {
        method:"GET"
      })
      if(response.ok) {
        const data = await response.json();
        setPurchaseCount(data.count);

      }
    } catch (error) {
      
    }
  }

 const repay = async ()=> {
  try {
    console.log("Repay");
    const response = await customPubFetch("/api/repay-progress", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({

        combine_id : id,
      })
    })

    if(response.ok) {
      // Show repayed modal.
      combine.isRepayed = true;
      setModalData({title:"Success!", "desc":"All members have been refunded!","icon":<IoCheckmarkCircle size={64} color="green" />})
  setShowModal(true)
    }

  } catch (error) {
    console.log(error);
  }
 }

 const countLike = async ()=> {
        
  try {
      const response = await customPubFetch(`/api/count/like/combine/${id}`, 
      {
          method:"GET",
         
      })
      if(response.ok) {
          const data = await response.json()
          setCount(data.count)
          setLikeLoading(false);
      }
  } catch (error) {
      
  }
}

const flikeIncrease = async () => {
  try {
    const response = await customPubFetch("/api/flikes", {
      method:"POST",
      headers : {"Content-Type":"application/json"},
      body:JSON.stringify({
        id:id,
        pub_id:publisher_id
      })
    })
    if(response.ok) {
      console.log("Arttı");
      getCombine()
    }
  } catch (error) {
    console.log(error);
  }
}

const fpurchaseIncrease = async () => {
  try {
    const response = await customPubFetch("/api/fpurchase", {
      method:"POST",
      headers : {"Content-Type":"application/json"},
      body:JSON.stringify({
        id:id,
        pub_id:publisher_id
      })
    })
    if(response.ok) {
      console.log("Arttı");
      getCombine()
    }
  } catch (error) {
    console.log(error);
  }
}

function convertDateFormat(dateTimeStr) {
  const date = new Date(dateTimeStr);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  // Formatı 'MM.DD.YYYY - HH:mm' şekline dönüştür
  const [mdy, time] = formattedDate.split(', ');
  const [month, day, year] = mdy.split('/');
  return `${month}.${day}.${year} - ${time}`;
}

  return (
    <div>
      {showModal ? <div className="combine-modals">
        {modalData && modalData.icon}
        <h2>{modalData && modalData.title}</h2>
        <p>{modalData && modalData.desc}</p>
        <button onClick={()=> setShowModal(false)}>Close</button>
      </div> : ""}
      {isLoading ? (
        "  "
      ) : combine && combine ? (
        <div className="combine-container">
            <CombineAction
            publish={publish}
            delete_combine={delete_combine}
            is_published={combine.is_published}
          />
          <CombineHeader
            credit={combine.credit}
            date={convertDateFormat(combine.date)}
            id={combine.id}
          />

         
          <Matches key={combine.id} id={combine.id} />
          <StatusCombine statusEdit={statusEdit} status={combine.status} changeStatus={changeStatus} setStatusEdit={setStatusEdit} combine_id={combine.id} />
          <WarningsCombine warnings={warnings} deleteWarning={deleteWarning} addWarning={addWarning} combine_id={combine.id} />
          {combine.status == 2 ? purchaseCount &&  <div className="repay-bottom">
           <p>{purchaseCount} purchases</p>
           {combine.isRepayed ? <p>Already Repayed!</p> : <button onClick={repay}>{combine.repay}% - REPAY</button>}
          </div>:combine.credit > 0 ? <div className="repay-bottom">
           <p>{purchaseCount} purchases</p></div> : ""}
          {likeLoading ? "No Likes" : <div className="repay-bottom"><p>{count} Likes </p></div>}
        <div style={{display:"flex",flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginTop:"20px"}}>
        <div>
         <p>F Likes <strong>{combine.flike}</strong></p>
          <button onClick={flikeIncrease}>F Like Arttır</button>
         </div>
         
         {combine.credit < 1 ? "" : <div>
         <p>F Purchases <strong>{combine.fpurchase}</strong></p>
          <button onClick={fpurchaseIncrease}>F Purchase Arttır</button>
          </div>}
         
        </div>
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default Combine;

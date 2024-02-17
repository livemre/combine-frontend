import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import { MdDeleteForever } from "react-icons/md";
import { MainContext } from "../../App";
import { IoArrowBackCircle } from "react-icons/io5";
import { FaStickerMule } from "react-icons/fa";
import { IoMdWarning } from "react-icons/io";
import { customPubFetch } from "../../services/PublisherServices";
import { speFetch } from "../../services/Services";
import dayjs from 'dayjs';
import moment from "moment";

const AddCombine = () => {
  const { publisher_id, setPublisherId } = useContext(MainContext);

  const [predictions, setPredictions] = useState([]);
  const [credit, setCredit] = useState("0");
  const [selectedMatches, setSelectedMatches] = useState([]);
  const [date, setDate] = useState("01.01.2024");
  const [time,setTime] = useState("12:45")
  const [serverDate, setServerDate] = useState();
  const [status, setStatus] = useState("0");
  const [showModal,setShowModal] = useState(false);
  const [repay, setRepay] = useState(0);

  useEffect(() => {
    console.log("Use Effect");

    if (publisher_id !== null) {
      console.log("Predictionlar çekilecek");
    } else {
      setPublisherId(localStorage.getItem("publisher_id"));
    }
  }, []);

  useEffect(()=> {
    console.log(date + " / "+ time);
    setServerDate(formatDate(date + " / " +time));
  }, [date,time])


  
  useEffect(() => {
    const today = new Date();
    const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD formatına dönüştür
    setDate(currentDate);
}, []);



// function formatDate(inputDateTime) {
//   const dateObj = new Date(inputDateTime);

//   // Subtract 3 hours to adjust for the timezone or any other reason
//   dateObj.setHours(dateObj.getHours() - 3);

//   // Manually build the date string in the desired format
//   const year = dateObj.getFullYear();
//   const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
//   const day = String(dateObj.getDate()).padStart(2, '0');
//   const hours = String(dateObj.getHours()).padStart(2, '0');
//   const minutes = String(dateObj.getMinutes()).padStart(2, '0');
//   const seconds = String(dateObj.getSeconds()).padStart(2, '0');
//   const milliseconds = String(dateObj.getMilliseconds()).padStart(3, '0');

//   // Combine components into the desired format
//   const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}+00`;

//   console.log(formattedDate);
//   return formattedDate;
// }


// Day.js ile tarih formatlama

function formatDate(date, time) {
  // date ve time parametrelerini birleştirerek bir moment objesi oluşturun
  const dateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");


  // İstenen formatı kullanarak tarihi formatlayın
  const formattedDateTime = dateTime.format('YYYY-MM-DD HH:mm:ss.SSSZ');

  return formattedDateTime;
}
  console.log(selectedMatches);

  const handleSelectChange = (selectedOption) => {
    // Seçilen maçın zaten listede olup olmadığını kontrol et
    const isMatchAlreadySelected = selectedMatches.some(
      (match) => match.id === selectedOption.id
    );

    // Eğer maç zaten listede yoksa, listeye ekle
    if (!isMatchAlreadySelected) {
      setSelectedMatches([...selectedMatches, selectedOption]);
    }
  };

  const removeMatch = (matchId) => {
    setSelectedMatches(selectedMatches.filter((match) => match.id !== matchId));
  };

  // Bu alanda kupon oluşturulup kredi değeri girilecek. Tarih seçilecek




  useEffect(() => {
    getPredictionsByWaiting();
  }, [publisher_id]);

  const formatOptionLabel = ({ home, away, prediction, odd }) => (
    <div>
      <p className="text text-bold text-08">{home + "-" + away}</p>
      <p className="text text-08">{prediction + "-" + odd}</p>
    </div>
  );

  const getPredictionsByWaiting = async () => {
    // Publisher ID sine göre tüm tahminleri çek
    // Daha sonra tarihe göre çekicez.

    const request = await speFetch(
      `/api/publisher/${publisher_id}/match/result/0/`,
      {
        method: "GET",
      }
    );

    if (request) {
      const data = await request.json();
      console.log(data);
      setPredictions(data);
    }
  };

  const clearAll = ()=> {
    setSelectedMatches([]);
  }

  const addCombine = async () => {
    try {
      // Kombine oluştur
      const combineResponse = await customPubFetch("/api/combine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: serverDate,
          publisher_id: publisher_id,
          status: status,
          credit: credit,
          repay: repay,
          flike:0,
          fpurchase:0
        }),
      });
  
      if (!combineResponse.ok) {
        throw new Error("Combine oluşturulurken hata oluştu");
      }
  
      const combineData = await combineResponse.json();
      const combineId = combineData.id;
      console.log("Oluşturulan kuponun IDsi: " + combineId);
  
      // Maçları ekleyin
      const matchPromises = selectedMatches.map((item) =>
        customPubFetch("/api/single-match-combine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            match_id: item.id,
            combine_id: combineId.id,
          }),
        })
      );
  
      const results = await Promise.all(matchPromises);
  
     
      if(credit > 0 ) {
         // Uyarı mesajını ekleyin
      const addWarning = await customPubFetch("/api/warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `This combine offers a ${repay}% repay value in case of loss.`,
          combine_id: combineId.id,
        }),
      });
  
      if (!addWarning.ok) {
        throw new Error("Warning eklenirken hata oluştu");
      }
      console.log("Warning added successfully");
  
      } else {
        console.log("Warning ok ücretsiz.!");
      }

      // Başarılı sonuçları işleyin
      setShowModal(true);
      console.log("Tüm maçlar ve warning başarıyla eklendi");
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };
  

  return (
    <div className="add-combine-container">
      {showModal ? <div className="modal">
      <FaStickerMule size={128} color="green"/>
        <p style={{color:"black"}}>Kupon başarıyla eklendi...</p>
        <button onClick={()=> {
          setShowModal(false);
          clearAll();
        }}>OK</button>
      </div> : " "}
     


    
      <div className="add-combine-contain">
        <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}><h2>Add Combine</h2></div>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
          <p className="text text-bold text-08">Select Date</p>
        <input value={date} type="date" onChange={(e) => setDate(e.target.value)} />
        <input value={time} type="time" onChange={(e) => setTime(e.target.value)} />
        </div>
        <hr />
        <p className="text text-bold text-08"> Choose Predictions</p>
        {predictions.length < 1 ? 
        <div className="no-avaliable-prediction">
        <IoMdWarning size={64} color="orange"/><p>There is no prediction. </p>  
        <NavLink className="add-new-predic" to={"/admin/add-single-match"}>Add new prediction</NavLink>
        </div> : <Select
          className="add-combine-select"
          options={predictions}
          onChange={handleSelectChange}
          formatOptionLabel={formatOptionLabel}
          getOptionLabel={(option) => option.home}
          getOptionValue={(option) => option.prediction}
        />}
        <div className="selected-matches">
          {selectedMatches.map((match) => (
            <div key={match.id} className="add-combine-selected-match">
              <div>
                <p className="text text-bold text-08" style={{color:"black"}}>
                  {match.home} vs {match.away}
                </p>
                <p style={{color:"black"}} className="text text-08">{match.prediction}</p>
              </div>
              <MdDeleteForever
                onClick={() => removeMatch(match.id)}
                color="red"
                size={24}
              />
            </div>
          ))}
        </div>
        <div className="add-combine-form">
          <div className="add-combine-credit-status">
          <div className="title-credit-add-combine">
            <p className="text text-bold text-08">Choose Credit</p>
          <select
            className="add-match-credit-select"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
          >
            <option value={"0"}>FREE</option>
            <option value={"100"}>100</option>
            <option value={"250"}>250</option>
            <option value={"500"}>500</option>
          </select>
          </div>
          <div className="title-credit-add-combine">
          <p className="text text-bold text-08">Choose Status</p>
          <select
            className="add-match-credit-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={"0"}>Waiting</option>
            <option value={"1"}>Won</option>
            <option value={"2"}>Lost</option>
          </select>
          </div>
          <div className="title-credit-add-combine">
          <p className="text text-bold text-08">Repay</p>
          <select
            className="add-match-credit-select"
            value={repay}
            onChange={(e) => setRepay(e.target.value)}
          >
            <option value={0}>0</option>
            <option value={25}>25%</option>
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
          </select>
          </div>
          </div>
          {predictions.length < 1 ? " " : <button className="add-combine-create-button" onClick={addCombine}>
            CREATE
          </button>}
        </div>
      </div>
    </div>
  );
};

export default AddCombine;

import React, { useState, useContext, useEffect } from "react";
import { MainContext } from "../../App";
import { GiTotem } from "react-icons/gi";
import { FaStickerMule } from "react-icons/fa";
import { customPubFetch } from "../../services/PublisherServices";
import { FaCheckCircle } from "react-icons/fa";
import { MdNearbyError } from "react-icons/md";
import moment from "moment";

const AddSingleMatch = () => {
  const { publisher_id, setPublisherId } = useContext(MainContext);

  const [league, setLeague] = useState("");
  const [time, setTime] = useState("19:45");
  const [date, setDate] = useState("2023-12-08");
  const [home, setHome] = useState();
  const [away, setAway] = useState();
  const [prediction, setPrediction] = useState();
  const [odd, setOdd] = useState();
  const [showModal, setShowModal] = useState(false);
  const [canAdd, setCanAdd] = useState(false);
  const [modalMessage, setModalMessage] = useState("")
  const [modalIcon, setModalIcon] = useState("");
  const [serverDate, setServerDate] = useState();

  useEffect(()=> {
    console.log(date + " / "+ time);
    setServerDate(formatDate(date + " / " +time));
  }, [date,time])

  function formatDate(date, time) {
    // date ve time parametrelerini birleştirerek bir moment objesi oluşturun
    const dateTime = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");
  
  
    // İstenen formatı kullanarak tarihi formatlayın
    const formattedDateTime = dateTime.format('YYYY-MM-DD HH:mm:ss.SSSZ');
  
    return formattedDateTime;
  }

  useEffect(() => {
    // Tüm değerlerin boş olmadığını kontrol edin
    const allFieldsFilled =
      league && time && date && home && away && prediction && odd;

    setCanAdd(allFieldsFilled);
  }, [league, time, date, home, away, prediction, odd]);

  useEffect(() => {
    const today = new Date();
    const currentDate = today.toISOString().split("T")[0]; // YYYY-MM-DD formatına dönüştür
    setDate(currentDate);
  }, []);

  useState(() => {
    if (publisher_id == undefined) {
      setPublisherId(localStorage.getItem("publisher_id"));
    }
  }, []);

  const clearAll = () => {
    console.log("Clear all");
    setLeague("");
    setTime("");
    setHome("");
    setAway("");
    setPrediction("");
    setOdd("");
  };

  const addMatch = async (e) => {
    e.preventDefault();
    try {
      const request = await customPubFetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publisher_id: publisher_id,
          type: "football",
          league: league,
          time: time,
          date: serverDate,
          home: home,
          away: away,
          result: "0",
          home_ht_score: "0",
          away_ht_score: "0",
          home_ft_score: "0",
          away_ft_score: "0",
          prediction: prediction,
          odd: odd,
        }),
      });
      if (request.ok) {
        console.log("Maç eklendi ellam!");
        setModalMessage("Maç Eklendi!")
        setModalIcon(<FaCheckCircle size={128} color="green" />)
        setShowModal(true);
      } else {
        console.log("Hata oluştu");
        setModalMessage("HATA! - Maç Eklenemedi!")
        setModalIcon(<MdNearbyError  size={128} color="red" />)
        setShowModal(true);
      }
    } catch (error) {}
  };

  return (
   <>
   {publisher_id &&  <div className="add-single-match-container">
      {showModal ? (
        <div className="modal">
          {modalIcon}
          <p style={{ color: "black", fontSize:"16px", margin:"25px 5px" }}>{modalMessage}</p>
          <button
            onClick={() => {
              clearAll();
              setShowModal(false);
            }}
          >
            OK
          </button>
        </div>
      ) : (
        " "
      )}
     
      <div className="single-match-container">
       <h2>Add Prediction</h2>
        <form className="single-match-form" onSubmit={addMatch}>
          <p className="text text-bold text-08">Leauge Name:</p>
          <input
            value={league}
            placeholder="Leauge Name"
            className="single-match-input"
            onChange={(e) => setLeague(e.target.value)}
          />

          <div className="single-match-time-date">
            <div>
              <p className="text text-bold text-08">Time:</p>
              <input
                value={time}
                className="single-match-input"
                placeholder="Time"
                type="time"
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div>
              <p className="text text-bold text-08">Date:</p>
              <input
                value={date}
                className="single-match-input"
                placeholder="Date"
                type="date"
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
          <p className="text text-bold text-08">Home Team:</p>
          <input
            value={home}
            className="single-match-input"
            placeholder="Home Team"
            onChange={(e) => setHome(e.target.value)}
          />
          <p className="text text-bold text-08">Away Team:</p>
          <input
            value={away}
            className="single-match-input"
            placeholder="Away Team"
            onChange={(e) => setAway(e.target.value)}
          />
          <p className="text text-bold text-08">Prediction:</p>
          <input
            value={prediction}
            className="single-match-input"
            placeholder="Prediction"
            onChange={(e) => setPrediction(e.target.value)}
          />
          <p className="text text-bold text-08">Odd: Example (2.60)</p>
          <input
            value={odd}
            className="single-match-input"
            placeholder="Odd"
            onChange={(e) => {
              // Virgülü noktaya çevir
              const formattedValue = e.target.value.replace(',', '.');
              setOdd(formattedValue);
            }}
          />
          {canAdd ? (
            <button className="single-match-send-button">Add</button>
          ) : (
            " "
          )}
        </form>
      </div>
    </div>}
   </>
  );
};

export default AddSingleMatch;

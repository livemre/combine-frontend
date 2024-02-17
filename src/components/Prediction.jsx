import React, { useState } from "react";
import { IoFootball } from "react-icons/io5";
import { IoIosBasketball } from "react-icons/io";
import { BiSolidTennisBall } from "react-icons/bi";
import { FaStickerMule } from "react-icons/fa";
import { customPubFetch } from "../services/PublisherServices";
import { speFetch } from "../services/Services";

const Prediction = ({ data , getPredictionsByDate, publisher_id}) => {
  const {
    id,
    type,
    league,
    time,
    date,
    home,
    away,
    result,
    home_ht_score,
    away_ht_score,
    home_ft_score,
    away_ft_score,
    prediction,
    odd,
  } = data;

  const [editMode, setEditMode] = useState(false);

  const [editedTime, setEditedTime] = useState(time);
  const [editedDate, setEditedDate] = useState(date);
  const [editedLeauge, setEditedLeague] = useState(league);
  const [editedHomeHtScore, setEditedHomeHtScore] = useState(home_ht_score);
  const [editedAwayHtScore, setEditedAwayHtScore] = useState(away_ht_score);
  const [editedHomeFtScore, setEditedHomeFtScore] = useState(home_ft_score);
  const [editedAwayFtScore, setEditedAwayFtScore] = useState(away_ft_score);
  const [editedHomeTeam, setEditedHomeTeam] = useState(home);
  const [editedAwayTeam, setEditedAwayTeam] = useState(away);
  const [editedPrediction, setEditedPrediction] = useState(prediction);
  const [editedOdd, setEditedOdd] = useState(odd);
  const [editedResult, setEditedResult] = useState(result);
  const [message, setMessage] = useState();

  const [showModal, setShowModal] = useState(false);

  let _type;
  let _result;
  let _league;

  switch (type) {
    case "football":
      _type = <IoFootball color="black" />;
      break;
    case "basketball":
      _type = <IoIosBasketball color="orange" />;
      break;
    case "tennis":
      _type = <BiSolidTennisBall color="green" />;
      break;

    default:
      break;
  }

  switch (result) {
    case "0":
      _result = "Waiting...";
      break;
    case "1":
      _result = "Won";
      break;
    case "2":
      _result = "Lost";
      break;
    default:
      break;
  }

  const deleteMatch = async (id) => {
    console.log(publisher_id);
    try {
      const response = await customPubFetch(`/api/match/${id}`, {
        method: "DELETE",
        headers: {
          "publisher-id": publisher_id
        }
      });
  
      if (response.ok) {
        console.log("Match Deleted");
        setMessage("Successfull");
        setShowModal(true);
        
        //getPredictionsByDate();
      } else {
        console.log("Error Deleting Match");
        const errorResponse = await response.text(); // Hata mesajını metin olarak oku
        console.log("Error Detail:", errorResponse); // Hata detayını logla
        // Kullanıcıya hata mesajını göster
    
        setMessage(errorResponse)
        setShowModal(true);
        
      }
    } catch (error) {
      console.log("Network Error:", error);
      alert("Network Error: " + error.message);
    }
  };
  
  
  

  const editPrediction = async (id)=> {
    try {
      const request = await speFetch(`/api/match/edit/${id}` , {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          
            league:editedLeauge,
            time:editedTime,
            date:editedDate,
            home:editedHomeTeam,
            away:editedAwayTeam,
            result:editedResult,
            home_ht_score: editedHomeHtScore,
            away_ht_score:editedAwayHtScore,
            home_ft_score:editedHomeFtScore,
            away_ft_score:editedAwayFtScore,
            prediction:editedPrediction,
            odd:editedOdd,
       
        
        })
      })
      if(request) {
        console.log("Update Success");
        setEditMode(false);
        getPredictionsByDate();
        setMessage("Prediction edited successfully")
        setShowModal(true);
      } else {
        console.log("Update Error");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="prediction-container">
      {showModal ? <div className="modal">
      <FaStickerMule size={128} color="green"/>
        <p style={{color:"black"}}>{message}</p>
        <button onClick={()=>{setShowModal(false);getPredictionsByDate();}} >OK</button>
      </div> : " "}
      {editMode ? (
        <div>
         
          <div className="type-league-time">
            <div className="time-date-league-edit">
              <input
                value={editedLeauge}
                onChange={(e) => setEditedLeague(e.target.value)}
              />
              <div className="time-date-edit">
                <input
                  type="date"
                  value={editedDate}
                  onChange={(e) => setEditedDate(e.target.value)}
                />
                <input
                  type="time"
                  value={editedTime}
                  onChange={(e) => setEditedTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="team-scores-edited">
            <div className="edited-single-match-scores">
              <div>
                <p className="prediction-ht-title">HT</p>
                <input
                  className="prediction-ht-edit"
                  value={editedHomeHtScore}
                  onChange={(e) => setEditedHomeHtScore(e.target.value)}
                />
                <input
                  className="prediction-ht-edit"
                  value={editedAwayHtScore}
                  onChange={(e) => setEditedAwayHtScore(e.target.value)}
                />
              </div>
              <div>
                <p className="prediction-ht-title">FT</p>
                <input
                  className="prediction-ht-edit"
                  value={editedHomeFtScore}
                  onChange={(e) => setEditedHomeFtScore(e.target.value)}
                />

                <input
                  className="prediction-ht-edit"
                  value={editedAwayFtScore}
                  onChange={(e) => setEditedAwayFtScore(e.target.value)}
                />
              </div>
            </div>
            <div className="edited-single-match-names">
              <input
                className="prediction-home-edit"
                value={editedHomeTeam}
                onChange={(e) => setEditedHomeTeam(e.target.value)}
              />
              <input
                className="prediction-home-edit"
                value={editedAwayTeam}
                onChange={(e) => setEditedAwayTeam(e.target.value)}
              />
            </div>
          </div>
          <div className="pred-odds">
            <input
              value={editedPrediction}
              onChange={(e) => setEditedPrediction(e.target.value)}
            />
            <input
              className="edited-odd"
              value={editedOdd}
              onChange={(e) => setEditedOdd(e.target.value)}
            />
          </div>

          <div className="edit-select-result">
            <p className="text-bold">Result:</p>
            <p>{_result}</p>
            <select
              value={editedResult}
              onChange={(e) => setEditedResult(e.target.value)}
            >
              <option value={"0"}>Waiting</option>
              <option value={"1"}>Won</option>
              <option value={"2"}>Lost</option>
            </select>
          </div>
        </div>
      ) : (
        <div>
          <div className="type-league-time">
            <p>{league + " - " + date}</p>
            <p>{time}</p>
          </div>
          <hr />
          <div className="team-scores">
            <div className="single-match-scores">
              <p className="prediction-ht-title">HT</p>
              <p className="prediction-ht-title">FT</p>
              <p></p>
            </div>
            <div className="single-match-scores">
              <p className="prediction-ht">{home_ht_score}</p>
              <p className="prediction-ht">{home_ft_score}</p>
              <p className="text-bold">{home}</p>
            </div>
            <div>
              <div className="single-match-scores">
                <p className="prediction-ht">{away_ht_score}</p>
                <p className="prediction-ht">{away_ft_score}</p>
                <p className="text-bold">{away}</p>
              </div>
            </div>
          </div>

          <div className="pred-odds">
            <p className="text-bold">{prediction}</p>
            <p className="odd-prediction">{odd}</p>
          </div>
          <div className="edit-delete">
            <div className="result-prediction">
              <p className="text-bold">Result:</p>
              <p>{_result}</p>
            </div>
          </div>
        </div>
      )}
      <hr className="hr-line" />
      <div className="edit-delete-prediction">
        {editMode ? (
          <div>
            <button
              onClick={() => setEditMode((prevMode) => !prevMode)}
              className={
                editMode
                  ? "editmode-button-predictions"
                  : "edit-button-predictions"
              }
            >
              {editMode ? "CANCEL" : "EDIT"}
            </button>
            <button onClick={()=> editPrediction(data.id)} className="send-button-predictions" style={{marginLeft:"5px"}}>SEND</button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode((prevMode) => !prevMode)}
            className={
              editMode
                ? "editmode-button-predictions"
                : "edit-button-predictions"
            }
          >
            {editMode ? "CANCEL" : "EDIT"}
          </button>
        )}
        <button onClick={()=>deleteMatch(id)} className="delete-button-predictions">Delete</button>
      </div>
    </div>
  );
};

export default Prediction;

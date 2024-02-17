import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../App";
import Prediction from "../../components/Prediction";
import { IoArrowBackCircle } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { FaCat } from "react-icons/fa";
import { getCurrentDateFormatted, sendUserLocalTime, speFetch } from "../../services/Services";

const AllPredictions = () => {
  const { publisher_id, setPublisherId } = useContext(MainContext);
  const [predictions, setPredictions] = useState([]);
  const [date, setDate] = useState(getCurrentDateFormatted());

  useEffect(() => {
    console.log("Use Effect");
    console.log(date);

    if (publisher_id !== null) {
      console.log("Predictionlar çekilecek");
      getPredictionsByDate();
    } else {
      setPublisherId(localStorage.getItem("publisher_id"));
    }
  }, [publisher_id]);

  useEffect(() => {
    getPredictionsByDate();
  }, [date]);

  const getPredictionsByDate = async () => {
    // Publisher ID sine göre tüm tahminleri çek
    // Daha sonra tarihe göre çekicez.
    const postData = sendUserLocalTime(date);
    console.log(postData.localDate);

    if (publisher_id != null) {
      const request = await speFetch(
        `/api/publisher/${publisher_id}/match/`,
        {
          method: "POST",
          body:JSON.stringify(postData),
          headers:{"Content-Type":"application/json"}
        }

      );

      if (request) {
        console.log(request);
        const data = await request.json();
        console.log(data);
        setPredictions(data);
      }
    } else {
      console.log("Publisher Boş");
    }
  };

  return (
    <div className="all-predictions">
      <div className="all-predictions-bottom">
      <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
        {predictions.length > 0 ? (
          predictions.map((item) => (
            <Prediction
              data={item}
              key={item.id}
              publisher_id={publisher_id}
              getPredictionsByDate={getPredictionsByDate}
            />
          ))
        ) : (
          <div className="no-predictions">
            <FaCat size={128} color="#4695c9" />
            <p>No Predictions</p>
            <NavLink className="nav-link-add-prediction" to={"/admin/add-single-match"}>ADD PREDICTION</NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPredictions;

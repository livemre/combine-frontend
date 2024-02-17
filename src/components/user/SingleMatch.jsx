import React, {useEffect, useState} from "react";
import { IoIosTimer } from "react-icons/io";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import {HashLoader} from "react-spinners"
import { convertToEditorTime, convertToTRTime, convertUtcToLocalTime, formatDateAndTime, formatDateTimeWithoutSeconds } from "../../services/Services";

const SingleMatch = ({ data, status, date }) => {

  const [show, setShow] = useState(null);







  return (
    
   <div className="u-single-match-container">
  
      <div className="u-league-time">
        <p>{data.league}</p>
        <div className="u-time-icon">
       
        <p>{formatDateTimeWithoutSeconds(convertUtcToLocalTime(date))}</p>
        </div>
        
      </div>
      {data.result != 0 ? 
      data.result == 1 ? <div className="u-scores">
      <IoCheckmarkCircleSharp size={18} color="green" style={{marginRight:"5px"}} />
      <p className="u-result">RESULT: {data.home_ht_score+ "-"+data.away_ht_score+" / " + data.home_ft_score+ "-"+data.away_ft_score }</p>
    </div> : <div className="u-scores">
        <MdCancel size={18} color="red" style={{marginRight:"5px"}} />
        <p className="u-result">RESULT: {data.home_ht_score+ "-"+data.away_ht_score+" / " + data.home_ft_score+ "-"+data.away_ft_score }</p>
      </div> : ""}
      <div>
        <p className="u-teams">{data.home + " - " + data.away}</p>
      </div>
      <div className="u-prediction-odd">
      <p className="u-odd">{data.odd}</p>
      <p>{data.prediction}</p>
      </div>
     
    </div>
    
   
  );
};

export default SingleMatch;

import React, {useEffect, useState} from 'react'
import { speFetch } from '../services/Services';

const SinglePrediction = ({item}) => {
    const [match,setMatch] = useState({});
    const [isLoading, setIsLoading] = useState(true);



    useEffect(()=> {
        getMatch();
    },[])

    const getMatch = async ()=> {
        try {
            const response = await speFetch(`/api/match/${item}`, {
                method:"GET",
            })
            if(response) {
                const data = await response.json();
                setMatch(data);
                setIsLoading(false);
            }
        } catch (error) {
            
        }
    }

  return (
    <div className='sp-container'>
   {!isLoading ?  <><div className='sp-league-time'>
              <p>{match.league}</p>
              <p>{match.time}</p>
          </div><div>
                  <p>{match.home + " - " + match.away}</p>
                  <p>{match.prediction + " - " + match.odd}</p>
              </div></> : <p>Loading...</p>}
  </div>
  )
}

export default SinglePrediction
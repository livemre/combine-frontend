import React, {useEffect, useState} from 'react'
import SinglePrediction from './SinglePrediction';
import { speFetch } from '../services/Services';

const Matches = ({id}) => {

    const [matches,setMatches] = useState();

    useEffect(()=> {
        getMatches();
        console.log(id);
    }, [id])

    
    const getMatches = async () =>  {
        try {
            const response = await speFetch(`/api/match/combine/${id}`, {
                method : "GET"
            })
            const data = await response.json()

            console.log(data);
            setMatches(data)
        
        } catch (error) {
            
        }
    }

  return (
    <div>
        {matches && matches.map((item)=><SinglePrediction key={item} item={item}/>)}
    </div>
  )
}

export default Matches
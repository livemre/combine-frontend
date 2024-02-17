import React, {useEffect, useState} from 'react'

const CombineFeatures = ({totalMatches, totalOdds}) => {
    const [odds, setOdds] = useState();

    useEffect(()=>{countOdds()}, [])

    const countOdds = () => {
        const odds = totalOdds.map(item => parseFloat(item.odd));
        const totalMultiplication = odds.reduce((accumulator, current) => accumulator * current, 1);
        const formatted = totalMultiplication.toFixed(2)
        setOdds(formatted)
      };

  return (
    <div className='u-c-features-container'>
        <p>Bet $5 get ${5*odds} </p>
    </div>
  )
}

export default CombineFeatures
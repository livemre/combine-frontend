import React from 'react'

const CombineHeader = ({credit,date,id}) => {

  let _credit = 0;
  if(credit == 0) {
    _credit = "FREE"
  } else {
    _credit = credit
  }

  return (
    <div className='combine-header-container'>
        <div className='fx-col-jcc-aic '>
          <p className='text text-bold'>CREDIT</p>
          <p className='text'>{_credit}</p>
        </div>
        <div className='fx-col-jcc-aic '>
          <p className='text text-bold'>Date</p>
        <p className='text'>{date}</p>
        </div>
        <div className='fx-col-jcc-aic '>
          <p className='text text-bold'>ID</p>
        <p className='text'>{id}</p>
        </div>
        
    </div>
  )
}

export default CombineHeader
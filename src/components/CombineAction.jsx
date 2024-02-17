import React from 'react'
import { FaCheckCircle } from "react-icons/fa";

const CombineAction = ({delete_combine, publish, is_published}) => {
  return (
    <div className='combine-action'>
        {is_published ? <div style={{display:"flex", flexDirection:"row", alignItems:"center"}}><FaCheckCircle color='green' style={{marginRight:"5px"}} /> <p className='text alr-publshd'>Published</p></div> : <button className='publish-button' onClick={publish}>PUBLISH</button>}
        <button className='button-delete' onClick={delete_combine}>DELETE</button>

    </div>
  )
}

export default CombineAction
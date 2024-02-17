import React from 'react'
import { MdDeleteForever } from "react-icons/md";

const SingleWarning = ({item,deleteWarning,warning_id}) => {
  return (
    <div style={{display:"flex", flexDirection:"row",alignItems:"center"}}>
        <MdDeleteForever color='red' style={{marginRight:"10px"}} onClick={()=> deleteWarning(warning_id)} />
        <p className='text text-08'>{item}</p>
    </div>
  )
}

export default SingleWarning
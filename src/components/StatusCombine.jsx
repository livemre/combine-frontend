import React, { useEffect, useState } from 'react'
import { CiEdit } from "react-icons/ci";

const StatusCombine = ({statusEdit, status, changeStatus, setStatusEdit, combine_id}) => {
    const [_changedStatus, _setChangedStatus] = useState("0");
    const [_status, _setStatus] = useState();

    useEffect(()=> {
        switch (status) {
            case "0":
                _setStatus("Waiting")
                break;
            case "1":
                _setStatus("Won")
                break;
            case "2":
                _setStatus("Lost")
                break
            default:
                break;
        }
    }, [status])

  return (

    <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"start"}}>
        <p className='text text-08 text-bold' style={{marginRight:"5px"}}>Status:  </p>
        <p className='text text-08'>{ _status}</p>
        {statusEdit ? <div style={{marginLeft:"10px", display:"flex"}}>
            <select value={_changedStatus} onChange={(e)=> _setChangedStatus(e.target.value)}>
            <option value={"0"}>Waiting</option>
            <option value={"1"}>Won</option>
            <option value={"2"}>Lost</option>
            </select>
            <div><button style={{marginLeft:"5px"}} onClick={()=>changeStatus(combine_id, _changedStatus)}>OK</button><button onClick={()=> setStatusEdit(false)} style={{marginLeft:"5px"}}>CANCEL</button></div></div> : <CiEdit style={{cursor:"pointer"}} onClick={()=> setStatusEdit(true)} />}
    </div>
  )
}

export default StatusCombine
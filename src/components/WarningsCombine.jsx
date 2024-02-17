import React, { useState } from 'react'
import SingleWarning from './SingleWarning'

const WarningsCombine = ({warnings, deleteWarning, addWarning, combine_id}) => {

    const [_editMode,_setEditMode] = useState(false);
    const [title, setTitle] = useState();

    console.log(warnings);
  return (
    <div>
        <hr />
        
     {warnings && warnings.map((item)=> <SingleWarning  item={item.title} warning_id={item.id} deleteWarning={deleteWarning}/>)}
     {_editMode ? <div style={{margin:"10px",width:"90%",display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"flex-end"}}>
     <textarea onChange={(e)=> setTitle(e.target.value)} style={{width:"90%", backgroundColor:"rgb(200, 236, 136)", border:"0", padding:"10px", marginBottom:"10px"}}></textarea>
     <div style={{display:"flex"}}>
     <button style={{marginRight:"5px", backgroundColor:"rgb(43, 176, 176)", color:"white", padding:"5px 10px", border:"0"}} onClick={()=> addWarning(combine_id, title).then(()=> _setEditMode(false))}>ADD</button>
     <button style={{backgroundColor:"rgb(225, 127, 127)", color:"white", padding:"5px 10px", border:"0"}} onClick={()=> _setEditMode(false)}>CANCEL</button>
     </div>
     </div> : " "}
     <button style={{marginTop:"10px", backgroundColor:"rgb(200, 236, 136)", color:"black", padding:"5px 15px", border:"0", cursor:"pointer"}} onClick={()=> _setEditMode(true)}>Add New Warning</button>
    </div>
  )
}

export default WarningsCombine
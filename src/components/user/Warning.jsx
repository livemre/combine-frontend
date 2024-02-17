import React, { useEffect } from 'react'
import { RiFolderWarningFill } from "react-icons/ri";

import { RiMoneyDollarBoxFill } from "react-icons/ri";

const Warning = ({title, _icon }) => {




  return (
    <div className='u-warning-container'>
        <div className='u-info-icon'>
          {_icon !== "dollar" ? <RiFolderWarningFill    size={18} color='orange' /> : <RiMoneyDollarBoxFill size={18} color='green' /> }
        
        </div>
        <p className='u-war-text'>{title}</p>
    </div>
  )
}

export default Warning
import React from "react";
import { NavLink } from "react-router-dom";
import { ImClock2 } from "react-icons/im";
import { GiTrophyCup } from "react-icons/gi";
import { TiDelete } from "react-icons/ti";
import { MdCancelPresentation } from "react-icons/md";
import { GiWhistle } from "react-icons/gi";
import { convertUtcToLocalTime, formatDateTimeWithoutSeconds } from "../../services/Services";

const Publisher = ({ createdDate, data, publisher_page, status }) => {
  const formatLink = () => {
    const link = data.publisher_name;
    const seoLink = link.replace(/\s+/g, "-");
    return seoLink;
  };




  return (
    <div className="u-publisher-container">
      <div className="publisher-top-flex">
        <div style={{display:"flex"}}>
         {publisher_page ===1 ?  
          <div
            className="u-avatar-profile-combine"
            style={{ backgroundImage: `url(${data.avatar_image})`}}
          ></div>
           :  <NavLink to={`/publisher/${data.id}/${formatLink()}`}>
          <div
            className="u-avatar-profile-combine"
            style={{ backgroundImage: `url(${data.avatar_image})` }}
          ></div>
            </NavLink> }
         
          <div className="u-pb-bt">
            {publisher_page === 1 ? (
              <p style={{ fontSize: "16px" }}>{data.publisher_name}</p>
            ) : (
              <NavLink
                style={{
                  fontSize: "16px",
                  textDecoration: "none",
                  color: "black",
                }}
                to={`/publisher/${data.id}/${formatLink()}`}
              >
                <p style={{ fontSize: "18px" ,fontWeight:"bold"}}>{data.publisher_name}</p>
              </NavLink>
            )}
           <div style={{display:"flex"}}>
           <GiWhistle size={18} color="black" style={{marginRight:"5px"}}/> 
           <p>Starts at: {formatDateTimeWithoutSeconds(convertUtcToLocalTime(createdDate))}</p>
           </div>
          </div>
        </div>
        <div>
       {status && status == 0 ?  <ImClock2  size={36} color="grey"/> :  status == 1 ? <GiTrophyCup   size={36} color="orange"/> : <MdCancelPresentation   size={36} color="red"/>}
        </div>
      </div>
    </div>
  );
};

export default Publisher;

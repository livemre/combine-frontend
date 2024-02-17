import React, { useState, useEffect, useContext } from "react";
import SingleMatch from "../components/user/SingleMatch";
import Publisher from "../components/user/Publisher";
import Warning from "../components/user/Warning";
import CombineFeatures from "../components/user/CombineFeatures";
import Like from "../components/user/Like";
import Vip from "../components/user/Vip";
import { MdPriceCheck } from "react-icons/md";
import { MainContext } from "../App";
import { MdFavoriteBorder } from "react-icons/md";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { BiSolidBadgeDollar } from "react-icons/bi";
import { customFetch } from "../services/Services";
import { IoClose } from "react-icons/io5";
import { MdFavorite  } from "react-icons/md";



const LandingCombine = ({ data, publisher_page }) => {

  const { credit, publisher_id, status, flike } = data;

  



 

  return (
   
 <div  className={`u-combine-container`} style={{backgroundColor:"#f4f4f4"}}>
         
   
              
          <Publisher
            key={publisher_id}
            data={data.publisher}
            createdDate={data.date}
            publisher_page={publisher_page}
            status={data.status}
          />
         {data &&
            data.matches.map((item, index) => (
              <SingleMatch key={index} data={item} status={status} date={data.date}/> 
            ))}
          
        
      
          {data && <div className="u-like"><MdFavorite  color='grey' size={24}  /><p style={{marginLeft:"5px"}}>{flike} users liked</p></div>}
        
         
        </div>
 
  );
};

export default LandingCombine;

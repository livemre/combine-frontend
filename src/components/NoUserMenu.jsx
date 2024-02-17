import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  IoIosHome,
  IoIosAlbums,
  IoIosHeart,
  IoIosPaper,
  IoMdKey,
} from "react-icons/io";
import { RiMenuFill } from "react-icons/ri";

const NoUserMenu = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="drawer-menu">
        <Link to={"/"}>
        <img
            src="https://i.ibb.co/G2S23y1/tandt.png"
            width={120}
            height={20}
            alt="logo"
            style={{marginLeft:"10px"}}
          />
        </Link>

       <div style={{marginRight:"20px"}}>
        <Link to={"/register"}><button className="menu-register-button">Register</button></Link>
        <Link to={"/login"}><button  className="menu-login-button">Login</button></Link>

       </div>
      
      
      </div>
    </>
  );
};

export default NoUserMenu;

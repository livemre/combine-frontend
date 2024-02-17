import React, { useContext, useState, useRef, useEffect } from "react";
import { MainContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  IoIosHome,
  IoIosAlbums,
  IoIosHeart,
  IoIosPaper,
  IoMdPerson,
  IoMdKey,
} from "react-icons/io";
import { RiMenuFill } from "react-icons/ri";

import { customPubFetch } from "../services/PublisherServices";
import NoUserMenu from "./NoUserMenu";

const PublisherMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [publisherData, setPublisherData] = useState();
  const [loading, setLoading] = useState(true);

  const { userRole, setUserRole, setPublisherId, pat, setPat} =
    useContext(MainContext);

  const menuRef = useRef();
  const buttonRef = useRef();

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  // Menü öğesine tıklandığında menüyü kapatma fonksiyonu
  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Menü açma/kapama butonuna tıklanmadığını ve menü dışına tıklanıldığını kontrol edin
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();

  const exitAdmin =  async () => {
    const deleteToken = await customPubFetch("/api/publisher-logout", {
      method:"DELETE",
    })

    if(deleteToken.ok) {
      console.log("Token deleted on db");
      console.log("Çıkış yap");
    localStorage.clear("pat");
    setPat(null);  
    navigate("/admin/login");
    }
    
  };



  useEffect(()=> {
    if(pat) {
      getPublisherData().then(setLoading(false));
    }
  }, [pat])

  useEffect(()=> {

      getPublisherData().then(setLoading(false));
    
  }, [pat])

  const getPublisherData = async () => {
console.log("Get Publisher Data");
console.log(pat);
console.log(userRole);
    try {
      if (pat && pat) {
        const response = await customPubFetch("/api/publisher/", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setPublisherData(data);
          setPublisherId(data.id)
          setUserRole("publisher")
          
        }
      }
      else {
        console.log("Admin değil");
      }

    } catch (error) {}
  };

  return (
    <>
    {pat !== null ? <div className="drawer-menu">
    <Link to={"/admin/combines"}>
    <img
            src="https://i.ibb.co/G2S23y1/tandt.png"
            width={120}
            height={20}
            alt="logo"
            style={{marginLeft:"10px"}}
          />
    </Link>
    <div className="balance-container">
      <div ref={buttonRef} onClick={handleOpen}>
        <RiMenuFill color="white" size={24} style={{ marginLeft: "10px" }} />
      </div>
    </div>
    <div
                ref={menuRef}
               
                
                className={`menu-open-drawer ${isOpen ? "open" : ""}`}
              >
      <div onClick={handleMenuItemClick} className="menu-items">
        <div>
          <div className="drawer-menu-publisher-top">
            {publisherData && (
              <div
                className="u-avatar-profile-combine-drawer"
                style={{
                  backgroundImage: `url(${publisherData.avatar_image})`,
                }}
              ></div>
            )}
            {publisherData && <h3>{publisherData.publisher_name}</h3>}
          </div>

         

          <Link className="sidemenu-link" to={"/admin/add-single-match"}>
            <div className="menu-item-div">
              <IoIosAlbums />
              <p>ADD PREDICTION</p>
            </div>
          </Link>

          <Link className="sidemenu-link" to={"/admin/add-combine"}>
            <div className="menu-item-div">
              <IoIosHeart />
              <p>ADD COMBINE</p>
            </div>
          </Link>

          <Link className="sidemenu-link" to={"/admin/predictions"}>
            <div className="menu-item-div">
              <IoIosPaper />
              <p>ALL PREDICTIONS</p>
            </div>
          </Link>

          <Link className="sidemenu-link" to={"/admin/combines"}>
            <div className="menu-item-div">
              <IoMdPerson />
              <p>ALL COMBINES</p>
            </div>
          </Link>

          <Link className="sidemenu-link" to={"/admin/profile"}>
            <div className="menu-item-div">
              <IoMdPerson />
              <p>PROFILE</p>
            </div>
          </Link>

          <Link className="sidemenu-link" to={"/admin/transfers"}>
            <div className="menu-item-div">
              <IoMdPerson />
              <p>TRANSFERS</p>
            </div>
          </Link>

          <Link className="sidemenu-link" to={"/admin/settings"}>
            <div className="menu-item-div">
              <IoMdPerson />
              <p>SETTINGS</p>
            </div>
          </Link>

          <div className="sidemenu-link" onClick={exitAdmin}>
            <div className="menu-item-div">
              <IoMdKey />
              <p>LOGOUT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> : <NoUserMenu />}
  </>
  );
};

export default PublisherMenu;

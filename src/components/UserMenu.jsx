import React, { useContext, useState, useRef, useEffect } from "react";
import { MainContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoIosHome, IoIosAlbums, IoIosHeart, IoIosPaper , IoMdKey      } from "react-icons/io";
import { RiMenuFill } from "react-icons/ri";
import QRCode from 'qrcode.react';
import { IoCloseSharp } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import app from "../firebase";
import { customFetch } from "../services/Services";
import NoUserMenu from "./NoUserMenu";
import { RiUserFollowFill } from "react-icons/ri";


const UserMenu = () => {
  const { setUserRole, setUserID, credit,
    showDepositModal, setShowDepositModal, accessToken, setAccessToken } =
    useContext(MainContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const buttonRef = useRef();
  const [userData, setUserData] = useState();
  const [statusModal, setStatusModal] = useState("open");
  const [loading, setLoading] = useState(true);
  const [depositAddress, setDepositAddress]= useState();
  const modalRef = useRef();
  const [isClosing, setIsClosing] = useState(false);
  const [showAddressCopyModal, setShowAddressCopyModal] = useState(false)

  const auth = getAuth(app);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const navigate = useNavigate();

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


  useEffect(() => {
    // Modal dışına tıklanıldığında çalışacak fonksiyon
    const handleClickOutsideModal = (event) => {
        // Eğer tıklanan element modal içinde değilse, modalı kapat
        if (!modalRef.current.contains(event.target)) {
          _handleCloseModal();
        }
    };

    // Eğer modal gösteriliyorsa, event listener'ı ekleyin
    if (showDepositModal) {
        document.addEventListener("mousedown", handleClickOutsideModal);
    }

    // Cleanup fonksiyonu
    // Komponent unmount olduğunda veya showDepositModal değiştiğinde, event listener'ı kaldırın
    return () => {
        document.removeEventListener("mousedown", handleClickOutsideModal);
    };
}, [showDepositModal]); // showDepositModal'a bağımlılık ekleyin


const handleCloseModal = () => {
  setIsClosing(true);
  setTimeout(() => {
      setShowDepositModal(false);
      setIsClosing(false); // Animasyon tamamlandıktan sonra tekrar false yapın
  }, 300); // Burada 300ms, animasyon sürenizdir
}





  useEffect(() => {
  
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);



  useEffect(() => {
   if(accessToken) {
    getUserData().then(setLoading(false));
   }
  
  }, [accessToken]);


  useEffect(()=> {
    if(accessToken == null) {
      setLoading(false)
    }
  }, [accessToken])


  useEffect(() => {
    getUserData();
    
  }, [credit]);


  useEffect(()=> {
 
    getDepositAddress();
   
  }, [showDepositModal])



  const getUserData = async () => {
   
    try {
      if (accessToken && accessToken) {
        const response = await customFetch("/api/user/", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setUserID(data.id);
          setUserRole("user")
         
          
        }
      }
 
    } catch (error) {}
  };






  const getDepositAddress = async ()=> {
    try {
      const response = await customFetch("/api/user-key", {
        method:"GET",
      })
      if(response.ok) {
        const data = await response.json();
    
        setDepositAddress(data.address);
     
      }
    } catch (error) {
      console.log(error);
    }
  }






  const exit = async () => {

    const deleteToken = await customFetch("/api/logout", {
      method:"DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if(deleteToken.ok) {
      console.log("Token deleted on db");
    }

    console.log("Çıkış yap");
    localStorage.clear("token");
    setAccessToken(null);
    signOut(auth).then(() => {
      console.log("Google dan çıkış yapıldı.");
    }).catch((error) => {
      // An error happened.
    });
    navigate("/login");
  };



  // Menü öğesine tıklandığında menüyü kapatma fonksiyonu
  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  function _handleCloseModal () {
    setStatusModal("close")
    setTimeout(()=> {
      setShowDepositModal(false);
      setStatusModal("open")
    }, 200)
    
  }

  function showCopyAddressModal () {
    setShowAddressCopyModal(true)
    setTimeout(()=> {
      setShowAddressCopyModal(false)
    }, 500)
  }



  return (
    <>
   {loading ? <p>Loading...</p> :  <div>
      {showDepositModal ? (
        <div ref={modalRef} className={`u-modal-deposit ${showDepositModal ? (isClosing ? 'close' : statusModal) : ""}`}>
          <div style={{display:"flex", alignItems:"center"}}>
          <h2>Deposit TRX</h2>
          <img src="https://tron.network/static/images/header/logo-red.svg"  width={50} height={50}/>
          </div>
         
          <div style={{margin:"10px"}}>
           
          <QRCode value={depositAddress} />
          </div>
          <div style={{display:"flex"}}>
          <p style={{marginRight:"5px", fontSize:"12px"}}>{depositAddress}</p>
          <FaRegCopy size={18} onClick={()=>{
            showCopyAddressModal();
            navigator.clipboard.writeText(depositAddress)}
          }  />
          </div>
         {showAddressCopyModal ? <p className="address-copy-text">Address Copied</p> : ""} 
          <div className="modal-close-icon">
          <IoCloseSharp size={28} onClick={handleCloseModal} />
            </div>
            <div className="modal-trx-attention">
          <p>Please only send TRON via the TRON/TRC-20 network. Any other method will result in a failed transaction, and you will lose your TRON.</p>
          </div>
        
        </div>
      ) : (
        ""
      )}
   


    
        <div>
          {accessToken !== null ? (
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
              <div className="balance-container">
                <p className="balance-con-text">
                  {userData && userData.credit} Credits
                </p>
                <button
                  onClick={() => {
                    getDepositAddress().then( setShowDepositModal(true));
                   }}
                  className="deposit-btn"
                >
                  Deposit
                </button>
                <div ref={buttonRef} onClick={handleOpen}>
                  <RiMenuFill
                    color="white"
                    size={24}
                    style={{ marginLeft: "10px" }}
                  />
                </div>
              </div>
              <div
                ref={menuRef}
               
                
                className={`menu-open-drawer ${isOpen ? "open" : ""}`}
              >
                <div onClick={handleMenuItemClick} className="menu-items">
                  <div>
                    
                    <Link className="sidemenu-link" to={"/"}>
                    <div className="menu-item-div">
                    <IoIosHome />
                    <p>HOME</p>
                    </div></Link>

                    <Link className="sidemenu-link" to={"/followed-publishers"}>
                    <div className="menu-item-div">
                    <RiUserFollowFill   />
                    <p>FOLLOWED PUBLISHERS</p>
                    </div></Link>

                    <Link className="sidemenu-link" to={"/purchased-combines"}>
                    <div className="menu-item-div">
                    <IoIosAlbums  />
                    <p>PURCHASED COMBINES</p>
                    </div></Link>

                    <Link className="sidemenu-link" to={"/favorited-combines"}>
                    <div className="menu-item-div">
                    <IoIosHeart   />
                    <p>FAVORITED COMBINES</p>
                    </div></Link>

                    <Link className="sidemenu-link" to={"/transactions"}>
                    <div className="menu-item-div">
                    <IoIosPaper     />
                    <p>TRANSACTIONS</p>
                    </div></Link>

                   
                    <div className="menu-item-div" onClick={exit}>
                    <IoMdKey       />
                    <p>LOGOUT</p>
                    </div>
          
                  </div>
                 
                </div>
              </div>
            </div>
          ) : (
           <NoUserMenu />
          )}
        </div>
      
  
    </div>}
    </>
  );
};

export default UserMenu;

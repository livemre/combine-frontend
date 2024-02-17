import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MainContext } from "../../App";
import { FaEdit } from "react-icons/fa";
import { speFetch } from "../../services/Services";

const PublisherDashboard = () => {
  const [email, setEmail] = useState(null);
  const [avatarImage, setAvatarImage] = useState("");
  const [editedAvatar, setEditedAvatar] = useState();
  const [avatarEditMode, setAvatarEditMode] = useState(false);

  const { publisher_id, setPublisherId, publisherName, setPublisherName } =
    useContext(MainContext);

  const navigate = useNavigate();

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);

  useEffect(() => {
    if (email !== null) {

    }
  }, [email, avatarImage]);

  function signOut() {
    localStorage.clear("accessToken");
    navigate("/admin/login");
  }

  async function getPublisherDetails() {
    try {
      const response = await speFetch(
        `/api/publisher/${email}`,
        {
          method: "GET",
        }
      );

      if (response) {
        const data = await response.json();
        //console.log(data.id);
        setPublisherName(data.publisher_name);
        setAvatarImage(data.avatar_image);
        setEditedAvatar(data.avatar_image);
        setPublisherId(data.id);
        localStorage.setItem("publisher_id", data.id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const changeAvatar = async ()=> {
    try {
      const response = await fetch(`/api/publisher/${publisher_id}`, {
        method:"PATCH",
        headers: {"Content-Type" : "application/json"},
        body:JSON.stringify({avatar_image:editedAvatar})
      })
      if(response) {
        console.log("Avatar Changed");
        getPublisherDetails();
      } else {
        console.log("Error Avatar Change!");
      }
    } catch (error) {
      console.log(error);
    }
    console.log("Change avatar");
  }



  return (
    <div className="publisher-dashboard">
      {avatarEditMode ? <div className="modal-edit-avatar">
        <p>Type your avatar's url </p>
        <textarea value={editedAvatar} onChange={(e)=> setEditedAvatar(e.target.value)} />
       <div className="modal-edit-avatar-buttons">
       <button className="modal-edit-avatar-cancel" onClick={()=> {
          setEditedAvatar(avatarImage)
         setAvatarEditMode(false)
        }}>CANCEL</button>
       <button className="modal-edit-avatar-change" onClick={()=> {
         setAvatarEditMode(false);
         changeAvatar();
        }}>CHANGE</button>
         
       </div>
      </div> : " "}
       <div className="publisher-dashboard-main">
       <div className="publisher-dashboard-container">
      <div className="dashboard-top">
       
        {avatarImage && (
         <div className="edit-avatar-div">
           <img src={avatarImage} width={50} height={50} alt="Avatar" />
          <FaEdit onClick={()=> setAvatarEditMode(true)} className="edit-avatar-icon" size={36}/>
         </div>
        )}
    
        <h1>Welcome</h1>
        <h2>{publisherName && publisherName}</h2>
      </div>
      <div className="dashboard-menu">
      <NavLink className="link" to={"/admin/add-single-match"}>
          Add New Prediction
        </NavLink>
        <NavLink className="link" to={"/admin/add-combine"}>
          Add New Combine
        </NavLink>
        
        <NavLink className="link" to={"/admin/predictions"}>
          All Predictions
        </NavLink>
        <NavLink className="link" to={"/admin/combines"}>
          All Combines
        </NavLink>
      </div>

      <button className="sign-out" onClick={signOut}>
        Sign Out
      </button>
    </div>
       </div>
    </div>
  );
};

export default PublisherDashboard;

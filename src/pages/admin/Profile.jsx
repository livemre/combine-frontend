import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../../App";
import { RiImageEditFill } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { customPubFetch } from "../../services/PublisherServices";
import { customFetch } from "../../services/Services";

const ProfileAdmin = () => {
  const { pat, publisher_id } = useContext(MainContext);

  const [data, setData] = useState();
  const [editMode, setEditMode] = useState(false);
  const [editDesc, setEditDesc] = useState(false);
  const [count, setCount] = useState();


  const [editAvatar, setEditAvatar] = useState(false);
  const [editProfileImage, setEditProfileImage] = useState(false);

  const [desc, setDesc] = useState();
  const [profileImage, setProfileImage] = useState();
  const [avatarImage, setAvatarImage] = useState();

  const [charCount, setCharCount] = useState(0);
  const [countLoading,setCountLoading] = useState(true);

  useEffect(() => {
    // accessToken mevcutsa getData fonksiyonunu çalıştır
    if (pat) {
      getData();
      countFollow();
    }
  }, [publisher_id]); // accessToken değiştiğinde useEffect tekrar çalışır


  useEffect(()=> {
    if(desc) {
      setCharCount(desc.length)
    }
  }, [desc])





  const getData = async () => {
    try {
      const response = await customPubFetch("/api/publisher", {
        method: "GET",
        headers: { Authorization: `Bearer ${pat}` },
      });
      if (response.ok) {
        console.log("Res OK");
        const data = await response.json();
        setData(data);
        console.log(data);
        setDesc(data.desc)
        setAvatarImage(data.avatar_image)
        setProfileImage(data.profile_image)
      } else {
        console.log("Something error response");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const updateData = async ()=> {
    console.log("update data");
    try {
      const response = await customPubFetch("/api/publisher/patch", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(
          {
            "desc" : desc,
            "avatar_image" :avatarImage,
            "profile_image": profileImage
          }
        ) 
      })
      if(response.ok) {
        console.log("Update Success");
        setEditAvatar(false)
        setEditProfileImage(false)
        setEditDesc(false)
        getData();
      } else {
        console.log("Update failed");
      }
    } catch (error) {
      console.log(error);
    }
  }


  const countFollow = async ()=> {
    console.log("Count follow");
    console.log(publisher_id);
    try {
      const response = await customPubFetch(`/api/count/follow/publisher/${publisher_id}`, {
        method:"GET",
      });
      if(response.ok) {
        const data = await response.json();
        console.log(data.count);
        setCount(data.count)
        setCountLoading(false);
      } else {
        console.log("res okay değil");
      }
    } catch (error) {
      console.log(error);
    }
  } 

  const followPlus = async ()=> {
    try {
      const resposne = await customPubFetch("/api/ffollowers", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({
          pub_id:publisher_id
        })

      })

      if(resposne.ok) {
        console.log("success");
        getData()
      }
    } catch (error) {
      console.log(error);
    }
  }





  return (
    <>
      {data && (
        
        <div>
           <div  className={`modal-profile-image ${!editAvatar ? 'closed' : "" }`}>
           <h2> Edit Avatar</h2>
           <textarea value={avatarImage} onChange={(e)=> setAvatarImage(e.target.value)} ></textarea>
           <div className="ed-pi-div">
           <button className="btn-success" onClick={updateData}>UPDATE</button>
           <button className="btn-cancel" onClick={()=> setEditAvatar(false)}>CANCEL</button>
           </div>
            </div>

            <div  className={`modal-profile-image ${!editProfileImage ? 'closed' : "" }`}>
           <h2> Edit Profile Image</h2>
           <textarea value={profileImage} onChange={(e)=> setProfileImage(e.target.value)} ></textarea>
           <div className="ed-pi-div">
           <button className="btn-success" onClick={updateData}>UPDATE</button>
           <button className="btn-cancel"  onClick={()=> setEditProfileImage(false)}>CANCEL</button>
           </div>
           
            </div>
          
          <div className="profile-pf-image" style={{backgroundImage:`url(${data.profile_image})`}}>
          <RiImageEditFill color="white" size={36} className="profile-image-edit-icon" onClick={()=>setEditProfileImage(prev => !prev)} />
          
            
            <div>
            <RiImageEditFill color="white" size={18} className="avatar-image-edit-icon" onClick={() => setEditAvatar(prev => !prev)}/>
           
            <div className="profile-pf-image-div" style={{backgroundImage:`url(${data.avatar_image})`}}>

            </div>
            </div>
          </div>
          <div className="desc-area" style={{marginTop:"50px"}}>
          <h3>{data.publisher_name}</h3>
         
         
          <FiEdit3 size={18} color="red" onClick={() => setEditDesc(prev => !prev)} />
         
          
          {editDesc ? (
            <div className="edit-desc">
              <textarea maxLength="245" value={desc} onChange={(e)=> setDesc(e.target.value)} ></textarea>
             <p>Max 245 Character.  {charCount}</p>
              <div className="edit-desc-buttons">
              <button className="btn-success" onClick={updateData}>UPDATE</button>
              <button className="btn-cancel" onClick={()=> setEditDesc(false)}>CANCEL</button>
              </div>
            </div>
          ) : (
            <div>
              <p>{data.desc}</p>
              
            </div>
          )}

          <div style={{marginTop:"20px"}}>
            Followers {countLoading ? <p>Loading...</p> : count} {data && data.ffollowers}<button style={{backgroundColor:"green", border:"0", color:"white", padding:"10px 15px", marginLeft:"25px"}} onClick={followPlus}>To moon</button>
          </div>

          </div>
         
        </div>
      )}
    </>
  );
};

export default ProfileAdmin;

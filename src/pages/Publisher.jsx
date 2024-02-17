import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Combine from "./Combine";
import OnAir from "../components/user/publisherTabs/OnAir";
import Won from "../components/user/publisherTabs/Won";
import Lost from "../components/user/publisherTabs/Lost";
import { MainContext } from "../App";
import { jwtDecode } from "jwt-decode";
import { customFetch, speFetch } from "../services/Services";


const Publisher = () => {
  const {userID, setUserID} = useContext(MainContext);
  const { id, publisher_name } = useParams();
  const [data, setData] = useState(null);
  const [matches, setMatches] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tab1");
  const [isFollow, setIsFollow] = useState(null);
  const [count, setCount] = useState();
  const [combineCount, setCombineCount] = useState();

  useEffect(() => {

    checkFollow();
    countFollow();
    countCombines();

  }, []);

  useEffect(()=> {
    if(id != null) {
      getDetails();
    }
  }, [id])

  useEffect(()=> {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserID(decoded.id);
      console.log(userID);
    }
  }, [])



  const getDetails = async () => {
    try {
      const response = await customFetch(
        `/api/publisher/public/${id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setData(data);
        setDataLoading(false);

      }
    } catch (error) {}
  };




  const follow = async ()=> {
    try {
      const response = await customFetch("/api/follow", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({
          publisher_id: id
        })
      })
      if(response.ok) {
        console.log("Follow Success");
        
        checkFollow();
        countFollow();
      }
    } catch (error) {
      
    }
  }

  const checkFollow = async ()=> {
    try {
      const response = await customFetch("/api/check-follower", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          publisher_id: id
        })
      });
      if(response.ok) {
        const data = await response.json();
        console.log(data.followed);
        setIsFollow(data.followed)
      }
    } catch (error) {
      
    }
  }

  const countFollow = async ()=> {
    try {
      const response = await customFetch(`/api/count/follow/publisher/${id}`, {
        method:"GET",
      });
      if(response.ok) {
        const data = await response.json();
        setCount(data.count)
      }
    } catch (error) {
      
    }
  } 

  const countCombines = async ()=> {
    try {
      const response = await speFetch(`/api/combines/count/publisher/${id}` , {
        method:"GET"
      })
      if(response.ok) {
        const data = await response.json();
        setCombineCount(data)
        console.log(data);
      }
    } catch (error) {
      
    }
  }

  

  return (
    <div className="u-publisher-page">
      {dataLoading ? <p>Loading...</p> : (
        <div className="up-header">
          <div
            style={{
              background: `url(${data.profile_image})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition:"center"
            }}
            className="u-background-header"
          ></div>
          <div className="avatar-image-statistics">
            <div className="u-avatar-profile" style={{backgroundImage:`url(${data.avatar_image})`}}></div>
           <div className="statistics-container">
           <div className="u-cn-top">
              <p className="u-tx-p">{combineCount && combineCount.all_combine_count}</p>
              <p style={{fontWeight:"bold"}}>COMBINES</p>
            </div>
            <div className="u-cn-top">
              <p className="u-tx-p">{combineCount && combineCount.won_combine_count}</p>
              <p style={{fontWeight:"bold"}}>WON</p>
            </div>
            <div className="u-cn-top">
              <p className="u-tx-p">{combineCount && combineCount.lost_combine_count}</p>
              <p style={{fontWeight:"bold"}}>LOST</p>
            </div>
           </div>
          </div>
          <div className="u-prf-un-hed">
            <p className="u-pub-nme">{data.publisher_name}</p>
            <p>
             {data && data.desc}
            </p>
           <div className="fllow-txt">
           {isFollow ? <button onClick={follow} className="u-pr-fllowed">FOLLOWED</button> : <button onClick={follow} className="u-pr-fllow">FOLLOW</button>}
           <p style={{marginLeft:"5px"}}> {count+data.ffollowers } followers</p>
           </div>
          </div>
           <div className="tab-texts">
           <div  className={ activeTab === "tab1" ? "active-tab" : "tab"}>
           <p onClick={() => setActiveTab('tab1')}>WAITING</p>
           </div>
           <div className={ activeTab === "tab2" ? "active-tab" : "tab"} >
           <p onClick={() => setActiveTab('tab2')}>WON</p>
           </div>
           <div className={ activeTab === "tab3" ? "active-tab" : "tab"}>
           <p  onClick={() => setActiveTab('tab3')}>LOST</p>
           </div>
            
           </div>
          {activeTab === "tab1" && <OnAir publisher_id={id} />}
          {activeTab === "tab2" && <Won publisher_id={id}/>}
          {activeTab === "tab3" && <Lost publisher_id={id} />}
          
          
        </div>
      )}
       
    </div>
  );
};

export default Publisher;

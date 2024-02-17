import React, {useEffect, useState} from 'react'
import { customPubFetch } from '../../services/PublisherServices';

const Settings = () => {
    const [features,setFeatures] = useState([]);
    const [loading,setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false);
    const [pin, setPin] = useState();
    const [home_Main_Ad,  setHome_Main_Ad] = useState();
    const [home_Main_Ad_URL, setHome_Main_Ad_URL] = useState()
    const [home_ad_visible, setHome_ad_visible] = useState();
    const [pop_tipster_1, setPopTipster_1] = useState()
    const [pop_tipster_2, setPopTipster_2] = useState()
    const [pop_tipster_3, setPopTipster_3] = useState()
    const [pop_tipster_visible, set_pop_tipster_visible] = useState();
    const [today_fav_combine, set_today_fav_combine] = useState();
    const [today_fav_combine_visible, set_today_fav_combine_visible] = useState()
    const [today_vip_combine, set_today_vip_combine] = useState();
    const [today_vip_combine_visible, set_today_vip_combine_visible] = useState()
    const [post_under_image, set_post_under_image] = useState();
    const [post_under_url, set_post_under_url] = useState();
    const [post_under_visible, set_post_under_visible] = useState();
    const [landing_combine, setLanding_combine] = useState();


    useEffect(()=> {
        declare();
    }, [editMode])

    useEffect(()=> {
        getFeatures();
        
    }, [])

    const declare = ()=> {
        setHome_Main_Ad(features.home_main_ad_image);
        setHome_Main_Ad_URL(features.home_main_ad_url);
        setHome_ad_visible(features.home_main_ad_visible);
        setPopTipster_1(features.popular_tipster_1);
        setPopTipster_2(features.popular_tipster_2);
        setPopTipster_3(features.popular_tipster_3);
        set_pop_tipster_visible(features.popular_tipster_visible);
        set_today_fav_combine(features.today_fav_combine);
        set_today_fav_combine_visible(features.today_fav_combine_visible);
        set_today_vip_combine(features.today_vip_combine);
        set_today_vip_combine_visible(features.today_vip_combine_visible);
        set_post_under_image(features.post_under_ads_image);
        set_post_under_url(features.post_under_ads_url);
        set_post_under_visible(features.post_under_ads_visible);
        setLanding_combine(features.landing_combine)



    }


    const getFeatures = async ()=> {
        try {
            const response = await customPubFetch("/api/feature/", {
                method:"GET"
            })
            const data = await response.json();
            setFeatures(data)
            console.log(data);
            setLoading(false)
            declare();
        } catch (error) {
            console.log(error);
        }
    }


    const sendUpdate = async ()=> {
        try {
           const response = await customPubFetch("/api/feature", {
            headers:{"Content-Type":"application/json","pin":pin},
            
            method:"PATCH",
            body: JSON.stringify({
                home_main_ad_image : home_Main_Ad,
                home_main_ad_url : home_Main_Ad_URL,
                home_main_ad_visible : home_ad_visible,
                popular_tipster_1 : pop_tipster_1,
                popular_tipster_2 : pop_tipster_2,
                popular_tipster_3 : pop_tipster_3,
                popular_tipster_visible : pop_tipster_visible,
                today_fav_combine : today_fav_combine,
                today_fav_combine_visible : today_fav_combine_visible,
                today_vip_combine : today_vip_combine,
                today_vip_combine_visible : today_vip_combine_visible,
                post_under_ads_image : post_under_image,
                post_under_ads_url:post_under_url,
                post_under_ads_visible:post_under_visible,
                landing_combine:landing_combine






            })

           }) 
           if(response.ok) {
            console.log("Updated!");
            setEditMode(false)
            getFeatures()
        }
        } catch (error) {
            console.log(error);
        }
    }


  return (
    <div>
        {loading ? "" : 
       
        <div> 
            <input onChange={(e)=>setPin(e.target.value)} />
            <button onClick={()=> setEditMode(prevMode => !prevMode)}>EDIT</button>
         
            <div>
              <p>ID</p>
              <p>{features.id}</p>  
            </div>
            <div className='s-items'>
            <div>
              <p>Home Main Ad Image</p>
              {editMode ? <div> <input onChange={(e)=> setHome_Main_Ad(e.target.value)} value={home_Main_Ad} /> <button onClick={sendUpdate}>OK</button></div>  :<p>{features.home_main_ad_image}</p>}
              <img src={features.home_main_ad_image} width={"300px"} height={"100px"}  />
             
            </div>
            <div>
              <p>Home Main AD URL</p>
              {editMode ? <div><input onChange={(e)=> setHome_Main_Ad_URL(e.target.value)} value={home_Main_Ad_URL} /> <button onClick={sendUpdate}>OK</button> </div> : <p>{features.home_main_ad_url}</p>}
            </div>
            <div>
              <p>Home Main Ad Visible</p>
              {editMode ? <div> <input onChange={(e)=> setHome_ad_visible(e.target.value)} value={home_ad_visible} />  <button onClick={sendUpdate}>OK</button>  </div>: <p>{features.home_main_ad_visible ? "TRUE" : "FALSE"}</p>}
            </div>
            </div>
           <div className='s-items'>
           <div>
              <p>Popular Tipster 1</p>
              {editMode ? <div>  <input onChange={(e)=> setPopTipster_1(e.target.value)}  value={pop_tipster_1}/> <button onClick={sendUpdate}>OK</button>  </div> : <p>{features.popular_tipster_1}</p>}
            </div>
            <div>
              <p>Popular Tipster 2</p>
              {editMode ? <div>  <input onChange={(e)=> setPopTipster_2(e.target.value)}  value={pop_tipster_2}/> <button onClick={sendUpdate}>OK</button>  </div> : <p>{features.popular_tipster_2}</p>}
            </div>
            <div>
              <p>Popular Tipster 3</p>
              {editMode ? <div>  <input onChange={(e)=> setPopTipster_3(e.target.value)}  value={pop_tipster_3}/> <button onClick={sendUpdate}>OK</button>  </div> : <p>{features.popular_tipster_3}</p>}
            </div>
            <div>
              <p>Popular Tipster Visible</p>
              {editMode ? <div> <input value={pop_tipster_visible} onChange={(e)=> set_pop_tipster_visible(e.target.value)} /> <button onClick={sendUpdate}>OK</button> </div> : <p>{features.popular_tipster_visible ? "TRUE" : "FALSE"}</p>}
            </div>
           </div>
           <div className='s-items'>
           <div>
              <p>Today FAV Combine</p>
              {editMode ? <div><input value={today_fav_combine} onChange={(e)=> set_today_fav_combine(e.target.value)} /> <button onClick={sendUpdate}>OK</button>  </div> : <p>{features.today_fav_combine}</p>}
            </div>
            <div>
              <p>Today FAV Combine Visible</p>
              {editMode ? <div><input value={today_fav_combine_visible}  onChange={(e)=> set_today_fav_combine_visible(e.target.value)}/>  <button onClick={sendUpdate}>OK</button> </div> : <p>{features.today_fav_combine_visible ? "TRUE" : "FALSE"}</p>}
            </div>
           </div>
            
            <div className='s-items'>
            <div>
              <p>Today VIP Combine</p>
             {editMode ? <div> <input value={today_vip_combine} onChange={(e)=> set_today_vip_combine(e.target.value)}  /> <button onClick={sendUpdate}>OK</button>  </div>:  <p>{features.today_vip_combine}</p>}
            </div>
            <div>
              <p>Today VIP Combine Visible</p>
              {editMode ? <div><input value={today_vip_combine_visible} onChange={(e)=> set_today_vip_combine_visible(e.target.value)} /> <button onClick={sendUpdate}>OK</button> </div>: <p>{features.today_vip_combine_visible ? "TRUE" : "FALSE"}</p>}
            </div>
            </div>
          <div className='s-items'>
          <div>
              <p>Post Under Ad Image</p>
             {editMode ?<div> <input value={post_under_image} onChange={(e)=> set_post_under_image(e.target.value)} /> <button onClick={sendUpdate}>OK</button>  </div> :   <p>{features.post_under_ads_image}</p>}
              <img src={features.post_under_ads_image} width={"300px"} height={"100px"}  />
            </div>
            <div>
              <p>Post Under Ad URL</p>
             {editMode ? <div> <input value={post_under_url}  onChange={(e)=> set_post_under_url(e.target.value)}/> <button onClick={sendUpdate}>OK</button>  </div> :  <p>{features.post_under_ads_url}</p>}
            </div>
            <div>
              <p>Post Under Ad Visible</p>
             {editMode ? <div> <input value={post_under_visible} onChange={(e)=> set_post_under_visible(e.target.value)} /> <button onClick={sendUpdate}>OK</button> </div> : <p>{features.post_under_ads_visible ? "TRUE" : "FALSE"}</p>}
            </div>
          </div>
          <div>
            <p>Landing Combine</p>
            {editMode ? <div> <input value={landing_combine}  onChange={(e)=> setLanding_combine(e.target.value)}/> <button onClick={sendUpdate}>OK</button>  </div> :  <p>{features.landing_combine}</p>}
          </div>
        </div>}
   

    </div>
  )
}

export default Settings
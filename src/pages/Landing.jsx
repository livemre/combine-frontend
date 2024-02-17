import React, {useEffect, useState} from 'react'
import { speFetch } from '../services/Services';
import LandingCombine from './LandingCombine';
import { Link } from 'react-router-dom';


           

const Landing = () => {

  const [moreOdds, setMoreOdds] = useState();
  const [fLoading,setFLoading] = useState(true);
  const [features, setFeatures] = useState([]);

  useEffect(()=> {
    getFeatures();
   
  }, [])

  const getFeatures = async ()=> {
    console.log("selam");
    try {
      const response = await speFetch("/api/landing/feature/", {
        method:"GET"
      })
      if(response.ok) {
        const data = await response.json()
        setFeatures(data);
        if(data) {
         console.log(data);
          getMoreOdds(data.landing_combine);
        }
        console.log(data);
        setFLoading(false);
        
      }
    } catch (error) {
      
    }
  }

  const getMoreOdds = async (id) => {
    console.log("get more odds");
    try {
      const response = await speFetch(
        `/api/landing/combines-by-id/${id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("get more odds 2");

        setMoreOdds(data);
        setFLoading(false);
        
      }
    } catch (error) {}
  };


  return (
    <div className='landing-container'>
       <div className='landing-top'>
        <div className='landing-top-content'>
        <h2 style={{color:"white"}}>Access Winning Tips from Top Tipsters Worldwide!</h2>
       <h2 style={{color:"#e99322"}}>Join us</h2>
       <Link to={"/register"}><button className='landing-reg-btn'>Register Now!</button></Link>
       <h3  style={{color:"white"}}>Already have an account</h3>
       <Link to={"/login"}><button  className='landing-log-btn'>Login</button></Link>
        </div>
        
       </div>
      <div className='landing-bottom'>
      
       <h3>Latest Winning Combines</h3>
       {fLoading ? <p>Loading</p> : ""}
       {moreOdds && (
              <React.Fragment key={moreOdds.id}>
                <LandingCombine
                  key={moreOdds.id}
                  data={moreOdds}
                  publisher_page={1}
                  getCombines={getMoreOdds}
                />
              </React.Fragment>
            )}
      </div>
    </div>
  )
}

export default Landing
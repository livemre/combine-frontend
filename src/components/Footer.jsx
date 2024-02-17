import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-links'>
      <Link className="sidemenu-link" to={"mailto:info@tipsterandtipster.com"}>
        <div className="menu-item-div">    
        <p>CONTACT</p>
        </div></Link>
        <Link className="sidemenu-link" to={"/terms-of-service"}>
        <div className="menu-item-div">    
        <p>TERMS OF SERVICE</p>
        </div></Link>
        <Link className="sidemenu-link" to={"/privacy-policy"}>
        <div className="menu-item-div">    
        <p>PRIVACY POLICY</p>
        </div></Link>
      </div>

        <div className='footer-beware'>
           <Link to={"https://www.begambleaware.org/"}><div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center"}}> <img src='https://www.begambleaware.org/sites/default/files/2023-04/ga_logo_secondary_rgb_negative_gamble_0.webp' width={200} height={70} alt='begambleaware'/></div></Link>
       <p> BeGambleAware.org aims to promote responsibility in gambling. They provide information to help you make informed decisions about your gambling.</p>
       <br />
<p>Call the National Gambling Helpline</p>
<p>0808 8020 133 8am to midnight, 7 days a week.</p>
<br />
<p>We are committed to responsible gambling and have a number of ways to help you stay in control and keep gambling fun.</p>
<br />
<p>You must be 18 years old or over to use this site.
Please bet responsibly.</p>
        </div>       
                    
    </div>
  )
}

export default Footer
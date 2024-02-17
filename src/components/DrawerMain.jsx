import React, { useContext, useEffect, useState } from 'react'
import { MainContext } from '../App'
import UserMenu from './UserMenu';
import PublisherMenu from './PublisherMenu';
import NoUserMenu from './NoUserMenu';

const DrawerMain = () => {

    const { setPat, setAccessToken} = useContext(MainContext)
    const [loading, setLoading] = useState(true);
    const {accessToken, pat} = useContext(MainContext);

    const [menu,setMenu] = useState();

    useEffect(()=> {
       if(localStorage.getItem("accessToken")) {
        setAccessToken(localStorage.getItem("accessToken"))
        setLoading(false);
        setMenu(<UserMenu />)
       }
       if(localStorage.getItem("pat")) {
        setPat(localStorage.getItem("pat"))
        setLoading(false);
        setMenu(<PublisherMenu />)
       }
    }, [accessToken, pat])


   

  return (
    <div>
      {loading ? <NoUserMenu />:menu}
    </div>

  )
}

export default DrawerMain
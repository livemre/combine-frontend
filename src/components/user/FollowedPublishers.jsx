import React, {useEffect, useState} from 'react'
import { customFetch } from '../../services/Services';
import { Link } from 'react-router-dom';

const FollowedPublishers = () => {

    const [publishers,setPublishers] = useState();

    const formatLink = (name) => {
        const link = name;
        const seoLink = link.replace(/\s+/g, "-");
        return seoLink;
      };

    useEffect(()=> {
        getPublishers();
    }, [])

    const getPublishers = async ()=> {
        const response = await customFetch("/api/user/follow", {
            method:"GET"
        })
        if(response.ok) {
            const data = await response.json();
            console.log(data);
            setPublishers(data)
        }
    }

  return (
    <div style={{minHeight:"80vh"}}>
        <h4>Followed Publishers</h4>
        {publishers && publishers.map((publisher)=> {
            return <Link key={publisher.id} style={{textDecoration:"none", color:"black"}} to={`/publisher/${publisher.id}/${formatLink(publisher.publisher_name)}`}>
            <div className='publisher-card'>
                <img src={publisher.avatar_image} alt={publisher.id} width={50} height={50} />
                <p>{publisher.publisher_name}</p>
                </div>
                </Link>
        })}
    </div>
  )
}

export default FollowedPublishers
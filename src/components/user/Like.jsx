import React, { useContext, useEffect, useState } from 'react'
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { MainContext } from '../../App';
import { MdFavoriteBorder, MdFavorite  } from "react-icons/md";
import { customFetch } from '../../services/Services';

const Like = ({combineID, getCombines, isPurchased, credit, flike}) => {
    const {userID} = useContext(MainContext)
    const [isLiked, setIsLiked] = useState(false);
    const [count, setCount] = useState();
    const [likeLoading, setLikeLoading] = useState(true)


    useEffect(()=> {
        checkLike()
        countLike()
    }, [])


    const countLike = async ()=> {
        
        try {
            const response = await customFetch(`/api/count/like/combine/${combineID}`, 
            {
                method:"GET",
               
            })
            if(response.ok) {
                const data = await response.json()
                setCount(data.count)
                setLikeLoading(false);
            }
        } catch (error) {
            
        }
    }

    const like = async ()=> {
        try {
            const response = await customFetch("/api/like/", 
            {
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                    user_id:userID,
                    combine_id:combineID
                })
            })
            if(response.ok) {
                console.log("Success");
                checkLike();
                countLike();
                getCombines();
                
            }
        } catch (error) {
            
        }
    } 

    const checkLike = async ()=> {
        try {
            const response = await customFetch("/api/like/is-like", 
            {
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify({
                    user_id:userID,
                    combine_id:combineID
                })
            })
            if(response.ok) {
                const data = await response.json();
                setIsLiked(data.liked)
            }
        } catch (error) {
            
        }
    }

  return (
    <>
    <div className='u-like'>
  
{credit > 0 ? isPurchased ? isLiked ? <MdFavorite  onClick={like} color='red' size={24} /> : <MdFavoriteBorder  onClick={like} size={24} /> : <MdFavorite  color='grey' size={24} /> : isLiked ? <MdFavorite  onClick={like} color='red' size={24} /> : <MdFavoriteBorder  onClick={like} size={24} />  }

<div>
{likeLoading ? " " : <p style={{marginLeft:"5px"}}>{flike + count} users liked</p>}

</div>



</div>
   
    </>
    
  )
}

export default Like
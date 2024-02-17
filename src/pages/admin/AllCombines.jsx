import React, { useContext, useEffect,useState } from 'react'
import Combine from '../../components/Combine';
import { MainContext } from '../../App';
import NoCombine from '../../components/NoCombine';
import { NavLink } from 'react-router-dom';
import { IoArrowBackCircle } from "react-icons/io5";
import { customPubFetch } from '../../services/PublisherServices';

const AllCombines = () => {
    
    const {publisher_id,setPublisherId, publisherName} = useContext(MainContext);
    const [combines,setCombines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status,setStatus] = useState("0")
    const [isPublished, setIsPublished] = useState(false)
    const [date,setDate] = useState("2023-01-01");
    const [allCombines, setAllCombines] = useState([]);

   


 


    useEffect(()=> {
        if(publisher_id !== null) {
            getCombines();
     
        } else {
            setPublisherId(localStorage.getItem("publisher_id")); 
        }
    }, [publisher_id])

  

    useEffect(() => {
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0]; // YYYY-MM-DD formatına dönüştür
        setDate(currentDate);
    }, []);

    useEffect(()=> {
        // Date e göre combines içindeki maçları filtrele.
        filterCombines()
    },[date, isPublished, allCombines, status])
 



    const getCombines = async ()=> {
        try {
            const request = await customPubFetch(`/api/combine/publisher/${publisher_id}/`, {
                method:"GET",
                headers: {"publisher-id":publisher_id}
            })

            if(request.ok) {
                const data = await request.json();
                
                console.log(data);
                setAllCombines(data);
                setCombines(data)
                setIsLoading(false);
            }

            
        } catch (error) {
            console.log(error);
        }
    }

    const filterCombines = () => {
        const filteredCombines = allCombines.filter((item) => {
            // item.date'den yıl-ay-gün kısmını al
            const itemDateOnly = item.date.split(' ')[0];
    
            // Sadece tarih kısmını karşılaştır
            return itemDateOnly === date && item.is_published === isPublished && item.status === status;
        });
    
        setCombines(filteredCombines);
    };
    
 

  


  return (
   <div className='all-combines-container'>
   
    
   
       <div>
       <input type='date' onChange={(e) => setDate(e.target.value)} value={date}/>
    <select value={isPublished} onChange={(e) => setIsPublished(e.target.value === 'true')}>
        <option value={true}>Published</option>
        <option value={false}>Taslak</option>
    </select>
    <select value={status} onChange={(e)=> setStatus(e.target.value)}>
        <option value={"0"}>Waiting</option>
        <option value={"1"}>Won</option>
        <option value={"2"}>Lost</option>
    </select>
       </div>
        <div className='combine-list'>
        {combines && combines.length < 1 ? <NoCombine /> :combines.map((item)=> <Combine key={item.id} id={item.id} getCombines={getCombines} filterCombines={filterCombines} publisher_id={publisher_id}/>)}
        </div>
    </div>
  )
}

export default AllCombines
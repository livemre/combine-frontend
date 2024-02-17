import React, {useState} from 'react'
import { customPubFetch } from '../../services/PublisherServices';

const Transfers = () => {
    const [data,setData] = useState();
    const [trx, setTrx] = useState();
    const [userCredit, setUserCredit] = useState();
    const [pin, setPin] = useState();


    const getBalances = async ()=> {
        try {
            const response = await customPubFetch("/check-balances", {
                method:"GET",
                headers : {"pin":pin}
            })
            if(response.ok) {
                const data = await response.json();
                console.log(data);
                setData(data);
                

            }
        } catch (error) {
            console.log("Error");
        }
    }

    const transferToAddress = async (address, amount)=> {
        try {
            const response = await customPubFetch("/transfer", {
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body:JSON.stringify({
                    addressBase58 : address,
                    amount : trx
                })
            })
            if(response.ok) {
                console.log("Transfer Başarılı!");


            } else {
                console.log("Transfer başarısız");
            }
        } catch (error) {
            console.log("Error");
        }
    }


    const transferToUserCredit = async (address) => {
        try {
           const response = await customPubFetch("/api/deposit-user/by-admin", {
            method:"POST",
            headers: {"Content-Type":"application/json","pin":pin},
            body: JSON.stringify({
                credit: userCredit,
                address:address
            })
           })
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div>
        <div className='pin-div'>
        <label>Enter Super Admin PIN</label>
        <input placeholder='PIN' onChange={(e)=> setPin(e.target.value)} />
        </div>
         <button className='check-balance' onClick={getBalances}>Check Balances</button>
        {data && data.map((item)=> <div className='transfers-item-div'>
            <p style={{fontSize:"36px", color:"black"}}>{item.balance} TRX</p>
            <p style={{color:"black"}}>{item.address}</p>
           <div className='transfers-div-inp'>
           <div className='tran-div-inp'>
          <input  onChange={(e)=> setTrx(e.target.value)}/>
            <button onClick={()=> transferToAddress(item.address,(item.balance*1000000 - item.balance*100000) )}>Send to Binance</button>
            </div>

           <div className='tran-div-inp'>
           <input  onChange={(e)=> setUserCredit(e.target.value)}/>
            <button onClick={()=> transferToUserCredit(item.address)}>Send to User</button>
            </div>
           </div>
         
           
        </div>)}
       
    </div>
  )
}

export default Transfers
import React, { useContext, useEffect, useState } from 'react';
import { MainContext } from '../App';
import { convertUtcToLocalTime, customFetch } from '../services/Services';

const Transactions = () => {
  const { userID, setUserID, token } = useContext(MainContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true); // Daha fazla veri olup olmadığını kontrol et

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userID != null) {
      getTransactions();
    }
  }, [userID, page, pageSize]);

  const getUserData = async () => {
    // ... getUserData fonksiyonu kodları ...
  };

  const getTransactions = async () => {
    try {
      const response = await customFetch(`/api/transaction/${userID}?page=${page}&pageSize=${pageSize}`, {
        method: "GET"
      });

      if (response.ok) {
        const _data = await response.json();

        setData(_data.data);
        setIsLoading(false);
    
        setHasMore(_data.data.length === pageSize); // Eğer sayfa boyutu kadar veri varsa, daha fazla sayfa olduğunu varsay
      } else {
        console.log("Error get transactions");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='purchased-combines'>
      <h3 style={{ margin: "10px" }}>Transactions</h3>

      {isLoading ? <p>Loading...</p> : data && data.length < 1 ? <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}><p>NO DATA</p></div> : ""}

      {isLoading ? <p>Loading...</p> : data && data.map((item) => (
        <div key={item.id} className='transaction-item-container'>
          <p>{convertUtcToLocalTime(item.date)}</p>
          <div className='transaction-item'>
            <div className='transaction-data-amount'>
              <p className='transaction-data'>{item.data}</p>
              <p className='transaction-amount'>{item.amount} Credit</p>
            </div>
          </div>
        </div>
      ))}

      <div className="pagination-tra">
        {page > 1 && (
          <button onClick={() => setPage(page - 1)}>Previous</button>
        )}
        {hasMore && (
          <button onClick={() => setPage(page + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default Transactions;

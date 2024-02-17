import React, { useState, useEffect, useCallback, useContext } from 'react';
import Combine from '../../../pages/Combine';
import Loading from './Loading';
import NoCombine from './NoCombine';
import { MainContext } from '../../../App';
import { customFetch, sendUserLocalTime } from '../../../services/Services';

const OnAir = ({ publisher_id }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const {token} = useContext(MainContext)

  useEffect(()=> {
    if(token != null) {
      getMatches(1)
    }
  }, [token])

  const _getMatches = ()=> {
getMatches(currentPage)
  }

  const getMatches = useCallback(async (page) => {
    setIsLoading(true);

    try {
      const response = await customFetch(`/api/combines/${publisher_id}/status/0/page/${page}`, {
        method:"GET",
        

      });
      if (response.ok) {
        const newData = await response.json();
        setMatches(newData.data);
        setTotalPages(newData.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setIsLoading(false);
    }
  }, [publisher_id]);

  useEffect(() => {
    getMatches(currentPage);
  }, [currentPage, getMatches]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className='div-pub-tab-load'>
      {matches.length > 0 ? matches.map((item) => (
        <Combine
          key={item.id}
          data={item}
          publisher_page={1}
          getCombines={_getMatches}
        />
      )) : <NoCombine />}
      {isLoading && <Loading />}
      <div className="pagination">
        {currentPage > 1 && (
          <button onClick={handlePrev}>Back</button>
        )}
        <span>{currentPage} / {totalPages}</span>
        {currentPage < totalPages && (
          <button onClick={handleNext}>Next</button>
        )}
      </div>
    </div>
  );
};

export default OnAir;

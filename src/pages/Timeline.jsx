import React, { useContext, useEffect, useState } from "react";
import Combine from "./Combine";
import { MainContext } from "../App";
import { speFetch } from "../services/Services";

const Timeline = () => {
  const [data, setData] = useState();
  const date = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getCombines();
  }, []);

  const getCombines = async () => {
    try {
      const response = await speFetch(
        `/api/combines-by-date/2024-08-04`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setData(data);
      }
    } catch (error) {}
  };

  return (
    <div>
      {data &&
        data.map((item) => (
          <Combine key={item.id} data={item} publisher_page={0} />
        ))}
    </div>
  );
};

export default Timeline;

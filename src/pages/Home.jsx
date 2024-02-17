import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import Combine from "./Combine";
import Reklam from "../components/Reklam";
import { MainContext } from "../App";
import {
  customFetch,
  getCurrentDateFormatted,
  sendUserLocalTime,
  speFetch,
} from "../services/Services";
import { customPubFetch } from "../services/PublisherServices";
import Landing from "./Landing";

const Home = () => {
  const { accessToken } = useContext(MainContext);

  const [favorited, setFavorited] = useState();
  const [moreOdds, setMoreOdds] = useState();
  const [matches, setMatches] = useState();
  const [nexMatches, setNextMatches] = useState();
  //const _date = new Date().toString().split("T")[0];
  const date = getCurrentDateFormatted();
  // const [date, setDate] = useState("2024-01-21")
  const [activeHeader, setActiveHeader] = useState(null);

  const [features, setFeatures] = useState([]);
  const [fLoading, setFLoading] = useState(true);
  const [showAd, setShowAd] = useState();

  useEffect(() => {
    if (accessToken) {
      getCountry();
      getMatches();
      getNextDateMatches();
    }
  }, [accessToken]);

  useEffect(() => {
    const handleScroll = () => {
      const headers = document.querySelectorAll(".category-header");
      const contents = document.querySelectorAll(".category-content");
      const menuOffset = 90;

      let found = false;
      for (let i = 0; i < contents.length; i++) {
        const content = contents[i];
        const header = headers[i];

        if (
          window.scrollY >=
            content.offsetTop - header.offsetHeight - menuOffset &&
          window.scrollY < content.offsetTop + content.offsetHeight - menuOffset
        ) {
          setActiveHeader(header.id);
          found = true;
          break;
        }
      }

      if (!found) {
        setActiveHeader(null);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getFavoritedCombine = async (id) => {
    try {
      const response = await customFetch(`/api/combines-by-id/${id}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();

        setFavorited(data);
      }
    } catch (error) {}
  };

  const getMoreOdds = async (id) => {
    try {
      const response = await customFetch(`/api/combines-by-id/${id}`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();

        setMoreOdds(data);
      }
    } catch (error) {}
  };

  const getMatches = async () => {
    try {
      const postData = sendUserLocalTime(date);
      console.log(postData);
      const response = await customFetch(`/api/combines-by-date/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: postData,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setMatches(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getNextDateMatches = async () => {
    try {
      const postData = sendUserLocalTime(date);
      console.log(postData);
      const response = await customFetch(`/api/combines-next-matches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: postData,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setNextMatches(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFeatures = async () => {
    try {
      const response = await customFetch("/api/feature/", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setFeatures(data);
        if (data) {
          getFavoritedCombine(data.today_fav_combine);
          getMoreOdds(data.today_vip_combine);
        }
        console.log(data);
        setFLoading(false);
      }
    } catch (error) {}
  };

  const formatLink = (publisher_name) => {
    const link = publisher_name;
    const seoLink = link.replace(/\s+/g, "-");
    return seoLink;
  };

  const getCountry = async () => {
    try {
      const response = await speFetch("/api/check-user-country", {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(data.showAd);
        setShowAd(data.showAd);
        getFeatures();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {accessToken && accessToken ? (
        <div>
          {fLoading ? (
            ""
          ) : showAd == false ? (
            ""
          ) : (
            <div className="home-main-ad">
              {features.home_main_ad_visible ? (
                <a
                  href={features.home_main_ad_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="home-ad"
                    src={features.home_main_ad_image}
                    alt="main-ad"
                  />
                </a>
              ) : (
                ""
              )}
            </div>
          )}

          {fLoading ? (
            ""
          ) : features.popular_tipster_visible ? (
            <div>
              <div style={{ marginLeft: "10px" }}>
                <h3>Popular Tipsters</h3>
              </div>
              <div className="features-tipsters-avatar">
                <Link
                  className="popular-tipsters-link"
                  to={`/publisher/${features.pop_tipster_1_id}/${formatLink(
                    features.pop_tipster_1_publisher_name
                  )}`}
                >
                  {" "}
                  <div className="f-t-a-item">
                    <div
                      className="f-t-i-img"
                      style={{
                        backgroundImage: `url(${features.pop_tipster_1_avatar_image})`,
                      }}
                    ></div>
                    <p>{features.pop_tipster_1_publisher_name}</p>
                  </div>
                </Link>

                <Link
                  className="popular-tipsters-link"
                  to={`/publisher/${features.pop_tipster_2_id}/${formatLink(
                    features.pop_tipster_2_publisher_name
                  )}`}
                >
                  {" "}
                  <div className="f-t-a-item">
                    <div
                      className="f-t-i-img"
                      style={{
                        backgroundImage: `url(${features.pop_tipster_2_avatar_image})`,
                      }}
                    ></div>
                    <p>{features.pop_tipster_2_publisher_name}</p>
                  </div>
                </Link>

                <Link
                  className="popular-tipsters-link"
                  to={`/publisher/${features.pop_tipster_3_id}/${formatLink(
                    features.pop_tipster_3_publisher_name
                  )}`}
                >
                  {" "}
                  <div className="f-t-a-item">
                    <div
                      className="f-t-i-img"
                      style={{
                        backgroundImage: `url(${features.pop_tipster_3_avatar_image})`,
                      }}
                    ></div>
                    <p>{features.pop_tipster_3_publisher_name}</p>
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            ""
          )}

          {fLoading ? (
            ""
          ) : features.today_fav_combine_visible ? (
            <>
              <div style={{ marginLeft: "10px" }}>
                <h3>Today's Favorited Combine</h3>
              </div>

              <div>
                {favorited && (
                  <React.Fragment key={favorited.id}>
                    <Combine
                      key={favorited.id}
                      data={favorited}
                      publisher_page={0}
                      getCombines={getFavoritedCombine}
                    />
                  </React.Fragment>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          {fLoading ? (
            ""
          ) : features.today_vip_combine_visible ? (
            <>
              <div style={{ marginLeft: "10px" }}>
                <h3>Today's VIP Combine</h3>
              </div>
              <div>
                {moreOdds && (
                  <React.Fragment key={moreOdds.id}>
                    <Combine
                      key={moreOdds.id}
                      data={moreOdds}
                      publisher_page={0}
                      getCombines={getMoreOdds}
                    />
                  </React.Fragment>
                )}
              </div>
            </>
          ) : (
            ""
          )}

          <div style={{ marginLeft: "10px" }}>
            <h3>Today's All Combines</h3>
          </div>
          <div>
            {matches &&
              matches.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Combine
                    key={item.id}
                    data={item}
                    publisher_page={0}
                    getCombines={getMatches}
                  />
                  {features && features.post_under_ads_visible
                    ? !fLoading
                      ? index % 3 === 2 && (
                          <a
                            href={features.post_under_ads_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            <img
                              className="home-ad"
                              src={features.post_under_ads_image}
                              width={"100px"}
                              alt="main-ad"
                            />
                          </a>
                        )
                      : ""
                    : ""}
                </React.Fragment>
              ))}
          </div>
          {nexMatches && nexMatches.length > 0 ? (
            <div style={{ marginLeft: "10px" }}>
              <h3>Upcoming Combines</h3>
            </div>
          ) : (
            ""
          )}
          <div>
            {nexMatches &&
              nexMatches.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Combine
                    key={item.id}
                    data={item}
                    publisher_page={0}
                    getCombines={getMatches}
                  />
                  {showAd == true
                    ? features && features.post_under_ads_visible
                      ? !fLoading
                        ? index % 3 === 2 && (
                            <a
                              href={features.post_under_ads_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {" "}
                              <img
                                className="home-ad"
                                src={features.post_under_ads_image}
                                width={"100px"}
                                alt="main-ad"
                              />
                            </a>
                          )
                        : ""
                      : ""
                    : ""}
                </React.Fragment>
              ))}
          </div>
        </div>
      ) : (
        <Landing />
      )}
    </>
  );
};

export default Home;

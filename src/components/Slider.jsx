import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../firebase";

import Spinner from "./Spinner";

const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);
      const documents = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(documents);
      setLoading(false);
    };
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }

  return (
    listings.length > 0 && (
      <>
        <p className="exploreHeading">Recommended</p>

        <Swiper
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {listings.map((listing) => {
            return (
              <SwiperSlide
                key={listing.id}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/category/${listing.type}/${listing.id}`)
                }
              >
                <div
                  style={{
                    background: `url(${listing.imgUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                    padding: "150px",
                  }}
                  className="swipeSlideDiv"
                >
                  <p className="swiperSlideText">{listing.name}</p>
                  <p className="swiperSlidePrice">
                    ${listing.discountedPrice ?? listing.regularPrice}{" "}
                    {listing.type === "rent" && "/ month"}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    )
  );
};

export default Slider;

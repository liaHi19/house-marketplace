import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";

import { db } from "../firebase";
import { formatMoney } from "../helpers/formating";

import Spinner from "../components/Spinner";
import shareIcon from "../assets/svg/shareIcon.svg";

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async (id) => {
      try {
        const docSnap = await getDoc(doc(db, "listings", id));

        if (docSnap.exists()) {
          const document = { id: docSnap.id, ...docSnap.data() };
          setListing(document);
          setLoading(false);
        } else {
          throw new Error("Can't load a listing");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchListing(params.listingId);
  }, [navigate, params.listingId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShareLinkCopied(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [shareLinkCopied]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <main>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            style={{ height: "400px" }}
          >
            {listing.imgUrls.map((url, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    className="swiperSlideDiv"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div
            className="shareIconDiv"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShareLinkCopied(true);
            }}
          >
            <img src={shareIcon} alt="share link" />
          </div>
          {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
          <div className="listingDetails">
            <p className="listingName">
              {listing.name} -{" "}
              {listing.offer
                ? formatMoney(listing.discountedPrice)
                : formatMoney(listing.regularPrice)}
            </p>
            <p className="listingLocation">{listing.address}</p>
            <p className="listingType">
              For {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className="discountPrice">
                {formatMoney(listing.regularPrice - listing.discountedPrice)}{" "}
                discount
              </p>
            )}
            <ul className="listingDetailsList">
              <li>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "1 Bedroom"}
              </li>
              <li>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : "1 Bathroom"}
              </li>
              <li>{listing.parking && "Parking Spot"}</li>
              <li>{listing.furnished && "Furnished"}</li>
            </ul>
            <p className="listingLocationTitle">Location</p>
            <div className="leafletContainer">
              <MapContainer
                style={{ height: "100%", width: "100%" }}
                center={[listing.geolocation.lat, listing.geolocation.lng]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[listing.geolocation.lat, listing.geolocation.lng]}
                >
                  <Popup>{listing.address}</Popup>
                </Marker>
              </MapContainer>
            </div>
            {auth.currentUser?.uid !== listing.userRef && (
              <Link
                to={`/contact/${listing.userRef}?listingName=${listing?.name}`}
                className="primaryButton"
              >
                Contact Landlord
              </Link>
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default Listing;

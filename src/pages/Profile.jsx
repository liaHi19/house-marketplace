import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

import ListingItem from "../components/ListingItem";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    email: auth.currentUser.email,
    name: auth.currentUser.displayName,
  });

  const { email, name } = formData;

  useEffect(() => {
    const fetchUserListings = async (userId) => {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where("userRef", "==", userId),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);

      const documents = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(documents);
      setLoading(false);
    };

    fetchUserListings(auth.currentUser.uid);
  }, [auth.currentUser?.uid]);

  const onLogOut = () => {
    auth.signOut();
    navigate("/sign-in");
  };

  const onChangeFormData = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error("Could not update profileDetails");
    }
  };

  const onChangeDetails = () => {
    changeDetails && onSubmit();
    setChangeDetails((prev) => !prev);
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteDoc(doc(db, "listings", id));
        const updatedListings = listings.filter((listing) => listing.id !== id);
        setListings(updatedListings);
        toast.success("Successfully deleted listing");
      } catch (error) {
        toast.error("Can't delete listing");
      }
    }
  };

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button className="logOut" type="button" onClick={onLogOut}>
          LogOut
        </button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={onChangeDetails}>
            {changeDetails ? "done" : "change"}
          </p>
        </div>
        <div className="profileCard">
          <input
            className={!changeDetails ? "profileName" : "profileNameActive"}
            type="text"
            name="name"
            disabled={!changeDetails}
            value={name}
            onChange={onChangeFormData}
          />{" "}
          <input
            className={!changeDetails ? "profileEmail" : "profileEmailActive"}
            type="email"
            name="email"
            disabled={!changeDetails}
            value={email}
            onChange={onChangeFormData}
          />
        </div>
        <Link className="createListing" to="/create-listing">
          <img src={homeIcon} alt="home" />
          <p>Sell or rent your home</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listing</p>
            <ul className="listingsList">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing}
                  id={listing.id}
                  onDelete={() => onDelete(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;

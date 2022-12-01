import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  where,
  query,
  limit,
  orderBy,
  startAfter,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

const useListings = ({ dbField, value }, limitNumber = 10) => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchListing] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, [typeof value === "string" && value]);

  const fetchListings = async () => {
    try {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where(dbField, "==", value),
        orderBy("timestamp", "desc"),
        limit(limitNumber)
      );

      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);

      const listings = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings(listings);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  //Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        where(dbField, "==", value),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(limitNumber)
      );

      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchListing(lastVisible);

      const listings = querySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setListings((prev) => [...prev, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch listings");
    }
  };

  const onDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteDoc(doc(db, "listings", id));
        const updatedListings = listings.filter((listing) => listing.id !== id);
        setListings(updatedListings);
        toast.success("Listing is deleted successfully");
      } catch (error) {
        toast.error("Can't delete listing");
      }
    }
  };

  const onEdit = async (listingId) => {
    navigate(`/edit-listing/${listingId}`);
  };

  return {
    listings,
    loading,
    lastFetchedListing,
    limitNumber,
    onFetchMoreListings,
    onDelete,
    onEdit,
  };
};

export default useListings;

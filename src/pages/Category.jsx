import React from "react";
import { useParams } from "react-router-dom";

import useListings from "../hooks/useListings";

import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Category = () => {
  const params = useParams();
  const {
    listings,
    loading,
    onFetchMoreListings,
    lastFetchedListing,
    limitNumber,
  } = useListings({ dbField: "type", value: params.categoryName });

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          {params.categoryName === "rent"
            ? "Places for rent"
            : "Places for sale"}
        </p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing} />
              ))}
            </ul>
          </main>
          {lastFetchedListing && listings.length % limitNumber === 0 && (
            <button className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </button>
          )}
        </>
      ) : (
        <p>No Listings for {params.categoryName}</p>
      )}
    </div>
  );
};

export default Category;

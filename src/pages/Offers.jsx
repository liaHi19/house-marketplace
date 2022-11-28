import React from "react";

import useListings from "../hooks/useListings";

import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const {
    listings,
    loading,
    onFetchMoreListings,
    lastFetchedListing,
    limitNumber,
  } = useListings({ dbField: "offer", value: true });

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
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
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </div>
  );
};

export default Offers;

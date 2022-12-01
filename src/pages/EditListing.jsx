import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useListing from "../hooks/useListing";
import { getAuth } from "firebase/auth";

import Spinner from "../components/Spinner";
import FormListing from "../components/FormListing";

const EditListing = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const { loading, listing } = useListing();

  useEffect(() => {
    if (listing && listing.useRef !== auth.currentUser?.uid) {
      toast.error("You can't edit that listing");
      navigate("/");
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, auth.currentUser?.uid]);

  return loading ? <Spinner /> : <FormListing />;
};

export default EditListing;

import React from "react";

import useListing from "../hooks/useListing";
import Spinner from "../components/Spinner";
import FormListing from "../components/FormListing";

const CreateListing = () => {
  const { loading } = useListing();
  return loading ? <Spinner /> : <FormListing />;
};

export default CreateListing;

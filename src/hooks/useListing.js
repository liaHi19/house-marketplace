import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import {
  getDoc,
  doc,
  serverTimestamp,
  addDoc,
  collection,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { db } from "../firebase";

const useListing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  //eslint-disable-next-line
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);

  const isMounted = useRef(true);
  const auth = getAuth();

  const navigate = useNavigate();
  const params = useParams();
  const edit = !!params.listingId;

  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    address,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  useEffect(() => {
    const fetchListing = async (listingId) => {
      try {
        setLoading(true);
        const docRef = doc(db, "listings", listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const document = { id: docSnap.id, ...docSnap.data() };
          setListing(document);
          edit && setFormData({ ...docSnap.data() });
          setLoading(false);
        } else {
          navigate("/");
          throw new Error("Listing does not exist");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (!edit) return;
    fetchListing(params.listingId);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, params.listingId]);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }
    return () => {
      isMounted.current = false;
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (discountedPrice >= regularPrice) {
      toast.error("DiscountedPrice needs to be less than regularPrice");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }

    let geolocation = {};

    if (geolocationEnabled) {
      try {
        const response = await fetch(
          `http://api.positionstack.com/v1/forward?access_key=${process.env.REACT_APP_GEOLOCATION_KEY}&query=${address}`
        );
        const data = await response.json();
        if (!data?.data.length) {
          throw new Error("Check address. Can't find the address");
        } else {
          geolocation.lat = data.data[0]?.latitude ?? 0;
          geolocation.lng = data.data[0]?.longitude ?? 0;
        }
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }
    // store image in firebase

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, `images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Can't upload images");
      return;
    });
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    const docRefSnap = edit
      ? await updateDoc(doc(db, "listings", params.listingId), formDataCopy)
      : await addDoc(collection(db, "listings"), formDataCopy);

    setLoading(false);
    toast.success("Listing saved");
    navigate(
      `/category/${formDataCopy.type}/${
        edit ? params.listingId : docRefSnap.id
      }`
    );
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = false;
    }

    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }
    if (!e.target.files) {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: boolean ?? value,
      }));
    }
  };

  return {
    edit,
    loading,
    listing,
    formData,
    geolocationEnabled,
    onMutate,
    onSubmit,
  };
};

export default useListing;

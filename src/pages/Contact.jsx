import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

import { db } from "../firebase";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [landlord, setLandLord] = useState(null);
  //eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {
    const getLandlord = async (id) => {
      try {
        const docSnap = await getDoc(doc(db, "users", id));
        if (docSnap.exists()) {
          const document = { id: docSnap.id, ...docSnap.data() };
          setLandLord(document);
        } else {
          throw new Error("Could not get landlord data");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    getLandlord(params.landlordId);
  }, [params.landlordId]);

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact LandLord</p>
      </header>

      {landlord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord?.name}</p>
          </div>

          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message" className="messageLabel">
                Message
              </label>
              <textarea
                className="textarea"
                name="message"
                id="message"
                required
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
            </div>
            <a
              href={`mailto:${landlord?.email}?Subject=${searchParams.get(
                "listingName"
              )}&body=${message}`}
            >
              <button
                type="button"
                className="primaryButton"
                disabled={message.length < 3}
              >
                Send Message
              </button>
            </a>
          </form>
        </main>
      )}
    </div>
  );
};

export default Contact;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ContactUsSection from "../../component/landingpage/ContactUsSection";
import { api } from "../../utils/app";
import PageLoader from "../../component/common/PageLoader";

const API_URL = import.meta.env.VITE_API_URL;

const ContactPage = () => {
  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/settings-all`);

      if (response.data?.success) {
        setContactInfo(response.data.data);
      } else {
        toast.error("Failed to load contact information");
      }
    } catch (error) {
      console.error("Contact info error:", error);
      toast.error("Error loading contact information");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <ContactUsSection contactInfo={contactInfo} />
    </>
  );
};

export default ContactPage;

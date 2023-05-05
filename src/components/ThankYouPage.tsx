import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

export const ThankYouPage = () => {
  useEffect(() => {
    toast.success("Form submitted successfully");
  }, []);

  return (
    <>
      <ToastContainer />
      <h1>Thank you.</h1>;
    </>
  );
};

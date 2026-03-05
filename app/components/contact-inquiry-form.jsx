"use client";

import { useState } from "react";
import { useAuth } from "../context/auth-context";

const WHATSAPP_NUMBER = "919979979688";

export function ContactInquiryForm({
  initialInquiryType = "",
  initialMessage = "",
}) {
  const { user } = useAuth();
  const allowedInquiryTypes = new Set([
    "Medicine Availability",
    "Order Support",
    "Bulk Purchase",
    "Prescription Help",
  ]);
  const safeInitialInquiryType = allowedInquiryTypes.has(initialInquiryType)
    ? initialInquiryType
    : "Medicine Availability";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: safeInitialInquiryType,
    message: initialMessage || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let messageLines = [
      "*New Customer Inquiry*",
      "Rudraksh Pharmacy",
      "",
      `Inquiry Type: ${formData.inquiryType}`,
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone || "Not provided"}`,
    ];

    // Add delivery details if user is logged in
    if (user) {
      messageLines.push(
        `Delivery Address: ${user.address || "Not provided"}`,
        `Pin Code: ${user.pincode || "Not provided"}`
      );
    }

    messageLines.push(
      "",
      `Message: ${formData.message}`,
      "",
      "Please share medicine availability and next steps."
    );

    const text = messageLines.join("\n");

    const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <form className="content-card contact-form" aria-label="Contact form" onSubmit={handleSubmit}>
      <h2>Send an Inquiry</h2>
      <p className="contact-form-subtitle">
        Share your requirement and get a fast response from our support team.
      </p>

      <label htmlFor="inquiryType">Inquiry Type</label>
      <select
        id="inquiryType"
        name="inquiryType"
        required
        value={formData.inquiryType}
        onChange={handleChange}
      >
        <option>Medicine Availability</option>
        <option>Order Support</option>
        <option>Bulk Purchase</option>
        <option>Prescription Help</option>
      </select>

      <label htmlFor="name">Full Name</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Your name"
        required
        value={formData.name}
        onChange={handleChange}
      />

      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="you@example.com"
        required
        value={formData.email}
        onChange={handleChange}
      />

      <label htmlFor="phone">Mobile Number</label>
      <input
        id="phone"
        name="phone"
        type="tel"
        inputMode="numeric"
        placeholder="10-digit number"
        value={formData.phone}
        onChange={handleChange}
      />

      <label htmlFor="message">Message</label>
      <textarea
        id="message"
        name="message"
        rows="5"
        placeholder="Example: I need BP medicine and delivery by today."
        required
        value={formData.message}
        onChange={handleChange}
      />

      <button type="submit" className="primary-btn">
        Send Inquiry on WhatsApp
      </button>
    </form>
  );
}

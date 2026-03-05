"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import {
  isOrderDelivered,
  readOrdersForUser,
  writeOrdersForUser,
} from "../lib/order-client";

function formatOrderDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function readOrders(userId) {
  return readOrdersForUser(userId);
}

function buildFormData(user, profile) {
  const savedProfile = profile?.customerProfile || {};
  return {
    fullName: savedProfile.fullName || user.name || "",
    mobileNumber: savedProfile.mobileNumber || user.phone || "",
    email: savedProfile.email || user.email || "",
    address: savedProfile.address || "",
    city: savedProfile.city || "",
    pincode: savedProfile.pincode || "",
  };
}

function hasRequiredProfileFields(profile) {
  const customerProfile = profile?.customerProfile || {};
  const requiredFields = ["fullName", "mobileNumber", "email", "address", "city", "pincode"];
  return requiredFields.every((field) => String(customerProfile[field] || "").trim());
}

function getInitials(name) {
  const words = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) {
    return "CU";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
}

function formatMemberSince(dateString) {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) {
    return "Member since recently";
  }

  return `Member since ${new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(parsedDate)}`;
}

function CustomerProfileContent({
  user,
  getCurrentProfile,
  logout,
}) {
  const router = useRouter();
  const profileSnapshot = useMemo(() => getCurrentProfile(), [getCurrentProfile]);
  const [formData, setFormData] = useState(() => buildFormData(user, profileSnapshot));
  const [orders, setOrders] = useState(() => readOrders(user.id));
  const [otpOrderId, setOtpOrderId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [otpMessageOrderId, setOtpMessageOrderId] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    setFormData(buildFormData(user, profileSnapshot));
  }, [profileSnapshot, user]);

  function handleFieldChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function markOrderAsDelivered(orderId) {
    if (!orderId) {
      return;
    }

    const nextOrders = orders.map((order) => {
      if (order.id !== orderId) {
        return order;
      }

      return {
        ...order,
        deliveryStatus: "delivered",
        deliveredAt: new Date().toISOString(),
      };
    });

    setOrders(nextOrders);
    writeOrdersForUser(user.id, nextOrders);
  }

  function resolveOtpPayload() {
    const safeEmail = String(formData.email || user.email || "").trim().toLowerCase();
    const safeMobile = String(formData.mobileNumber || user.phone || "").replace(/\D/g, "");
    const safeWhatsapp = String(formData.whatsappNumber || "").replace(/\D/g, "");

    const identifier = safeEmail || safeMobile;
    return {
      identifier,
      email: safeEmail,
      mobileNumber: safeMobile,
      whatsappNumber: safeWhatsapp,
    };
  }

  async function requestDeliveryOtp(orderId) {
    const payload = resolveOtpPayload();
    if (!payload.identifier) {
      setOtpMessageOrderId(orderId);
      setOtpMessage("Add email or mobile in profile to receive OTP.");
      return;
    }

    setSendingOtp(true);
    setOtpMessageOrderId(orderId);
    setOtpMessage("");

    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Failed to send OTP.");
      }

      setOtpOrderId(orderId);
      setOtpIdentifier(payload.identifier);
      setOtpMessage("OTP sent. Enter OTP to confirm delivery.");
      setOtpCode("");
    } catch (error) {
      setOtpMessage(error?.message || "Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  }

  async function verifyDeliveryOtp(orderId) {
    const safeCode = String(otpCode || "").trim();
    if (!safeCode || safeCode.length < 4) {
      setOtpMessageOrderId(orderId);
      setOtpMessage("Enter a valid OTP.");
      return;
    }

    if (!otpIdentifier) {
      setOtpMessageOrderId(orderId);
      setOtpMessage("Please request OTP again.");
      return;
    }

    setVerifyingOtp(true);
    setOtpMessageOrderId(orderId);
    setOtpMessage("");

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: otpIdentifier,
          otp: safeCode,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "OTP verification failed.");
      }

      markOrderAsDelivered(orderId);
      setOtpOrderId("");
      setOtpCode("");
      setOtpIdentifier("");
      setOtpMessage("Delivery verified and marked as delivered.");
    } catch (error) {
      setOtpMessage(error?.message || "OTP verification failed.");
    } finally {
      setVerifyingOtp(false);
    }
  }

  function renderOrder(order, isRecent = false) {
    const delivered = isOrderDelivered(order);

    return (
      <article key={order.id} className={`profile-order-card${isRecent ? " recent" : ""}`}>
        {isRecent ? <p className="profile-order-kicker">Most Recent Order</p> : null}
        {isRecent ? <h3>{order.id}</h3> : <h4>{order.id}</h4>}
        <p>{formatOrderDate(order.createdAt)}</p>
        <p>Total: Rs {order.totalAmount}</p>
        <p>Items: {order.itemCount}</p>
        <p className={`order-status ${delivered ? "ok" : "pending"}`}>
          Delivery Status: {delivered ? "Delivered" : "Processing"}
        </p>

        {!delivered ? (
          <div className="order-otp-wrap">
            {otpOrderId === order.id ? (
              <div className="order-otp-verify">
                <input
                  type="text"
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, ""))}
                  placeholder="Enter OTP"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => verifyDeliveryOtp(order.id)}
                  disabled={verifyingOtp}
                >
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => requestDeliveryOtp(order.id)}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? "Sending..." : "Resend OTP"}
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setOtpOrderId("");
                    setOtpCode("");
                    setOtpIdentifier("");
                    setOtpMessage("");
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => requestDeliveryOtp(order.id)}
                disabled={sendingOtp}
              >
                {sendingOtp ? "Sending OTP..." : "Confirm Delivery via OTP"}
              </button>
            )}
            {otpMessageOrderId === order.id && otpMessage ? (
              <p className="order-review-note">{otpMessage}</p>
            ) : null}
          </div>
        ) : null}

        {Array.isArray(order.items) && order.items.length ? (
          <div className="order-review-items">
            <p>Review Eligible Items</p>
            <ul>
              {order.items.map((item) => (
                <li key={`${order.id}-${item.id}`}>
                  <span>{item.name}</span>
                  {delivered ? (
                    <Link href={`/products/${item.id}/reviews`} className="secondary-btn">
                      Review
                    </Link>
                  ) : (
                    <span className="order-review-note">Available after delivery</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </article>
    );
  }

  const mostRecentOrder = orders[0] || null;
  const previousOrders = orders.slice(1);
  const displayName = formData.fullName || user.name || "Customer";
  const contactEmail = formData.email || user.email || "Not added";
  const contactMobile = formData.mobileNumber || user.phone || "Not added";
  const contactAddress = formData.address || "Not added";
  const contactCity = formData.city || "Not added";
  const contactPincode = formData.pincode || "Not added";
  const memberDate = mostRecentOrder?.createdAt || new Date().toISOString();

  return (
    <section className="section section-soft customer-profile-page">
      <div className="container profile-layout-modern">
        <aside className="profile-side-column">
          <article className="profile-identity-card">
            <div className="profile-avatar-circle">{getInitials(displayName)}</div>
            <h2>{displayName}</h2>
            <p>{formatMemberSince(memberDate)}</p>

            <div className="profile-identity-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => router.push("/profile/setup?next=/profile")}
              >
                Edit Profile
              </button>
              <button type="button" className="secondary-btn danger-outline" onClick={logout}>
                Log Out
              </button>
            </div>
          </article>

          <article className="profile-contact-card">
            <h3>Contact Information</h3>
            <ul>
              <li>
                <span>Name</span>
                <strong>{displayName}</strong>
              </li>
              <li>
                <span>Email</span>
                <strong>{contactEmail}</strong>
              </li>
              <li>
                <span>Phone</span>
                <strong>{contactMobile}</strong>
              </li>
              <li>
                <span>Address</span>
                <strong>{contactAddress}</strong>
              </li>
              <li>
                <span>City</span>
                <strong>{contactCity}</strong>
              </li>
              <li>
                <span>Pincode</span>
                <strong>{contactPincode}</strong>
              </li>
            </ul>
          </article>

        </aside>

        <section className="profile-main-column profile-orders-wrap" aria-label="Customer orders">
          <h2>Order Information</h2>
          {mostRecentOrder ? (
            renderOrder(mostRecentOrder, true)
          ) : (
            <article className="profile-order-card">
              <p>No recent order found.</p>
            </article>
          )}

          <div className="profile-previous-orders">
            <h3>Previous Orders</h3>
            {previousOrders.length ? (
              <div className="profile-order-grid">
                {previousOrders.map((order) => renderOrder(order))}
              </div>
            ) : (
              <article className="profile-order-card">
                <p>No previous orders available.</p>
              </article>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}

export function CustomerProfileView() {
  const router = useRouter();
  const { user, isHydrated, getCurrentProfile, hasCompletedProfile, logout } = useAuth();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!user) {
      router.replace("/login?next=/profile");
      return;
    }

    if (!hasCompletedProfile()) {
      router.replace("/profile/setup?next=/profile");
    }
  }, [hasCompletedProfile, isHydrated, router, user]);

  if (!isHydrated || !user) {
    return null;
  }

  return (
    <CustomerProfileContent
      key={user.id}
      user={user}
      getCurrentProfile={getCurrentProfile}
      logout={logout}
    />
  );
}

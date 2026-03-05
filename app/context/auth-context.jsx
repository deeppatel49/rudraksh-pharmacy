"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
const LEGACY_STORAGE_KEY = "rudraksha_auth_user";
const CURRENT_USER_KEY = "rudraksha_auth_current_user_id";
const PROFILES_STORAGE_KEY = "rudraksha_auth_profiles";
const PHONE_EMAIL_SUFFIX = "@rudraksha.local";
const REQUIRED_PROFILE_FIELDS = [
  "fullName",
  "mobileNumber",
  "whatsappNumber",
  "email",
  "address",
  "city",
  "pincode",
];

function createUserId(email) {
  return `user_${email.trim().toLowerCase()}`;
}

function normalizeIdentifier(rawIdentifier) {
  const rawValue = String(rawIdentifier || "").trim();
  const email = rawValue.toLowerCase();
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (looksLikeEmail) {
    return {
      type: "email",
      email,
      phone: null,
    };
  }

  const phoneDigits = rawValue.replace(/\D/g, "");
  const looksLikePhone = phoneDigits.length >= 10 && phoneDigits.length <= 15;
  if (looksLikePhone) {
    return {
      type: "phone",
      email: `phone${phoneDigits}${PHONE_EMAIL_SUFFIX}`,
      phone: phoneDigits,
    };
  }

  return null;
}

function toSessionUser(profile) {
  const customerProfile = profile?.customerProfile || {};
  return {
    id: profile.id,
    name: customerProfile.fullName || profile.name || "Customer",
    fullName: customerProfile.fullName,
    email: profile.email,
    phone: profile.phone || null,
    mobileNumber: customerProfile.mobileNumber,
    whatsappNumber: customerProfile.whatsappNumber,
    address: customerProfile.address,
    city: customerProfile.city,
    pincode: customerProfile.pincode,
  };
}

function isProfileComplete(profile) {
  const customerProfile = profile?.customerProfile || {};
  return REQUIRED_PROFILE_FIELDS.every((field) => String(customerProfile[field] || "").trim());
}

function readProfilesFromStorage() {
  try {
    return JSON.parse(window.localStorage.getItem(PROFILES_STORAGE_KEY) || "{}") || {};
  } catch {
    return {};
  }
}

function writeProfilesToStorage(profiles) {
  window.localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
}

function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function resolveUserIdFromIdentifier(identifier, profiles) {
  const normalized = normalizeIdentifier(identifier);
  if (!normalized) {
    return null;
  }

  const directUserId = createUserId(normalized.email);
  if (profiles[directUserId]) {
    return directUserId;
  }

  const targetEmail = normalized.type === "email" ? normalized.email : "";
  const targetDigits = normalized.type === "phone" ? normalized.phone : normalizeDigits(identifier);

  for (const [userId, profile] of Object.entries(profiles)) {
    const profileEmail = String(profile?.email || "").trim().toLowerCase();
    const profilePhone = normalizeDigits(profile?.phone);
    const profileMobile = normalizeDigits(profile?.customerProfile?.mobileNumber);
    const profileWhatsapp = normalizeDigits(profile?.customerProfile?.whatsappNumber);

    if (targetEmail && profileEmail === targetEmail) {
      return userId;
    }

    if (targetDigits && (profilePhone === targetDigits
      || profileMobile === targetDigits
      || profileWhatsapp === targetDigits)) {
      return userId;
    }
  }

  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const currentUserId = window.localStorage.getItem(CURRENT_USER_KEY);
      const profiles = readProfilesFromStorage();

      if (currentUserId && profiles?.[currentUserId]) {
        setUser(toSessionUser(profiles[currentUserId]));
      } else {
        const rawLegacyUser = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (rawLegacyUser) {
          const legacyUser = JSON.parse(rawLegacyUser);
          const userId = createUserId(legacyUser.email || "guest@rudraksha.local");
          const safeProfile = {
            id: userId,
            name: legacyUser.name || "Customer",
            email: (legacyUser.email || "").trim().toLowerCase(),
            phone: null,
            password: "",
            customerProfile: null,
          };
          writeProfilesToStorage({ [userId]: safeProfile });
          window.localStorage.setItem(CURRENT_USER_KEY, userId);
          window.localStorage.removeItem(LEGACY_STORAGE_KEY);
          setUser(toSessionUser(safeProfile));
        }
      }
    } catch (error) {
      console.error("Failed to restore auth state:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const value = useMemo(() => {
    const login = (payload) => {
      const safeEmail = payload.email.trim().toLowerCase();
      const userId = createUserId(safeEmail);
      const profiles = readProfilesFromStorage();
      const existingProfile = profiles[userId];
      const safeProfile = {
        ...existingProfile,
        id: userId,
        name: payload.name || existingProfile?.name || "Customer",
        email: safeEmail,
        phone: existingProfile?.phone || null,
        password: existingProfile?.password || "",
        customerProfile: existingProfile?.customerProfile || null,
      };

      writeProfilesToStorage({
        ...profiles,
        [userId]: safeProfile,
      });
      window.localStorage.setItem(CURRENT_USER_KEY, userId);

      const sessionUser = toSessionUser(safeProfile);
      setUser(sessionUser);
      return sessionUser;
    };

    const registerWithPassword = ({
      name,
      identifier,
      mobileNumber,
      password,
      autoLogin = true,
    }) => {
      const normalized = normalizeIdentifier(identifier);
      if (!normalized) {
        throw new Error("Enter a valid mobile number or email address.");
      }

      const safeMobileNumber = String(mobileNumber || "").replace(/\D/g, "");
      if (safeMobileNumber.length < 10 || safeMobileNumber.length > 15) {
        throw new Error("Enter a valid mobile number.");
      }

      const safePassword = String(password || "");
      if (safePassword.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      const userId = createUserId(normalized.email);
      const profiles = readProfilesFromStorage();
      const existingProfile = profiles[userId];

      if (existingProfile?.password) {
        throw new Error("Account already exists. Please sign in.");
      }

      const safeProfile = {
        ...existingProfile,
        id: userId,
        name: String(name || "").trim() || existingProfile?.name || "Customer",
        email: normalized.email,
        phone: safeMobileNumber || normalized.phone || existingProfile?.phone || null,
        password: safePassword,
        customerProfile: existingProfile?.customerProfile || null,
      };

      writeProfilesToStorage({
        ...profiles,
        [userId]: safeProfile,
      });

      const sessionUser = toSessionUser(safeProfile);
      if (autoLogin) {
        window.localStorage.setItem(CURRENT_USER_KEY, userId);
        setUser(sessionUser);
      }
      return sessionUser;
    };

    const loginWithPassword = ({ identifier, password }) => {
      const normalized = normalizeIdentifier(identifier);
      if (!normalized) {
        throw new Error("Enter a valid mobile number or email address.");
      }

      const safePassword = String(password || "");
      const profiles = readProfilesFromStorage();
      const userId = resolveUserIdFromIdentifier(identifier, profiles);
      const existingProfile = userId ? profiles[userId] : null;

      if (!existingProfile) {
        throw new Error("Account not found. Please create account.");
      }

      if (!existingProfile.password) {
        throw new Error("This account uses Google sign-in. Use Continue with Google.");
      }

      if (existingProfile.password !== safePassword) {
        throw new Error("Invalid password.");
      }

      window.localStorage.setItem(CURRENT_USER_KEY, userId);
      const sessionUser = toSessionUser(existingProfile);
      setUser(sessionUser);
      return sessionUser;
    };

    const resetPassword = ({ identifier, newPassword }) => {
      const normalized = normalizeIdentifier(identifier);
      if (!normalized) {
        throw new Error("Enter a valid mobile number or email address.");
      }

      const safePassword = String(newPassword || "");
      if (safePassword.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      const profiles = readProfilesFromStorage();
      const userId = resolveUserIdFromIdentifier(identifier, profiles);
      const existingProfile = userId ? profiles[userId] : null;

      if (!existingProfile) {
        throw new Error("Account not found. Please create account.");
      }

      const updatedProfile = {
        ...existingProfile,
        id: existingProfile.id,
        email: existingProfile.email,
        phone: existingProfile.phone || normalized.phone || null,
        password: safePassword,
        customerProfile: existingProfile?.customerProfile || null,
      };

      writeProfilesToStorage({
        ...profiles,
        [userId]: updatedProfile,
      });

      return toSessionUser(updatedProfile);
    };

    const accountExistsForIdentifier = (identifier) => {
      const normalized = normalizeIdentifier(identifier);
      if (!normalized) {
        return false;
      }

      const profiles = readProfilesFromStorage();
      const userId = resolveUserIdFromIdentifier(identifier, profiles);
      return Boolean(userId);
    };

    const getRecoveryContactsForIdentifier = (identifier) => {
      const normalized = normalizeIdentifier(identifier);
      if (!normalized) {
        return null;
      }

      const profiles = readProfilesFromStorage();
      const userId = resolveUserIdFromIdentifier(identifier, profiles);
      if (!userId) {
        return null;
      }

      const profile = profiles[userId];
      return {
        email: profile?.email || profile?.customerProfile?.email || "",
        mobileNumber: profile?.customerProfile?.mobileNumber || profile?.phone || "",
        whatsappNumber: profile?.customerProfile?.whatsappNumber || profile?.phone || "",
      };
    };

    const logout = () => {
      setUser(null);
      window.localStorage.removeItem(CURRENT_USER_KEY);
    };

    const getCurrentProfile = () => {
      if (!user?.id) {
        return null;
      }
      const profiles = readProfilesFromStorage();
      return profiles[user.id] || null;
    };

    const hasCompletedProfile = () => {
      const profile = getCurrentProfile();
      return isProfileComplete(profile);
    };

    const updateCustomerProfile = (payload) => {
      if (!user?.id) {
        throw new Error("Please sign in first.");
      }

      const safeCustomerProfile = {
        fullName: String(payload?.fullName || "").trim(),
        mobileNumber: String(payload?.mobileNumber || "").trim(),
        whatsappNumber: String(payload?.whatsappNumber || "").trim(),
        email: String(payload?.email || "").trim().toLowerCase(),
        address: String(payload?.address || "").trim(),
        city: String(payload?.city || "").trim(),
        pincode: String(payload?.pincode || "").trim(),
      };

      const missingField = REQUIRED_PROFILE_FIELDS.find(
        (field) => !String(safeCustomerProfile[field] || "").trim()
      );
      if (missingField) {
        throw new Error("All profile fields are required.");
      }

      const profiles = readProfilesFromStorage();
      const existingProfile = profiles[user.id];
      if (!existingProfile) {
        throw new Error("Account profile not found.");
      }

      const updatedProfile = {
        ...existingProfile,
        name: safeCustomerProfile.fullName,
        email: safeCustomerProfile.email,
        phone: safeCustomerProfile.mobileNumber,
        customerProfile: safeCustomerProfile,
      };

      writeProfilesToStorage({
        ...profiles,
        [user.id]: updatedProfile,
      });

      const sessionUser = toSessionUser(updatedProfile);
      setUser(sessionUser);
      return updatedProfile;
    };

    return {
      user,
      login,
      registerWithPassword,
      loginWithPassword,
      resetPassword,
      accountExistsForIdentifier,
      getRecoveryContactsForIdentifier,
      logout,
      getCurrentProfile,
      hasCompletedProfile,
      updateCustomerProfile,
      isHydrated,
    };
  }, [user, isHydrated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

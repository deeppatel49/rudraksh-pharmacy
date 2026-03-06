"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context";
import { useCart } from "../context/cart-context";

const GOOGLE_IDENTITY_SCRIPT = "https://accounts.google.com/gsi/client";
let googleScriptPromise;

function loadGoogleIdentityScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google sign-in is only available in the browser."));
  }

  if (window.google?.accounts?.oauth2) {
    return Promise.resolve(window.google);
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${GOOGLE_IDENTITY_SCRIPT}"]`);
      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(window.google), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Failed to load Google script.")), {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.src = GOOGLE_IDENTITY_SCRIPT;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google);
      script.onerror = () => reject(new Error("Failed to load Google script."));
      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
}

export function LoginForm({ initialParams = {} }) {
  const router = useRouter();
  const { user, isHydrated, login, registerWithPassword, loginWithPassword } = useAuth();
  const { addItem } = useCart();
  const [authView, setAuthView] = useState("signin");
  const [step, setStep] = useState("identifier");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showCreateConfirmPassword, setShowCreateConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createError, setCreateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createIdentifier, setCreateIdentifier] = useState("");
  const [createMobileNumber, setCreateMobileNumber] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createConfirmPassword, setCreateConfirmPassword] = useState("");
  const nextPath = typeof initialParams.next === "string" && initialParams.next ? initialParams.next : "/products";
  const actionType = typeof initialParams.action === "string" ? initialParams.action : "";
  const actionProductId = typeof initialParams.productId === "string" ? initialParams.productId : "";
  const actionProductName = typeof initialParams.pname === "string" ? initialParams.pname : "";
  const actionProductImage = typeof initialParams.pimg === "string" ? initialParams.pimg : "";
  const parsedProductPrice = Number(initialParams.pprice ?? 0);
  const actionProductPrice = Number.isFinite(parsedProductPrice) ? parsedProductPrice : 0;
  const parsedQuantity = Number(initialParams.quantity ?? 1);
  const actionQuantity = Number.isFinite(parsedQuantity) ? Math.max(1, Math.floor(parsedQuantity)) : 1;
  const safeNext = nextPath && nextPath !== "/profile" ? nextPath : "/products";
  const profilePath = `/profile?next=${encodeURIComponent(safeNext)}`;
  const postLoginPath =
    actionType === "buy_now"
      ? "/checkout"
      : actionType === "add_to_cart"
        ? nextPath || "/products"
        : profilePath;
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const runPostLoginAction = (sessionUser) => {
    if ((actionType === "add_to_cart" || actionType === "buy_now") && actionProductId) {
      addItem(
        actionProductId,
        actionQuantity,
        sessionUser.id,
        {
          name: actionProductName || "Product",
          price: actionProductPrice,
          image: actionProductImage || "/products/default-medicine.svg",
        }
      );
    }

    router.replace(postLoginPath);
  };

  const finishLogin = (payload) => {
    const sessionUser = login(payload);
    runPostLoginAction(sessionUser);
  };

  useEffect(() => {
    if (!isHydrated || !user) {
      return;
    }

    router.replace(postLoginPath);
  }, [isHydrated, postLoginPath, router, user]);

  const handleIdentifierSubmit = (event) => {
    event.preventDefault();
    const value = identifier.trim();
    const cleanDigits = value.replace(/\D/g, "");
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const looksLikePhone = cleanDigits.length >= 10 && cleanDigits.length <= 15;

    if (!looksLikeEmail && !looksLikePhone) {
      setError("Enter a valid mobile number or email address.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setPassword("");
    setStep("password");
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    const safePassword = password.trim();
    if (!safePassword) {
      setError("Enter your password.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);
    try {
      const sessionUser = loginWithPassword({
        identifier,
        password: safePassword,
      });
      runPostLoginAction(sessionUser);
    } catch (authError) {
      setIsSubmitting(false);
      setError(authError?.message || "Invalid password.");
    }
  };

  const handleGoogleContinue = async () => {
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      if (!googleClientId) {
        throw new Error("Google client ID is missing.");
      }

      const google = await loadGoogleIdentityScript();
      const tokenResult = await new Promise((resolve, reject) => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: "openid email profile",
          callback: (response) => {
            if (response?.error) {
              reject(new Error(response.error));
              return;
            }
            resolve(response);
          },
        });

        tokenClient.requestAccessToken({ prompt: "select_account" });
      });

      const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenResult.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error("Failed to load Google profile.");
      }

      const profile = await profileResponse.json();
      if (!profile?.email) {
        throw new Error("Google profile email is unavailable.");
      }

      finishLogin({
        name: profile.name || profile.given_name || "Google User",
        email: profile.email.toLowerCase(),
      });
    } catch {
      setIsSubmitting(false);
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handleCreateAccount = (event) => {
    event.preventDefault();
    const name = createName.trim();
    const rawIdentifier = createIdentifier.trim();
    const rawMobileNumber = createMobileNumber.trim();
    const safePassword = createPassword.trim();
    const safeConfirmPassword = createConfirmPassword.trim();
    const cleanDigits = rawIdentifier.replace(/\D/g, "");
    const mobileDigits = rawMobileNumber.replace(/\D/g, "");
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawIdentifier.toLowerCase());
    const isValidPhone = cleanDigits.length >= 10 && cleanDigits.length <= 15;

    if (name.length < 2) {
      setCreateError("Enter your full name.");
      return;
    }

    if (mobileDigits.length < 10 || mobileDigits.length > 15) {
      setCreateError("Enter a valid mobile number.");
      return;
    }

    if (!isValidEmail && !isValidPhone) {
      setCreateError("Enter a valid mobile number or email address.");
      return;
    }

    if (safePassword.length < 6) {
      setCreateError("Password must be at least 6 characters.");
      return;
    }

    if (safePassword !== safeConfirmPassword) {
      setCreateError("Passwords do not match.");
      return;
    }

    setCreateError("");
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      registerWithPassword({
        name,
        identifier: rawIdentifier,
        mobileNumber: rawMobileNumber,
        password: safePassword,
        autoLogin: false,
      });
      setIsSubmitting(false);
      setAuthView("signin");
      setStep("identifier");
      setIdentifier(rawIdentifier);
      setPassword("");
      setCreateName("");
      setCreateIdentifier("");
      setCreateMobileNumber("");
      setCreatePassword("");
      setCreateConfirmPassword("");
      setSuccessMessage("Account created successfully. Please sign in.");
    } catch (createAccountError) {
      setIsSubmitting(false);
      setCreateError(createAccountError?.message || "Account creation failed. Please try again.");
    }
  };

  const handleFormSubmit = (event) => {
    if (step === "identifier") {
      handleIdentifierSubmit(event);
      return;
    }

    handlePasswordSubmit(event);
  };

  return (
    <section className="pharmacy-login-shell" aria-label="Login">
      <article className="pharmacy-login-card">
        <aside className="pharmacy-login-promo" aria-hidden="true">
          <p className="pharmacy-login-promo-kicker">
            Save <span>Upto</span>
          </p>
          <p className="pharmacy-login-promo-value">20%</p>
          <p className="pharmacy-login-promo-copy">on medicines with Branded Substitutes</p>
        </aside>

        <div className="pharmacy-login-content">
          <div className="pharmacy-login-brand">
            <Image src="/rudraksha-logo-v2.png" alt="Rudraksh Pharmacy" width={64} height={64} />
            <p>
              Rudraksh <span>Pharmacy</span>
            </p>
          </div>

          <h1>{authView === "create" ? "Create account" : "Login / Sign up"}</h1>

          {authView === "signin" ? (
            <form className="pharmacy-login-form" onSubmit={handleFormSubmit} noValidate>
              {step === "identifier" ? (
                <>
                  <label htmlFor="login-identifier">Enter mobile number or email</label>
                  <input
                    id="login-identifier"
                    name="identifier"
                    autoComplete="username"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Enter your 10-digit mobile number"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </>
              ) : null}

              {step === "password" ? (
                <>
                  <p className="pharmacy-login-context">Signing in as {identifier}</p>
                  <label htmlFor="login-password">Enter password</label>
                  <div className="pharmacy-password-field">
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? "login-error" : undefined}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((previous) => !previous)}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2 2 0 1 0 2.8 2.8" />
                          <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c5.2 0 9.1 3.3 10.5 7-0.5 1.2-1.3 2.4-2.3 3.4" />
                          <path d="M6.2 6.2C4.6 7.4 3.4 9.1 2.8 12 4.2 15.7 8.1 19 13.3 19c1.2 0 2.3-0.2 3.3-0.5" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M2.8 12C4.2 8.3 8.1 5 12 5s7.8 3.3 9.2 7c-1.4 3.7-5.3 7-9.2 7s-7.8-3.3-9.2-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </>
              ) : null}

              {error ? (
                <p className="pharmacy-login-error" id="login-error">
                  {error}
                </p>
              ) : null}

              {successMessage ? <p className="pharmacy-login-success">{successMessage}</p> : null}

              {step === "identifier" ? (
                <>
                  <button type="submit" disabled={isSubmitting}>
                    Continue with Password
                  </button>
                  <button
                    type="button"
                    className="pharmacy-google-btn"
                    onClick={handleGoogleContinue}
                    disabled={isSubmitting}
                  >
                    <span aria-hidden="true">G</span>
                    Continue with Google
                  </button>
                </>
              ) : null}

              {step === "password" ? (
                <>
                  <button type="submit" disabled={isSubmitting}>
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="pharmacy-inline-btn"
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (identifier.trim()) {
                        params.set("identifier", identifier.trim());
                      }
                      params.set("next", nextPath);
                      router.push(`/forgot-password?${params.toString()}`);
                    }}
                    disabled={isSubmitting}
                  >
                    Forgot Password?
                  </button>
                  <button
                    type="button"
                    className="pharmacy-inline-btn"
                    onClick={() => {
                      setStep("identifier");
                      setPassword("");
                      setError("");
                      setSuccessMessage("");
                    }}
                    disabled={isSubmitting}
                  >
                    Change mobile number or email
                  </button>
                </>
              ) : null}
            </form>
          ) : null}

          {authView === "signin" ? (
            <>
              <p className="pharmacy-login-terms">
                <span className="pharmacy-login-check" aria-hidden="true">{"\u2713"}</span>
                <span>
                  By signing up, I agree to the <a href="/terms">Terms and Conditions</a> and{" "}
                  <a href="/privacy">Privacy Policy</a>.
                </span>
              </p>

              <div className="pharmacy-login-divider" />

              <div className="pharmacy-login-footer">
                <button
                  type="button"
                  className="pharmacy-add-account-btn"
                  onClick={() => {
                    setAuthView("create");
                    setCreateError("");
                    setSuccessMessage("");
                    setError("");
                  }}
                  disabled={isSubmitting}
                >
                  Create account
                </button>
              </div>
            </>
          ) : null}

          {authView === "create" ? (
            <form className="pharmacy-create-form standalone" onSubmit={handleCreateAccount} noValidate>
              <label htmlFor="create-name">Full name</label>
              <input
                id="create-name"
                name="name"
                autoComplete="name"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                placeholder="Enter your full name"
              />

              <label htmlFor="create-email">Email address</label>
              <input
                id="create-email"
                name="identifier"
                autoComplete="email"
                value={createIdentifier}
                onChange={(event) => setCreateIdentifier(event.target.value)}
                placeholder="Enter your email address"
              />

              <label htmlFor="create-mobile">Mobile number</label>
              <input
                id="create-mobile"
                name="mobileNumber"
                autoComplete="tel"
                value={createMobileNumber}
                onChange={(event) => setCreateMobileNumber(event.target.value)}
                placeholder="Enter your mobile number"
              />

              <label htmlFor="create-password">Password</label>
              <div className="pharmacy-password-field">
                <input
                  id="create-password"
                  name="password"
                  type={showCreatePassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={createPassword}
                  onChange={(event) => setCreatePassword(event.target.value)}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  aria-label={showCreatePassword ? "Hide password" : "Show password"}
                  onClick={() => setShowCreatePassword((previous) => !previous)}
                >
                  {showCreatePassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 1 0 2.8 2.8" />
                      <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c5.2 0 9.1 3.3 10.5 7-0.5 1.2-1.3 2.4-2.3 3.4" />
                      <path d="M6.2 6.2C4.6 7.4 3.4 9.1 2.8 12 4.2 15.7 8.1 19 13.3 19c1.2 0 2.3-0.2 3.3-0.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2.8 12C4.2 8.3 8.1 5 12 5s7.8 3.3 9.2 7c-1.4 3.7-5.3 7-9.2 7s-7.8-3.3-9.2-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              <label htmlFor="create-confirm-password">Confirm password</label>
              <div className="pharmacy-password-field">
                <input
                  id="create-confirm-password"
                  name="confirmPassword"
                  type={showCreateConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={createConfirmPassword}
                  onChange={(event) => setCreateConfirmPassword(event.target.value)}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  aria-label={showCreateConfirmPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowCreateConfirmPassword((previous) => !previous)}
                >
                  {showCreateConfirmPassword ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 1 0 2.8 2.8" />
                      <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c5.2 0 9.1 3.3 10.5 7-0.5 1.2-1.3 2.4-2.3 3.4" />
                      <path d="M6.2 6.2C4.6 7.4 3.4 9.1 2.8 12 4.2 15.7 8.1 19 13.3 19c1.2 0 2.3-0.2 3.3-0.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M2.8 12C4.2 8.3 8.1 5 12 5s7.8 3.3 9.2 7c-1.4 3.7-5.3 7-9.2 7s-7.8-3.3-9.2-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {createError ? <p className="pharmacy-login-error">{createError}</p> : null}

              <button type="submit" disabled={isSubmitting}>
                Create account
              </button>
              <button
                type="button"
                className="pharmacy-inline-btn"
                onClick={() => {
                  setAuthView("signin");
                  setCreateError("");
                  setSuccessMessage("");
                }}
                disabled={isSubmitting}
              >
                Back to sign in
              </button>
            </form>
          ) : null}
        </div>
      </article>
    </section>
  );
}

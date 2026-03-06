import { Suspense } from "react";
import { ForgotPasswordFlow } from "../components/forgot-password-flow";

export const metadata = {
  title: "Forgot Password | Reset Account | Rudraksh Pharmacy",
  description: "Recover your Rudraksh Pharmacy account with secure OTP verification. Reset your password safely and regain access to your orders and prescriptions.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/forgot-password",
  },
};

export default async function ForgotPasswordPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialIdentifier = typeof resolvedSearchParams?.identifier === "string" ? resolvedSearchParams.identifier : "";
  const initialNextPath = typeof resolvedSearchParams?.next === "string" ? resolvedSearchParams.next : "/products";

  return (
    <section className="section container">
      <ForgotPasswordFlow initialIdentifier={initialIdentifier} initialNextPath={initialNextPath} />
    </section>
  );
}

import { ForgotPasswordFlow } from "../components/forgot-password-flow";

export const metadata = {
  title: "Forgot Password",
  description: "Recover your account with OTP verification and reset your password securely.",
};

export default function ForgotPasswordPage() {
  return (
    <section className="section container">
      <ForgotPasswordFlow />
    </section>
  );
}

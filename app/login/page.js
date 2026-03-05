import { LoginForm } from "../components/login-form";

export const metadata = {
  title: "Login",
  description:
    "Sign in to your Rudraksh Pharmacy account to place medicine orders securely.",
};

export default function LoginPage() {
  return (
    <section className="section container">
      <LoginForm />
    </section>
  );
}

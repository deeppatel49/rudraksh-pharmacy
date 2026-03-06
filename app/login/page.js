import { LoginForm } from "../components/login-form";

export const metadata = {
  title: "Login | Sign In to Your Account | Rudraksh Pharmacy",
  description: "Sign in to your Rudraksh Pharmacy account. Access order history, save prescriptions, track deliveries, and enjoy personalized healthcare shopping.",
  keywords: [
    "pharmacy login",
    "sign in",
    "customer account",
    "Rudraksh login",
    "order tracking",
  ],
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/login",
  },
};

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;

  const initialParams = {
    next: typeof resolvedSearchParams?.next === "string" ? resolvedSearchParams.next : "",
    action: typeof resolvedSearchParams?.action === "string" ? resolvedSearchParams.action : "",
    productId: typeof resolvedSearchParams?.productId === "string" ? resolvedSearchParams.productId : "",
    pname: typeof resolvedSearchParams?.pname === "string" ? resolvedSearchParams.pname : "",
    pimg: typeof resolvedSearchParams?.pimg === "string" ? resolvedSearchParams.pimg : "",
    pprice: typeof resolvedSearchParams?.pprice === "string" ? resolvedSearchParams.pprice : "",
    quantity: typeof resolvedSearchParams?.quantity === "string" ? resolvedSearchParams.quantity : "",
  };

  return (
    <section className="section container">
      <LoginForm initialParams={initialParams} />
    </section>
  );
}

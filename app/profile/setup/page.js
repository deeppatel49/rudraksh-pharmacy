import { ProfileSetupView } from "../../components/profile-setup-view";

export const metadata = {
  title: "Profile Setup",
  description: "Complete or edit your customer profile details.",
};

export default async function ProfileSetupPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialNextPath = typeof resolvedSearchParams?.next === "string" ? resolvedSearchParams.next : "/profile";

  return <ProfileSetupView initialNextPath={initialNextPath} />;
}

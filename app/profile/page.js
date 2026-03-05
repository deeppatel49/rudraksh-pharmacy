import { CustomerProfileView } from "../components/customer-profile-view";

export const metadata = {
  title: "Customer Profile",
  description: "Complete your profile and review your order information.",
};

export default function ProfilePage() {
  return <CustomerProfileView />;
}

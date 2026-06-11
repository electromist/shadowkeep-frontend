import LandingPage from "../page";
import AuthCard from "@/components/auth/auth-card";

export const metadata = {
  title: "Register - ShadowKeep",
  description: "Create a secure organization vault in ShadowKeep.",
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background landing page content */}
      <LandingPage />

      {/* Dynamic auth overlay drawer */}
      <AuthCard activeTab="register" />
    </div>
  );
}

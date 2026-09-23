import { AuthGuard } from "@/components/auth/AuthGuard";
import { HeaderBar } from "@/components/layout/HeaderBar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <HeaderBar />
      {children}
    </AuthGuard>
  );
}

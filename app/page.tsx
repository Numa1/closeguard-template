import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  return <AuthSplitLayout rightContent={<LoginForm />} />;
}

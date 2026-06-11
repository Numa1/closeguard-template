import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return <AuthSplitLayout rightContent={<RegisterForm />} />;
}

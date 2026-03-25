import { AuthForm } from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Реєстрація",
  description: "Створіть акаунт в Event Planner, щоб почати планувати ваші події.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthForm type="register" />
    </div>
  );
}

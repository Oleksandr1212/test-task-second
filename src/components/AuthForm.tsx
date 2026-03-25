"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/config";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

type AuthFormData = {
  email: string;
  password: string;
  name?: string;
};

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const authSchema = z.object({
    email: z.string().email({ message: "Некоректна адреса електронної пошти" }),
    password: z.string().min(6, { message: "Пароль має містити як мінімум 6 символів" }),
    name: type === "register" ? z.string().min(2, { message: "Ім'я обов'язкове" }) : z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema) as any,
  });

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true);
    setError(null);
    try {
      if (type === "register") {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        if (data.name) {
          await updateProfile(userCredential.user, { displayName: data.name });
          dispatch(setUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: data.name,
          }));
        }
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {type === "login" ? "З поверненням" : "Створити акаунт"}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          {type === "login" ? "Увійдіть, щоб керувати своїми подіями" : "Почніть планувати свої події вже сьогодні"}
        </p>
      </div>
      
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {type === "register" && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ім'я</label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="Олександр"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Електронна пошта</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            placeholder="example@mail.com"
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-blue-200"
        >
          {loading ? "Будь ласка, зачекайте..." : type === "login" ? "Увійти" : "Зареєструватися"}
        </button>
      </form>

      <div className="relative pt-2">
        <div className="absolute inset-0 flex items-center pt-2">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm pt-2">
          <span className="px-3 bg-white text-gray-500 rounded-full">Або увійдіть за допомогою</span>
        </div>
      </div>

      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="w-full px-4 py-2.5 font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm"
      >
        <Image src="/google.svg" alt="Google logo" width={20} height={20} />
        Увійти через Google
      </button>

      <div className="text-center text-sm text-gray-600 pt-2">
        {type === "login" ? (
          <>
            Ще не маєте акаунту?{" "}
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Зареєструватися
            </Link>
          </>
        ) : (
          <>
            Вже маєте акаунт?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Увійти
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

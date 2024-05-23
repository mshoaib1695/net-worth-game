"use client";
import Image from "next/image";
import Input from "@/components/shared/Input";
import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import { useDynamicContext, useAuthenticateConnectedUser } from "../../../lib/dynamic";
import { useRouter } from "next/navigation";

export default function Register() {
  const { user,setShowAuthFlow,  } = useDynamicContext();
  const { isAuthenticating } = useAuthenticateConnectedUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <>
      <Header heading="Login to your account" />
      <div className="min-h-screen flex items-start justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-md">
            <div className="-space-y-px">
              <button
                onClick={() => setShowAuthFlow(true)}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Connect Wallet
              </button>
            </div>
        </div>
      </div>
    </>
  );
}

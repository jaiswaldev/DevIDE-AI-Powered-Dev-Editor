"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignInFormClient from "@/modules/auth/components/sign-in-form-client";

const Signup = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "authenticated"){
    return (
      <div className="flex items-center justify-center">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 mt-20">
      <div className="z-20 w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Image
            src="/login.svg"
            alt="Login"
            height={300}
            width={300}
            className="z-20 object-cover"
          />
        </div>
        <SignInFormClient />
      </div>
    </div>
  );
};

export default Signup;

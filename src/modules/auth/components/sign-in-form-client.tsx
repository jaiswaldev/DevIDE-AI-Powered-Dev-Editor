
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Chrome, Github, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { logger } from "@/lib/logger";

const SignInFormClient = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      logger.info("Initiating Google sign-in");

      await signIn("google", {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Google sign-in error: ${errorMsg}`);
      setError("Failed to sign in with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setIsGithubLoading(true);
      setError(null);
      logger.info("Initiating GitHub sign-in");

      await signIn("github", {
        redirect: true,
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error(`GitHub sign-in error: ${errorMsg}`);
      setError("Failed to sign in with GitHub. Please try again.");
      setIsGithubLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-center">
          Choose your preferred sign-in method
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        {error && (
          <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isGithubLoading}
          variant="outline"
          className="w-full"
        >
          {isGoogleLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
              Signing in...
            </>
          ) : (
            <>
              <Chrome className="mr-2 h-4 w-4" />
              Sign in with Google
            </>
          )}
        </Button>

        <Button
          onClick={handleGithubSignIn}
          disabled={isGoogleLoading || isGithubLoading}
          variant="outline"
          className="w-full"
        >
          {isGithubLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
              Signing in...
            </>
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </>
          )}
        </Button>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 w-full">
          By signing in, you agree to our{" "}
          <a href="#" className="underline hover:text-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-primary">
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignInFormClient;



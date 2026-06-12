"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AnimatedTabs from "@/components/smoothui/animated-tabs";
import GlowHover from "@/components/ui/smoothui/glow-hover-card";
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, Building2, ShieldCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:3000";

// Colorful official Google Logo SVG
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// Solid white official GitHub Logo SVG
const GithubIcon = () => (
  <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

interface AuthCardProps {
  activeTab: "login" | "register";
}

export default function AuthCard({ activeTab }: AuthCardProps) {
  const router = useRouter();

  // Local active tab state to prevent full Next.js page re-mounts on tab switches
  const [tab, setTab] = useState<"login" | "register">(activeTab);

  // Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Sync state if URL changes directly
  useEffect(() => {
    setTab(activeTab);
  }, [activeTab]);

  // Clear feedback and inputs when local tab switches
  useEffect(() => {
    setFeedback(null);
    setFirstName("");
    setLastName("");
    setOrgName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }, [tab]);

  // Disable HTML & body scroll when modal is mounted, enable on unmount
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("no-scrollbar");
    document.body.classList.add("no-scrollbar");
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.classList.remove("no-scrollbar");
      document.body.classList.remove("no-scrollbar");
    };
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      router.push("/");
    }
  };

  const handleTabToggle = (tabId: string) => {
    const targetTab = tabId as "login" | "register";
    setTab(targetTab);
    // Silently update the URL bar without triggering a Next.js route reload
    window.history.replaceState(null, "", `/${targetTab}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Basic Validations
    if (tab === "register" && (!firstName || !lastName)) {
      setFeedback({ text: "First and Last Name are required.", type: "error" });
      return;
    }
    if (!orgName) {
      setFeedback({ text: "Organization name is required.", type: "error" });
      return;
    }
    if (!email) {
      setFeedback({ text: "Email address is required.", type: "error" });
      return;
    }
    if (!password) {
      setFeedback({ text: "Password is required.", type: "error" });
      return;
    }
    if (tab === "register" && password !== confirmPassword) {
      setFeedback({ text: "Passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);

    try {
      if (tab === "register") {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, orgName, email, password }),
        });

        if (response.ok) {
          setFeedback({
            text: "Account registered successfully! Redirecting to login...",
            type: "success",
          });
          setTimeout(() => {
            handleTabToggle("login");
          }, 2000);
        } else {
          const errMsg = await response.text();
          setFeedback({
            text: errMsg || "Failed to register account. Please try again.",
            type: "error",
          });
        }
      } else {
        // Login Flow
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orgName, email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            localStorage.setItem("access_token", data.token);
          }
          if (data.refresh_token) {
            localStorage.setItem("refresh_token", data.refresh_token);
          }

          setFeedback({
            text: "Login successful! Redirecting to home...",
            type: "success",
          });

          setTimeout(() => {
            router.push("/");
          }, 1500);
        } else {
          const errMsg = await response.text();
          setFeedback({
            text: errMsg || "Invalid organization details or password.",
            type: "error",
          });
        }
      }
    } catch (err) {
      setFeedback({
        text: "Could not connect to the backend server. Please verify it is running on port 3000.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const cardElement = (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden border border-zinc-800 bg-black shadow-2xl relative text-white min-h-[600px] h-[80vh] max-h-[720px]">

      {/* Left Column - Red Cinematic Cover */}
      <div className="relative hidden md:flex md:col-span-5 lg:col-span-5 h-full flex-col justify-between p-8 lg:p-10 overflow-hidden bg-zinc-950">
        <img
          src="/red_cinematic_blur_4k.png"
          alt="Security Vault"
          className="absolute inset-0 w-full h-full object-cover opacity-80 rounded-l-3xl pointer-events-none select-none scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/80 rounded-l-3xl z-0" />

        {/* Brand Link */}
        <Link href="/" className="relative z-10 flex items-center gap-2 text-xl font-bold text-white group self-start">
          <img
            src="/logo.png"
            alt="ShadowKeep Logo"
            className="h-7 w-auto filter brightness-110 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-sans tracking-tight">ShadowKeep</span>
        </Link>

        {/* Feature Glass Card */}
        <div className="relative z-10 p-5 rounded-2xl border border-white/10 bg-zinc-950/70 backdrop-blur-md max-w-sm mt-auto">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="h-4 w-4 text-[#FF7B2E]" />
            <h3 className="text-[10px] font-bold text-white uppercase tracking-wider">
              Secure Multi-Tenancy
            </h3>
          </div>
          <p className="text-[11px] text-neutral-300 leading-relaxed font-medium">
            Encrypt, isolate, and route your tenant objects with AES-256-GCM envelope vaults, edge-ready performance, and absolute separation of master keys.
          </p>
        </div>
      </div>

      {/* Right Column - Tabs and Forms */}
      <div className="col-span-1 md:col-span-7 lg:col-span-7 flex flex-col justify-center p-6 md:p-8 lg:p-10 h-full overflow-hidden bg-black">
        <div className="w-full max-w-md mx-auto flex flex-col">

          {/* Back Link */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mb-6 self-start transition-colors duration-200 p-2 -ml-2 rounded-lg hover:bg-zinc-900/50"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>

          {/* Title & Header */}
          <div className="w-full mb-5 text-left px-0.5">
            <h2 className="text-xl font-black text-white uppercase tracking-tight font-sans">
              {tab === "login" ? "Login to Vault" : "Create Organization"}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              {tab === "login"
                ? "Enter your organization details below to access your vault."
                : "Register a secure organization sandbox. You will be registered as the administrator of this system."}
            </p>
          </div>

          {/* Animated Tabs Control */}
          <div className="self-start mb-5 px-0.5">
            <AnimatedTabs
              activeTab={tab}
              tabs={[
                { id: "login", label: "Login" },
                { id: "register", label: "Register" },
              ]}
              onChange={handleTabToggle}
              variant="pill"
              layoutId="auth-pill-active-theme"
              className="bg-zinc-900 border-zinc-800 text-zinc-400"
            />
          </div>

          {/* Feedback Messages */}
          {feedback && (
            <div
              className={cn(
                "w-full p-3 mb-4 rounded-xl text-xs font-medium border animate-appear",
                feedback.type === "success"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              )}
            >
              {feedback.text}
            </div>
          )}

          {/* Form wrapper */}
          <form className="w-full flex flex-col" onSubmit={handleSubmit}>

            {/* Height-matched wrapper to prevent overlays/overlapping and keep form sizes identical */}
            <div className="max-h-[340px] flex flex-col justify-start gap-4 overflow-y-auto no-scrollbar px-0.5 mb-4">
              <AnimatePresence mode="wait">
                {tab === "login" ? (
                  <motion.div
                    key="login-fields"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="orgName" className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                        <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                        Organization Name
                      </Label>
                      <Input
                        id="orgName"
                        placeholder="e.g., projectmayhem"
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-805 text-white rounded-xl text-sm"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email" className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                        <Mail className="h-3.5 w-3.5 text-zinc-500" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        placeholder="admin@projectmayhem.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-805 text-white rounded-xl text-sm"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password" className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                        <Lock className="h-3.5 w-3.5 text-zinc-500" />
                        Password
                      </Label>
                      <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-805 text-white rounded-xl text-sm"
                        required
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register-fields"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="firstName" className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                          <User className="h-3.5 w-3.5 text-zinc-500" />
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="Tyler"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="bg-zinc-900/50 border-zinc-805 text-white rounded-xl text-sm"
                          required
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="lastName" className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                          <User className="h-3.5 w-3.5 text-zinc-500" />
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Durden"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="bg-zinc-900/50 border-zinc-805 text-white rounded-xl text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="regOrgName" className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                        <Building2 className="h-3.5 w-3.5 text-zinc-500" />
                        Organization Name
                      </Label>
                      <Input
                        id="regOrgName"
                        placeholder="e.g., projectmayhem"
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-805 text-white rounded-xl text-sm"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email" className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                        <Mail className="h-3.5 w-3.5 text-zinc-500" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        placeholder="admin@projectmayhem.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-805 text-white rounded-xl text-sm"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="regPassword" className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                        <Lock className="h-3.5 w-3.5 text-zinc-500" />
                        Password
                      </Label>
                      <Input
                        id="regPassword"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-805 text-white rounded-xl text-sm"
                        required
                      />
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="confirmPassword" className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold uppercase tracking-wider">
                        <Lock className="h-3.5 w-3.5 text-zinc-500" />
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        placeholder="••••••••"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-zinc-900/50 border-zinc-805 text-white rounded-xl text-sm"
                        required
                      />
                    </div>

                    {/* RBAC disclaimer & invite note */}
                    <div className="text-[11px] text-zinc-500 leading-normal pt-1 text-center">
                      You can{" "}
                      <a
                        href="#"
                        className="text-[#FF7B2E] hover:underline font-semibold"
                        onClick={(e) => e.preventDefault()}
                      >
                        invite team members
                      </a>{" "}
                      and configure custom RBAC roles after setting up your vault.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <Button
              className={cn(
                "group/btn relative w-full max-w-xs mx-auto h-10 rounded-full font-semibold cursor-pointer transition-all duration-200 mt-2",
                "bg-zinc-300 hover:bg-zinc-200 text-zinc-950 font-bold"
              )}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center h-33">
                  <Loader2 className="h-4 w-4 animate-spin" /> Working...
                </span>
              ) : tab === "login" ? (
                <span className="flex items-center justify-center">
                  Login <ArrowRight className="ml-1.5 h-4 w-4" />
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Register Organization <ArrowRight className="ml-1.5 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-5 w-full flex items-center justify-between gap-4">
            <span className="h-px bg-zinc-800/80 flex-1" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest select-none font-sans">Or continue with</span>
            <span className="h-px bg-zinc-800/80 flex-1" />
          </div>

          {/* Social Logins: Rounded Google and GitHub circles with official SVGs and border-none */}
          <div className="flex justify-center gap-4 w-full">
            <button
              className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer border-none shadow-md text-white"
              type="button"
              onClick={() => window.location.href = `${API_BASE_URL}/auth/google/login`}
            >
              <GoogleIcon />
            </button>
            <button
              className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer border-none shadow-md text-white"
              type="button"
            >
              <GithubIcon />
            </button>
          </div>

        </div>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md overflow-y-auto no-scrollbar"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-5xl lg:max-w-6xl relative"
        onClick={(e) => e.stopPropagation()} // Stop propagation to prevent closing when clicking the card itself
      >
        <GlowHover
          items={[
            {
              id: "auth-card-overlay",
              element: cardElement,
            }
          ]}
          glowIntensity={0.001}
          maskSize={500}
        />
      </motion.div>
    </div>
  );
}

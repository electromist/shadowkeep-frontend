"use client";

import React, { useState } from "react";
import AnimatedStepper from "@/components/smoothui/animated-stepper";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { 
  ShieldCheck, 
  Key, 
  Database, 
  Cpu, 
  ArrowRight, 
  ArrowLeft, 
  FileText,
  FileLock,
  UploadCloud,
  Link2,
  FileCheck
} from "lucide-react";

export default function HowShadowKeepWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: "Envelope Encryption",
      description: "Dual-layer key wrapping",
      icon: <span className="font-mono text-xs font-bold">01</span>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8 min-h-[360px]">
          {/* Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#ff5c00] text-[#ff5c00] text-xs font-mono font-bold bg-[#ff5c00]/10">
                  01
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#ff5c00]">
                  Phase One
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">Envelope Encryption</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  A unique Data Encryption Key (DEK) is generated for each uploaded file. The file is encrypted on the server using AES-256-GCM, and the DEK is encrypted with your environment's Master Key before database storage.
                </p>
              </div>
            </div>

          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-zinc-800/80 relative overflow-hidden p-8 flex flex-col justify-center items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full max-w-md justify-center">
              {/* Plaintext File */}
              <div className="flex flex-col items-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/40 w-36 text-center">
                <FileText className="w-10 h-10 text-zinc-400 mb-2" />
                <span className="text-xs font-bold text-zinc-300 font-mono">Plaintext File</span>
                <span className="text-[10px] text-zinc-500 mt-1 uppercase">Sensitive Data</span>
              </div>

              {/* Encryption Arrow */}
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="w-6 h-6 text-zinc-500 animate-pulse hidden sm:block" />
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-700">
                  Encrypt
                </span>
              </div>

              {/* Encrypted File */}
              <div className="flex flex-col items-center p-6 rounded-2xl bg-zinc-900 border border-zinc-800 w-36 text-center relative overflow-hidden">
                <FileLock className="w-10 h-10 text-zinc-400 mb-2" />
                <span className="text-xs font-bold text-zinc-300 font-mono">Ciphertext</span>
                <span className="text-[10px] text-zinc-500 mt-1 uppercase font-mono">AES-GCM</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Upload & Store",
      description: "Secure bucket storage",
      icon: <span className="font-mono text-xs font-bold">02</span>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8 min-h-[360px]">
          {/* Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#ff5c00] text-[#ff5c00] text-xs font-mono font-bold bg-[#ff5c00]/10">
                  02
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#ff5c00]">
                  Phase Two
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">R2 Storage</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Upload the encrypted files directly to your Cloudflare R2 storage. Your master key acts as a key-wrapping envelope, guarding access keys dynamically.
                </p>
              </div>
            </div>

          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-zinc-800/80 relative overflow-hidden p-8 flex flex-col justify-center items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col sm:flex-row items-center gap-8 w-full max-w-md justify-center">
              {/* Encrypted Source */}
              <div className="flex flex-col items-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/40 w-36 text-center">
                <FileLock className="w-10 h-10 text-zinc-500 mb-2" />
                <span className="text-xs font-bold text-zinc-300 font-mono">Payload</span>
                <span className="text-[10px] text-zinc-500 mt-1 uppercase">Encrypted</span>
              </div>

              {/* Upload Cloud */}
              <div className="flex flex-col items-center gap-1">
                <UploadCloud className="w-8 h-8 text-zinc-500 animate-bounce" />
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-700">
                  Upload
                </span>
              </div>

              {/* R2 Storage Target */}
              <div className="flex flex-col items-center p-6 rounded-2xl bg-zinc-900 border border-zinc-800 w-36 text-center relative overflow-hidden">
                <Database className="w-10 h-10 text-zinc-400 mb-2" />
                <span className="text-xs font-bold text-zinc-300 font-mono">R2 Bucket</span>
                <span className="text-[10px] text-zinc-500 mt-1 uppercase font-mono">S3 API</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Stream Decrypt",
      description: "In-memory decryption streaming",
      icon: <span className="font-mono text-xs font-bold">03</span>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8 min-h-[360px]">
          {/* Details Card */}
          <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#ff5c00] text-[#ff5c00] text-xs font-mono font-bold bg-[#ff5c00]/10">
                  03
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#ff5c00]">
                  Phase Three
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">Stream Decrypt</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Call the POST /download endpoint with a valid JWT token. The server decrypts the wrapped DEK in RAM using the Master Key, decrypts the R2 ciphertext, and streams the plaintext bytes directly to the client.
                </p>
              </div>
            </div>

          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-zinc-800/80 relative overflow-hidden p-8 flex flex-col justify-center items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-lg justify-center">
              {/* Presigned Link */}
              <div className="flex flex-col items-center p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 w-28 text-center">
                <Link2 className="w-6 h-6 text-zinc-500 mb-1.5" />
                <span className="text-[10px] font-bold text-zinc-400 font-mono">POST Request</span>
                <span className="text-[8px] text-zinc-500 mt-0.5 uppercase">JWT Scoped</span>
              </div>

              {/* Decrypting in RAM */}
              <div className="flex flex-col items-center p-4 rounded-2xl bg-zinc-900 border border-zinc-800 w-28 text-center relative overflow-hidden">
                <Cpu className="w-6 h-6 text-zinc-400 mb-1.5 animate-pulse" />
                <span className="text-[10px] font-bold text-zinc-300 font-mono">RAM Decrypt</span>
                <span className="text-[8px] text-zinc-500 mt-0.5 uppercase">Volatile</span>
              </div>

              {/* Decrypted Payload */}
              <div className="flex flex-col items-center p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/40 w-28 text-center">
                <FileCheck className="w-6 h-6 text-zinc-400 mb-1.5" />
                <span className="text-[10px] font-bold text-zinc-300 font-mono">Plaintext File</span>
                <span className="text-[8px] text-zinc-500 mt-0.5 uppercase">Delivered</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full max-w-container mx-auto py-24 flex flex-col items-center gap-16 relative px-4">
      {/* Visual background ambient lights */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-[#FF7B2E]/5 blur-3xl opacity-50" />

      {/* Header Title Block */}
      <div className="relative text-center max-w-3xl space-y-4">
        <h2 className="text-xs font-bold tracking-widest text-[#ff5c00] uppercase">
          Architecture & Flow
        </h2>
        <BlurFade delay={0.75} inView>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none fade-bottom uppercase">
            How ShadowKeep Works
          </h1>
        </BlurFade>
        <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Three steps to completely air-gapped secret storage. No plaintext ever leaves your control — from ingestion to retrieval.
        </p>
      </div>

      {/* Stepper Component */}
      <div className="w-full space-y-10 relative z-10">
        <AnimatedStepper
          allowClickNavigation
          currentStep={currentStep}
          onStepChange={setCurrentStep}
          steps={steps}
          variant="horizontal"
          className="[&_[role=tab]]:cursor-pointer"
        />

        {/* Stepper Navigation Buttons */}
        <div className="flex justify-between items-center max-w-md mx-auto pt-4">
          <Button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            size="icon"
            variant="outline"
            className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          {/* Custom Dots indicator */}
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? "w-6 bg-white" : "bg-zinc-800 hover:bg-zinc-700"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <Button
            disabled={currentStep === steps.length - 1}
            onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
            size="icon"
            className="bg-white hover:bg-zinc-200 text-black rounded-full shadow-sm"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

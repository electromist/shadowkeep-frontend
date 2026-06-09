"use client";

import React, { useState } from "react";
import AnimatedStepper from "@/components/smoothui/animated-stepper";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Key, Database, Cpu, ArrowRight, ArrowLeft } from "lucide-react";

export default function HowShadowKeepWorks() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: "Ingest & Encrypt",
      description: "Local client-side security",
      icon: <span className="font-mono text-xs font-bold">01</span>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8 min-h-[380px]">
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
                <h3 className="text-2xl font-bold text-white">Ingest & Encrypt</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Your CLI or SDK generates a fresh, high-entropy Data Encryption Key (DEK) per secret. The plaintext is encrypted locally using AES-256-GCM before it is ever transmitted across the network.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-zinc-950 border border-zinc-800 text-[#ff5c00] shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                AES-256-GCM · local encryption
              </span>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-zinc-800/80 relative overflow-hidden p-6 flex flex-col justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-4">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] font-mono text-zinc-600">client-encryption-sdk.ts</span>
            </div>
            
            {/* Code Block */}
            <pre className="font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto select-none p-2">
              <code className="block">
                <span className="text-zinc-500">// 1. Generate fresh local DEK</span>{"\n"}
                <span className="text-purple-400">const</span> <span className="text-blue-400">dek</span> = <span className="text-yellow-400">crypto</span>.<span className="text-blue-300">getRandomValues</span>(<span className="text-purple-400">new</span> <span className="text-green-400">Uint8Array</span>(<span className="text-orange-300">32</span>));{"\n\n"}
                <span className="text-zinc-500">// 2. Encrypt plaintext secret locally</span>{"\n"}
                <span className="text-purple-400">const</span> <span className="text-blue-400">ciphertext</span> = <span className="text-purple-400">await</span> <span className="text-blue-300">aesGcmEncrypt</span>(secret, dek);{"\n\n"}
                <span className="text-zinc-500">// 3. Zero-Knowledge guarantee:</span>{"\n"}
                <span className="text-zinc-500">// Plaintext never leaves your terminal.</span>{"\n"}
                <span className="text-green-400">console</span>.<span className="text-blue-300">log</span>(<span className="text-green-300">"✓ Encrypted successfully."</span>);
              </code>
            </pre>
          </div>
        </div>
      ),
    },
    {
      label: "Wrap & Store in R2",
      description: "Secure storage orchestration",
      icon: <span className="font-mono text-xs font-bold">02</span>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8 min-h-[380px]">
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
                <h3 className="text-2xl font-bold text-white">Wrap & Store in R2</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  The DEK is wrapped (encrypted) using your organization's Master Key Encryption Key (KEK) via key-wrapping protocols. Both the wrapped DEK and the encrypted ciphertext are safely stored in your dedicated R2 bucket.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-zinc-950 border border-zinc-800 text-[#ff5c00] shadow-sm">
                <Key className="w-3.5 h-3.5" />
                AES-256-KW · R2 storage
              </span>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-zinc-800/80 relative overflow-hidden p-6 flex flex-col justify-center items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
            {/* Visual Architecture Representation */}
            <div className="w-full max-w-md space-y-6 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 w-32 text-center">
                  <Key className="w-5 h-5 text-orange-400 mb-1" />
                  <span className="text-[10px] font-mono text-zinc-300">Wrapped DEK</span>
                  <span className="text-[8px] text-zinc-500 uppercase mt-0.5">Encrypted</span>
                </div>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-zinc-800 via-orange-500/50 to-zinc-800 relative">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-orange-400 bg-zinc-950 px-1 border border-zinc-900 rounded">
                    Envelope
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-zinc-900 border border-zinc-800 w-32 text-center">
                  <ShieldCheck className="w-5 h-5 text-zinc-400 mb-1" />
                  <span className="text-[10px] font-mono text-zinc-300">Ciphertext</span>
                  <span className="text-[8px] text-zinc-500 uppercase mt-0.5">AES-GCM Payload</span>
                </div>
              </div>

              {/* Destination bucket box */}
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10 p-6 flex flex-col items-center text-center space-y-2 relative">
                <div className="absolute top-2 right-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Storage Active</span>
                </div>
                <Database className="w-8 h-8 text-[#ff5c00] opacity-80" />
                <h4 className="text-xs font-semibold text-white font-mono uppercase tracking-wider">Cloudflare R2 Bucket</h4>
                <p className="text-[11px] text-zinc-500 max-w-xs leading-normal">
                  Isolated multi-tenant container storing payloads and encrypted envelopes.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Retrieve & Decrypt",
      description: "Ephemeral decryption layer",
      icon: <span className="font-mono text-xs font-bold">03</span>,
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8 min-h-[380px]">
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
                <h3 className="text-2xl font-bold text-white">Retrieve & Decrypt</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  On demand, ShadowKeep fetches the wrapped DEK, unwraps it inside secure application memory using your KEK, and decrypts the ciphertext. Plaintext exists strictly in memory.
                </p>
              </div>
            </div>
            <div className="mt-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-zinc-950 border border-zinc-800 text-[#ff5c00] shadow-sm">
                <Cpu className="w-3.5 h-3.5" />
                in-memory only · zero persistence
              </span>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-zinc-800/80 relative overflow-hidden p-6 flex flex-col justify-center items-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]">
            {/* Visual Process Pipeline */}
            <div className="w-full max-w-lg space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-500 font-mono px-2">
                <span>R2 STORAGE</span>
                <span>SECURE MEMORY (RAM)</span>
                <span>CONSUMER</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {/* Bucket retrieval */}
                <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-1.5">
                  <Database className="w-5 h-5 text-zinc-500" />
                  <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">Fetch Encrypted</span>
                  <span className="text-[8px] text-zinc-600 leading-normal">Payload & Envelope</span>
                </div>

                {/* Secure Memory Decrypt */}
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-1.5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-orange-500/5 blur-xl pointer-events-none" />
                  <Cpu className="w-5 h-5 text-[#ff5c00] animate-pulse" />
                  <span className="text-[9px] font-mono text-orange-400 font-bold uppercase">RAM Decryption</span>
                  <span className="text-[8px] text-zinc-400 leading-normal">Decrypted in memory</span>
                </div>

                {/* Plaintext delivery */}
                <div className="p-4 rounded-2xl bg-[#ff5c00]/5 border border-[#ff5c00]/20 flex flex-col items-center justify-center text-center space-y-1.5">
                  <ShieldCheck className="w-5 h-5 text-[#ff5c00]" />
                  <span className="text-[9px] font-mono text-[#ff5c00] font-bold uppercase">Plaintext Out</span>
                  <span className="text-[8px] text-orange-300 leading-normal">Returned to App</span>
                </div>
              </div>

              {/* Bottom security warning */}
              <div className="rounded-xl bg-orange-500/5 border border-orange-500/10 p-3 flex gap-3 items-center">
                <span className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <p className="text-[10px] text-orange-300/80 leading-normal font-mono">
                  Guaranteed: Secrets never touch persistent disks, logs, or backups in plaintext format.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-24 flex flex-col items-center gap-16 relative">
      {/* Visual background ambient lights */}
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-[#ff5c00]/5 blur-3xl opacity-50" />

      {/* Header Title Block */}
      <div className="relative text-center max-w-3xl space-y-4">
        <h2 className="text-xs font-bold tracking-widest text-[#ff5c00] uppercase">
          Architecture & Flow
        </h2>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none">
          How ShadowKeep works
        </h1>
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
            size="sm"
            variant="outline"
            className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          {/* Custom Dots indicator */}
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentStep ? "w-6 bg-[#ff5c00]" : "bg-zinc-800 hover:bg-zinc-700"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <Button
            disabled={currentStep === steps.length - 1}
            onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
            size="sm"
            className="bg-white hover:bg-zinc-200 text-black font-semibold rounded-full shadow-sm"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

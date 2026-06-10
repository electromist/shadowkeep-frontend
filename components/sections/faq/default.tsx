import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { Section } from "../../ui/section";
import { BlurFade } from "@/components/ui/blur-fade";

interface FAQItemProps {
  question: string;
  answer: ReactNode;
  value?: string;
}

interface FAQProps {
  title?: string;
  items?: FAQItemProps[] | false;
  className?: string;
}

export default function FAQ({
  title = "Questions and Answers",
  items = [
    {
      question: "How does ShadowKeep isolate database records for each organization?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[640px] text-balance">
            ShadowKeep uses a dedicated `org_id` scoped data design. Organization records and uploads are isolated at the database queries level using strict WHERE clauses (`org_id = $1`), and files are stored in organization-specific directories inside Cloudflare R2 (`org_id/file_id`).
          </p>
        </>
      ),
    },
    {
      question: "What encryption method is used to protect files?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[600px]">
            We implement AES-256-GCM authenticated encryption. Every file uploaded is encrypted using a unique Data Encryption Key (DEK). This DEK is then encrypted (wrapped) using the server's Master Key (`MASTER_KEY`) and stored alongside the file metadata.
          </p>
        </>
      ),
    },
    {
      question: "How does the token authorization system work?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            ShadowKeep implements an OAuth 2.0 and JWT system. Upon authenticating (including Google OAuth callback), clients receive a short-lived access token (valid for 15 minutes) and a long-lived refresh token (valid for 7 days) to retrieve new access tokens securely via `/refresh`.
          </p>
        </>
      ),
    },
    {
      question: "Is there a file size limit or rate limiting?",
      answer: (
        <>
          <p className="text-muted-foreground mb-4 max-w-[580px]">
            Yes, the API gateway restricts file uploads to 50MB per request ({"`MultipartForm(50 << 20)`"}) and enforces strict rate limits to prevent brute-force attacks and SQL injections using parametrized queries.
          </p>
        </>
      ),
    },
    {
      question: "Does ShadowKeep store my raw master key?",
      answer: (
        <p className="text-muted-foreground mb-4 max-w-[580px]">
          No. The master key (`MASTER_KEY`) is stored as a 256-bit hexadecimal string in your server's secure environment configuration (`.env`). It is loaded into volatile RAM during initialization and is never exposed in client responses or database logs.
        </p>
      ),
    },
  ],
  className,
}: FAQProps) {
  return (
    <Section className={cn("max-w-container mx-auto w-full", className)}>
      <div className="w-full flex flex-col items-center gap-8 relative">
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[300px] w-[300px] rounded-full bg-[#FF7B2E]/5 blur-3xl" />
        <div className="text-center z-10">
          <h2 className="mb-4 text-xs font-bold tracking-widest text-[#FF5C00] uppercase">
            FAQ
          </h2>
          <BlurFade delay={0.75} inView>
            <h2 className="text-3xl font-black sm:text-5xl tracking-tight fade-bottom uppercase">
              {title}
            </h2>
          </BlurFade>
        </div>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem
                key={item.value ?? item.question}
                value={item.value || `item-${index + 1}`}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}

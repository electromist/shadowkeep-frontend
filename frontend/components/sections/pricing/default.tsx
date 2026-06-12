import { User, Users } from "lucide-react";

import { cn } from "@/lib/utils";

import { PricingColumn, PricingColumnProps } from "../../ui/pricing-column";
import { Section } from "../../ui/section";
import { BlurFade } from "@/components/ui/blur-fade";

interface PricingProps {
  title?: string | false;
  description?: string | false;
  plans?: PricingColumnProps[] | false;
  className?: string;
}

const DEFAULT_PRICING_PLANS: PricingColumnProps[] = [
  {
    name: "Developer (Self-Hosted)",
    description: "Perfect for local development, testing, and hobby projects",
    price: 0,
    priceNote: "Free and open-source forever. Run it locally.",
    cta: {
      variant: "glow",
      label: "Get started for free",
      href: "/register",
    },
    features: [
      "Multi-tenant isolation logic",
      "Local master key configuration",
      "OAuth 2.0 (Google Login callback)",
      "Standard local storage mapping",
    ],
    variant: "default",
    className: "hidden lg:flex",
  },
  {
    name: "Startup (SaaS)",
    icon: <User className="size-4" />,
    description: "For production startups requiring managed storage and key rotation",
    price: 49,
    priceNote: "Per month. Cancel anytime. Free updates.",
    cta: {
      variant: "default",
      label: "Get Startup access",
      href: "/register?plan=startup",
    },
    features: [
      "Dedicated Cloudflare R2 bucket",
      "AES-256-GCM Envelope Encryption",
      "Auto JWT refresh token rotator",
      "Background scanner integration",
      "Up to 10k secure uploads / mo",
    ],
    variant: "glow-brand",
  },
  {
    name: "Enterprise",
    icon: <Users className="size-4" />,
    description: "For scale organizations demanding schema isolation and custom KMS keys",
    price: 299,
    priceNote: "Per month. Volume scaling options available.",
    cta: {
      variant: "default",
      label: "Contact security sales",
      href: "/register?plan=enterprise",
    },
    features: [
      "Isolated PostgreSQL schemas",
      "Custom HSM/KMS key integration",
      "Real-time audit log WebSockets",
      "Priority SLA support guidelines",
      "Unlimited secure file transfers",
    ],
    variant: "glow",
  },
];

export default function Pricing({
  title = "Simple, Transparent Security Pricing.",
  description = "Get started for free on local machines, or scale dynamically using our production SaaS features.",
  plans = DEFAULT_PRICING_PLANS,
  className = "",
}: PricingProps) {
  return (
    <Section className={cn("max-w-container mx-auto w-full", className)}>
      <div className="mx-auto flex w-full flex-col items-center gap-12">
        {(title || description) && (
          <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8 relative z-10">
            <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-[300px] w-[300px] rounded-full bg-[#FF7B2E]/5 blur-3xl -z-10" />
            <h2 className="text-xs font-bold tracking-widest text-[#FF5C00] uppercase">
              Pricing
            </h2>
            {title && (
              <BlurFade delay={0.75} inView>
                <h2 className="text-3xl leading-tight font-black sm:text-5xl sm:leading-tight fade-bottom uppercase">
                  {title}
                </h2>
              </BlurFade>
            )}
            {description && (
              <p className="text-md text-muted-foreground max-w-[600px] font-medium sm:text-xl">
                {description}
              </p>
            )}
          </div>
        )}
        {plans !== false && plans.length > 0 && (
          <div className="max-w-container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingColumn
                key={plan.name}
                name={plan.name}
                icon={plan.icon}
                description={plan.description}
                price={plan.price}
                originalPrice={plan.originalPrice}
                promotionText={plan.promotionText}
                priceNote={plan.priceNote}
                cta={plan.cta}
                features={plan.features}
                variant={plan.variant}
                className={plan.className}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

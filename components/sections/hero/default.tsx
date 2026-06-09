import { ChevronRight } from "lucide-react"
import { ReactNode } from "react"

import { cn } from "@/lib/utils"

import Github from "../../logos/github"
import Glow from "../../ui/glow"
import { LinkButton, type LinkButtonProps } from "../../ui/link-button"
import { Mockup, MockupFrame } from "../../ui/mockup"
import Screenshot from "../../ui/screenshot"
import { Section } from "../../ui/section"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import { ContainerScroll } from "@/components/ui/container-scroll-animation"

interface HeroButtonProps extends Omit<LinkButtonProps, "children"> {
  text: string
}

interface HeroProps {
  title?: string
  description?: string
  mockup?: ReactNode | false
  badge?: ReactNode | false
  buttons?: HeroButtonProps[] | false
  className?: string
}

const DEFAULT_HERO_BUTTONS: HeroButtonProps[] = [
  {
    href: "https://www.launchuicomponents.com/",
    text: "Get Started",
    variant: "default",
  },
  {
    href: "https://www.launchuicomponents.com/",
    text: "GitHub",
    variant: "glow",
    icon: <Github className="mr-2 size-4" />,
  },
]

const DEFAULT_HERO_BADGE = (
  <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
    <span
      className={cn(
        "absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
      )}
      style={{
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "destination-out",
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "subtract",
        WebkitClipPath: "padding-box",
      }}
    />
    🎉 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
    <AnimatedGradientText className="text-sm font-medium">
      Introducing Magic UI
    </AnimatedGradientText>
    <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
  </div>
)

const DEFAULT_HERO_MOCKUP = (
  <Screenshot
    srcLight="/linear.webp"
    srcDark="/linear.webp"
    alt="Launch UI app screenshot"
    width={1248}
    height={765}
    className="w-full"
  />
)

export default function Hero({
  title = "Give your big idea the design it deserves",
  description = "Professionally designed blocks and templates built with React, Shadcn/ui and Tailwind that will help your product stand out.",
  mockup = DEFAULT_HERO_MOCKUP,
  badge = DEFAULT_HERO_BADGE,
  buttons = DEFAULT_HERO_BUTTONS,
  className,
}: HeroProps) {
  return (
    <Section
      className={cn(
        "overflow-hidden fade-bottom pb-0 sm:pb-0 md:pb-0",
        className
      )}
    >
      <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {badge !== false && badge}
          <h1 className="relative z-10 inline-block animate-appear bg-linear-to-r from-foreground to-foreground bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight dark:to-muted-foreground">
            {title}
          </h1>
          <p className="text-md relative z-10 max-w-[740px] animate-appear font-medium text-balance text-muted-foreground opacity-0 delay-100 sm:text-xl">
            {description}
          </p>
          {buttons !== false && buttons.length > 0 && (
            <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
              {buttons.map((button) => (
                <LinkButton
                  key={`${button.href}-${button.text}`}
                  variant={button.variant || "default"}
                  size="lg"
                  href={button.href}
                  icon={button.icon}
                  iconRight={button.iconRight}
                >
                  {button.text}
                </LinkButton>
              ))}
            </div>
          )}
          {mockup !== false && (
            <div className="relative w-full pt-12">
              <ContainerScroll className="w-full">
                <img
                  src="/linear.webp"
                  alt="hero"
                  height={720}
                  width={1400}
                  className="mx-auto h-full rounded-2xl object-cover object-left-top"
                  draggable={false}
                />
              </ContainerScroll>

              <Glow
                variant="top"
                className="-z-10 animate-appear-zoom opacity-0 delay-1000"
              />
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

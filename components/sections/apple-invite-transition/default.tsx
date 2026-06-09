"use client";

import Glow from "@/components/ui/glow";
import AppleInvites, {
    type Event,
} from "@/components/ui/smoothui/apple-invites/index";

// Mocking data functions since @smoothui/data is not available
const getImageKitUrl = (path: string, options?: any) => path;
const getAvatarUrl = (avatar: string, size: number) => `https://i.pravatar.cc/${size}?u=${avatar}`;
const getAllPeople = () => [
    { avatar: "1" },
    { avatar: "2" },
    { avatar: "3" },
    { avatar: "4" },
];

const AVATAR_SIZE = 72;

const demoEvents: Event[] = [
    {
        id: 1,
        title: "Sam Altman",
        subtitle: "CEO, OpenAI",
        location: "\"Crucial for our AI infra.\"",
        image: getImageKitUrl("/sam.jpg", {
            width: 400,
            height: 500,
            quality: 80,
            format: "auto",
        }),
        badge: "Customer",
        participants: [
            {
                avatar: "/gpt.png",
            },
        ],
    },
    {
        id: 2,
        title: "Elon Musk",
        subtitle: "CEO, X Corp",
        location: "\"Hardcore security. Love it.\"",
        image: getImageKitUrl("/elon.jpg", {
            width: 400,
            height: 500,
            quality: 80,
            format: "auto",
        }),
        badge: "Partner",
        participants: [
            {
                avatar: "/x.png",
            },
        ],
    },
    {
        id: 3,
        title: "Satya Nadella",
        subtitle: "CEO, Microsoft",
        location: "\"Redefining zero-trust.\"",
        image: getImageKitUrl("/satya.jpg", {
            width: 400,
            height: 500,
            quality: 80,
            format: "auto",
        }),
        badge: "Enterprise",
        participants: [
            {
                avatar: "/win.png",
            },
        ],
    },
    {
        id: 4,
        title: "Jensen Huang",
        subtitle: "CEO, NVIDIA",
        location: "\"The new gold standard.\"",
        image: getImageKitUrl("/jensen.webp", {
            width: 400,
            height: 500,
            quality: 80,
            format: "auto",
        }),
        badge: "Investor",
        participants: [
            {
                avatar: "/nvidia.png",
            },
        ],
    },
];

const TopInvestors = () => (
    <div className="flex min-h-[500px] items-center justify-center">
        <AppleInvites
            cardWidth={{
                base: 100,
                sm: 140,
                md: 180,
                lg: 220,
                xl: 260,
            }}
            events={demoEvents}
        />
        <Glow
            variant="below"
            className="-z-10 opacity-10"
        />
    </div>
);

export default TopInvestors;

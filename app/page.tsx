import Link from "next/link"
import { ArrowRight, ImageIcon, Sparkles, Wand2, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const features = [
  {
    icon: Wand2,
    title: "Smart Prompt Expansion",
    description:
      "Turn a one-line idea into a full, platform-ready marketing brief — automatically optimized for reach and engagement.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Copywriting",
    description:
      "Generate scroll-stopping captions, viral hashtags, and compelling CTAs tailored to Instagram, LinkedIn, Facebook, and X.",
  },
  {
    icon: ImageIcon,
    title: "Visual Content Generation",
    description:
      "Create on-brand images in seconds with Stability AI — perfectly matched to your copy and ready to publish.",
  },
  {
    icon: Zap,
    title: "Refine & Regenerate",
    description:
      "Edit your expanded prompt, regenerate in one click, and iterate until every post is publish-perfect.",
  },
]

export default function Home() {
  return (
    <div className="min-h-full bg-background transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            AI Social Media Studio
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Ship publish-ready social content{" "}
            <span className="text-primary">10× faster</span>
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            SocialAI is your all-in-one content engine — from a rough idea to
            caption, hashtags, CTA, and AI-generated visuals. Built for creators,
            brands, and teams who move fast.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Link href="/generator">
                Start creating free
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-8 transition-all duration-200"
            >
              <Link href="/dashboard">View dashboard</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            No credit card required · Google or email sign-in
          </p>
        </section>

        <section className="mt-24 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.title}
              size="sm"
              className="rounded-2xl border-border/70 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md"
            >
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>
      </div>
    </div>
  )
}

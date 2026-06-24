import Link from "next/link"
import { ImageIcon, Sparkles, Wand2, Zap } from "lucide-react"

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
    title: "Smart prompt expansion",
    description:
      'Type "tea shop post" and get a full premium marketing brief — automatically.',
  },
  {
    icon: Sparkles,
    title: "AI-powered copy",
    description:
      "Captions, hashtags, and CTAs optimized for Instagram, LinkedIn, Facebook, and X.",
  },
  {
    icon: ImageIcon,
    title: "Visual content",
    description:
      "Generate and download matching images powered by Stability AI.",
  },
  {
    icon: Zap,
    title: "Refine & regenerate",
    description:
      "Edit the expanded prompt and regenerate until it's perfect.",
  },
]

export default function Home() {
  return (
    <div className="min-h-full bg-background transition-colors duration-300">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl space-y-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            AI Social Media Manager
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Create scroll-stopping content in{" "}
            <span className="text-primary">seconds</span>
          </h1>
          <p className="text-lg text-muted-foreground sm:text-xl">
            From a simple idea to a publish-ready post with caption, hashtags,
            CTA, and image — all in one premium workflow.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <Link href="/generator">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-8 transition-all duration-200"
            >
              <Link href="/generator">Try the Generator</Link>
            </Button>
          </div>
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

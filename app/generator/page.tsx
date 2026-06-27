import type { Metadata } from "next"

import { PostGenerator } from "@/components/generator/post-generator"

export const metadata: Metadata = {
  title: "Generator — SocialAI",
  description:
    "Generate platform-optimized social media posts and images with AI.",
}

export default function GeneratorPage() {
  return (
    <div className="min-h-full bg-background transition-colors duration-300">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-8 space-y-3 text-center lg:mb-10 lg:text-left">
          <p className="text-sm font-medium text-primary">AI Generator</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Social Media Post Generator
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Enter a simple prompt like &quot;tea shop post&quot; — we&apos;ll
            expand it, write your copy, and create a matching image.
          </p>
        </header>

        <PostGenerator />
      </div>
    </div>
  )
}

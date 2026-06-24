"use client"

import {
  Download,
  ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react"

import { CopyButton } from "@/components/generator/copy-button"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatHashtags, type GeneratePostResponse } from "@/lib/post-generator"

interface OutputPanelProps {
  mode: "text" | "image"
  result: GeneratePostResponse | null
  expandedPrompt: string
  onExpandedPromptChange: (value: string) => void
  imageUrl: string | null
  imageError: string | null
  isGeneratingImage: boolean
  isLoading: boolean
  copiedKey: string | null
  onCopy: (key: string, value: string) => void
  onRegenerate: () => void
  onRegenerateWithChanges: () => void
  onRegenerateImage: () => void
  onDownloadImage: () => void
  isDownloading: boolean
}

function OutputSection({
  title,
  children,
  action,
}: {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}

function OutputBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card p-4 text-sm leading-relaxed shadow-sm transition-colors duration-300">
      {children}
    </div>
  )
}

export function OutputPanel({
  mode,
  result,
  expandedPrompt,
  onExpandedPromptChange,
  imageUrl,
  imageError,
  isGeneratingImage,
  isLoading,
  copiedKey,
  onCopy,
  onRegenerate,
  onRegenerateWithChanges,
  onRegenerateImage,
  onDownloadImage,
  isDownloading,
}: OutputPanelProps) {
  const hashtagsText = result ? formatHashtags(result.hashtags) : ""
  const busy = isLoading || isGeneratingImage

  return (
    <Card className="h-fit rounded-2xl border-border/70 shadow-sm transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl">Generated content</CardTitle>
        <CardDescription>
          {result
            ? "Your post is ready. Refine the prompt or regenerate anytime."
            : "Caption, hashtags, CTA, and image will appear here."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-6">
            <OutputSection
              title="Caption"
              action={
                <CopyButton
                  value={result.caption}
                  copied={copiedKey === "caption"}
                  onCopy={() => onCopy("caption", result.caption)}
                />
              }
            >
              <OutputBlock>
                <p className="whitespace-pre-wrap">{result.caption}</p>
              </OutputBlock>
            </OutputSection>

            <OutputSection
              title="Hashtags"
              action={
                <CopyButton
                  value={hashtagsText}
                  copied={copiedKey === "hashtags"}
                  onCopy={() => onCopy("hashtags", hashtagsText)}
                />
              }
            >
              <OutputBlock>
                <p className="text-muted-foreground">{hashtagsText}</p>
              </OutputBlock>
            </OutputSection>

            {mode === "text" ? (
              <>
            <OutputSection title="Call to action">
              <OutputBlock>
                <p>{result.cta}</p>
              </OutputBlock>
            </OutputSection>

            <OutputSection title="Generated image">
              {isGeneratingImage ? (
                <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/30">
                  <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-6 animate-spin text-primary" />
                    Creating your image...
                  </div>
                </div>
              ) : imageUrl ? (
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-xl border border-border/70 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt="AI-generated social media image"
                      className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onDownloadImage}
                      disabled={isDownloading}
                      className="transition-all duration-200"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2
                            data-icon="inline-start"
                            className="animate-spin"
                          />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download data-icon="inline-start" />
                          Download Image
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={onRegenerateImage}
                      disabled={busy}
                      className="transition-all duration-200"
                    >
                      <RefreshCw data-icon="inline-start" />
                      Regenerate Image
                    </Button>
                  </div>
                </div>
              ) : imageError ? (
                <p className="text-sm text-destructive" role="alert">
                  {imageError}
                </p>
              ) : null}
            </OutputSection>
              </>
            ) : imageUrl ? (
              <OutputSection title="Uploaded image">
                <div className="overflow-hidden rounded-xl border border-border/70 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Uploaded image"
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </OutputSection>
            ) : null}

            {mode === "text" ? (
            <div className="space-y-3 border-t border-border/60 pt-6">
              <div className="space-y-2">
                <Label htmlFor="expanded-prompt" className="text-sm font-medium">
                  Refine prompt
                </Label>
                <Textarea
                  id="expanded-prompt"
                  value={expandedPrompt}
                  onChange={(event) =>
                    onExpandedPromptChange(event.target.value)
                  }
                  rows={5}
                  className="rounded-xl shadow-sm transition-all duration-200"
                  placeholder="Edit the expanded marketing prompt..."
                />
                <p className="text-xs text-muted-foreground">
                  Tweak the brief and regenerate content with your changes.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={onRegenerateWithChanges}
                  disabled={busy || !expandedPrompt.trim()}
                  className="transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        data-icon="inline-start"
                        className="animate-spin"
                      />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <Sparkles data-icon="inline-start" />
                      Regenerate with changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onRegenerate}
                  disabled={busy}
                  className="transition-all duration-200"
                >
                  <RefreshCw data-icon="inline-start" />
                  Regenerate
                </Button>
              </div>
            </div>
            ) : (
              <div className="border-t border-border/60 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onRegenerate}
                  disabled={busy}
                  className="transition-all duration-200"
                >
                  <RefreshCw data-icon="inline-start" />
                  Regenerate
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-80 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 p-8 text-center text-sm text-muted-foreground transition-colors duration-300">
            <div className="space-y-2">
              <ImageIcon className="mx-auto size-8 opacity-40" />
              <p>Enter a simple prompt and click Generate to get started.</p>
              <p className="text-xs">Try: &quot;tea shop post&quot; or &quot;gym membership promo&quot;</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

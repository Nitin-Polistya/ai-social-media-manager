"use client"

import { useCallback, useState } from "react"
import { Loader2, Sparkles, Wand2 } from "lucide-react"

import { useCopyToClipboard } from "@/components/generator/copy-button"
import { OutputPanel } from "@/components/generator/output-panel"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { downloadImage } from "@/lib/download-image"
import { saveGeneration } from "@/lib/firebase/save-generation"
import {
  BRAND_TONES,
  type BrandTone,
  type GenerateImageResponse,
  type GeneratePostRequest,
  type GeneratePostResponse,
  type ImageToCaptionHashtagsResponse,
  PLATFORMS,
  POST_TYPES,
  type Platform,
  type PostType,
} from "@/lib/post-generator"

type Mode = "text" | "image"

export function PostGenerator() {
  const [mode, setMode] = useState<Mode>("text")
  const [platform, setPlatform] = useState<Platform>("Instagram")
  const [postType, setPostType] = useState<PostType>("Promotion")
  const [brandTone, setBrandTone] = useState<BrandTone>("Professional")
  const [topic, setTopic] = useState("")
  const [expandedPrompt, setExpandedPrompt] = useState("")
  const [result, setResult] = useState<GeneratePostResponse | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null)
  const [uploadMimeType, setUploadMimeType] = useState("image/jpeg")
  const [lastRequest, setLastRequest] = useState<GeneratePostRequest | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { copiedKey, copy } = useCopyToClipboard()
  const { user } = useAuth()

  const generateImage = useCallback(async (prompt: string) => {
    setImageError(null)
    setIsGeneratingImage(true)
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      const data = (await response.json()) as GenerateImageResponse | { error: string }
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Failed to generate image")
      }
      setImageUrl(data.image_url)
      return data.image_url
    } catch (generateError) {
      setImageUrl(null)
      setImageError(generateError instanceof Error ? generateError.message : "Something went wrong")
      return null
    } finally {
      setIsGeneratingImage(false)
    }
  }, [])

  const generatePost = useCallback(
    async (request: GeneratePostRequest) => {
      setError(null)
      setImageError(null)
      setImageUrl(null)
      setIsLoading(true)
      try {
        const response = await fetch("/api/generate-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        })
        const data = (await response.json()) as GeneratePostResponse | { error: string }
        if (!response.ok || "error" in data) {
          throw new Error("error" in data ? data.error : "Failed to generate post")
        }
        setResult(data)
        setExpandedPrompt(data.expanded_prompt || request.customPrompt || request.topic)
        setLastRequest(request)
        let savedImageUrl: string | null = null
        if (data.image_prompt) savedImageUrl = await generateImage(data.image_prompt)
        if (user) {
          void saveGeneration({
            userId: user.uid,
            mode: "text",
            caption: data.caption,
            hashtags: data.hashtags,
            imageUrl: savedImageUrl,
          })
        }
      } catch (submitError) {
        setResult(null)
        setError(submitError instanceof Error ? submitError.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    },
    [generateImage, user]
  )

  const generateFromImage = useCallback(async () => {
    if (!uploadedBase64) {
      setError("Please upload an image.")
      return
    }
    setError(null)
    setImageError(null)
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate-from-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: uploadedBase64, mimeType: uploadMimeType }),
      })
      const data = (await response.json()) as ImageToCaptionHashtagsResponse | { error: string }
      if (!response.ok || "error" in data) {
        throw new Error("error" in data ? data.error : "Failed to analyze image")
      }
      setResult({
        caption: data.caption,
        hashtags: data.hashtags,
        cta: "",
        image_prompt: "",
        expanded_prompt: "",
      })
      if (user) {
        void saveGeneration({
          userId: user.uid,
          mode: "image",
          caption: data.caption,
          hashtags: data.hashtags,
          imageUrl,
        })
      }
    } catch (submitError) {
      setResult(null)
      setError(submitError instanceof Error ? submitError.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }, [uploadedBase64, uploadMimeType, user, imageUrl])

  function buildRequest(customPrompt?: string): GeneratePostRequest {
    return { platform, postType, topic, brandTone, ...(customPrompt ? { customPrompt } : {}) }
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setError(null)
    setResult(null)
    setUploadMimeType(file.type || "image/jpeg")
    setImageUrl(URL.createObjectURL(file))
    const reader = new FileReader()
    reader.onload = () => {
      const raw = reader.result as string
      setUploadedBase64(raw.includes(",") ? raw.split(",")[1] : raw)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (mode === "image") await generateFromImage()
    else await generatePost(buildRequest())
  }

  async function handleRegenerate() {
    if (mode === "image") await generateFromImage()
    else if (lastRequest) await generatePost(lastRequest)
  }

  async function handleRegenerateWithChanges() {
    if (!expandedPrompt.trim()) return
    await generatePost(buildRequest(expandedPrompt.trim()))
  }

  async function handleRegenerateImage() {
    const prompt = result?.image_prompt
    if (!prompt) return
    await generateImage(prompt)
  }

  async function handleDownloadImage() {
    if (!imageUrl) return
    setIsDownloading(true)
    try {
      await downloadImage(imageUrl)
    } catch {
      setImageError("Failed to download image. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 sm:gap-8 lg:grid-cols-2 lg:px-0">
      <Card className="rounded-2xl border-border/70 shadow-sm transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Wand2 className="size-5 text-primary" />
            Create your post
          </CardTitle>
          <CardDescription>
            {mode === "text"
              ? "Enter a simple idea — we'll expand it into premium marketing content automatically."
              : "Upload an image — we'll generate caption and hashtags."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant={mode === "text" ? "default" : "outline"}
                className="flex-1 rounded-xl"
                onClick={() => { setMode("text"); setError(null) }}
              >
                Text → Image + Caption + Hashtags
              </Button>
              <Button
                type="button"
                variant={mode === "image" ? "default" : "outline"}
                className="flex-1 rounded-xl"
                onClick={() => { setMode("image"); setError(null) }}
              >
                Image → Caption + Hashtags
              </Button>
            </div>

            {mode === "text" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="topic">Your idea</Label>
                  <Textarea
                    id="topic"
                    placeholder='e.g. "tea shop post" or "gym membership promo"'
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                    rows={3}
                    required
                    className="rounded-xl shadow-sm transition-all duration-200 focus-visible:ring-primary/30"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                      <SelectTrigger id="platform" className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{PLATFORMS.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-type">Post type</Label>
                    <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
                      <SelectTrigger id="post-type" className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{POST_TYPES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand-tone">Tone</Label>
                    <Select value={brandTone} onValueChange={(v) => setBrandTone(v as BrandTone)}>
                      <SelectTrigger id="brand-tone" className="w-full rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{BRAND_TONES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="image-upload">Upload image</Label>
                  <Input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} required />
                </div>
                {imageUrl ? (
                  <div className="overflow-hidden rounded-xl border border-border/70">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="max-h-48 w-full object-cover" />
                  </div>
                ) : null}
              </div>
            )}

            {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}

            <Button type="submit" className="w-full rounded-xl shadow-sm" disabled={isLoading || isGeneratingImage} size="lg">
              {isLoading ? (<><Loader2 data-icon="inline-start" className="animate-spin" />Generating...</>) : (<><Sparkles data-icon="inline-start" />Generate</>)}
            </Button>
          </form>
        </CardContent>
      </Card>

      <OutputPanel
        mode={mode}
        result={result}
        expandedPrompt={expandedPrompt}
        onExpandedPromptChange={setExpandedPrompt}
        imageUrl={imageUrl}
        imageError={imageError}
        isGeneratingImage={isGeneratingImage}
        isLoading={isLoading}
        copiedKey={copiedKey}
        onCopy={copy}
        onRegenerate={handleRegenerate}
        onRegenerateWithChanges={handleRegenerateWithChanges}
        onRegenerateImage={handleRegenerateImage}
        onDownloadImage={handleDownloadImage}
        isDownloading={isDownloading}
      />
    </div>
  )
}

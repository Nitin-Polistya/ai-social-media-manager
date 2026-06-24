"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  value: string
  label?: string
  copied: boolean
  onCopy: () => void
}

export function CopyButton({
  label = "Copy",
  copied,
  onCopy,
}: CopyButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onCopy}
      className="shrink-0 transition-all duration-200 hover:border-primary/40 hover:bg-primary/5"
      aria-label={`Copy ${label.toLowerCase()}`}
    >
      {copied ? (
        <>
          <Check data-icon="inline-start" />
          Copied
        </>
      ) : (
        <>
          <Copy data-icon="inline-start" />
          {label}
        </>
      )}
    </Button>
  )
}

export function useCopyToClipboard(resetMs = 2000) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  async function copy(key: string, value: string) {
    await navigator.clipboard.writeText(value)
    setCopiedKey(key)
    window.setTimeout(() => setCopiedKey(null), resetMs)
  }

  return { copiedKey, copy }
}

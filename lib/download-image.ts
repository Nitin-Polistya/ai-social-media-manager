export async function downloadImage(
  imageUrl: string,
  filename = "ai-social-post.png"
): Promise<void> {
  const response = await fetch(imageUrl)
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = objectUrl
  link.download = filename
  link.click()

  URL.revokeObjectURL(objectUrl)
}

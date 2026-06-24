import {
  type GeneratePostRequest,
  type GeneratePostResponse,
  type ImageToCaptionHashtagsResponse,
} from "@/lib/types/post-generator";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const SYSTEM_PROMPT_TEXT_TO_IMAGE = `You are an expert social media strategist and marketing copywriter.

SMART PROMPT EXPANSION:
When the user provides a brief input (e.g. "tea shop post", "gym membership promo"), you must:
1. Detect the business type (tea shop, gym, cafe, salon, restaurant, etc.)
2. Expand it into a premium, engaging, social-media-optimized marketing brief
3. Include sensory details, audience appeal, and platform-appropriate hooks
4. Store the full expanded brief in the expanded_prompt field

Return ONLY valid JSON with exactly these keys:
- expanded_prompt: string — the full expanded marketing brief you created and used
- caption: string — the main post text, formatted for the target platform
- hashtags: string[] — an array of 5–10 relevant hashtags, each including the # symbol
- cta: string — a concise, compelling call-to-action phrase
- image_prompt: string — a detailed, Stability-AI-optimized image prompt with subject, composition, lighting, mood, and style (no text overlays). This image prompt should be enhanced to be more descriptive, detailed, and optimized for better image generation.

Match the brand tone precisely. Respect platform conventions (character limits, hashtag usage, formality).`;

const SYSTEM_PROMPT_IMAGE_TO_CAPTION = `You are an expert social media strategist and marketing copywriter.

Analyze the provided image and generate:
- caption: string — an engaging, social-media-ready caption for the image.
- hashtags: string[] — an array of 10-15 viral hashtags relevant to the image content.`

function buildUserPrompt(request: GeneratePostRequest): string {
  const { platform, postType, topic, brandTone, customPrompt } = request;

  if (customPrompt?.trim()) {
    return `Use this refined marketing brief as the primary direction:
${customPrompt.trim()}

Platform: ${platform}
Post type: ${postType}
Brand tone: ${brandTone}`;
  }

  return `Brief user input: ${topic.trim()}
Expand this into a full marketing brief internally, then generate all content from it.

Platform: ${platform}
Post type: ${postType}
Brand tone: ${brandTone}`;
}

function extractJsonText(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);

  return fenced ? fenced[1].trim() : trimmed;
}

function normalizeHashtags(hashtags: unknown): string[] {
  if (!Array.isArray(hashtags)) {
    throw new Error("Invalid hashtags format");
  }

  const normalized = hashtags
    .filter((tag): tag is string => typeof tag === "string")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

  if (normalized.length === 0) {
    throw new Error("Invalid hashtags format");
  }

  return normalized;
}

function parseGeneratePostResponse(content: string): GeneratePostResponse {
  const parsed = JSON.parse(extractJsonText(content)) as Partial<GeneratePostResponse>;

  if (typeof parsed.caption !== "string" || typeof parsed.cta !== "string") {
    throw new Error("Invalid response structure from Gemini");
  }

  const expanded_prompt =
    typeof parsed.expanded_prompt === "string"
      ? parsed.expanded_prompt.trim()
      : "";

  return {
    expanded_prompt,
    caption: parsed.caption.trim(),
    hashtags: normalizeHashtags(parsed.hashtags),
    cta: parsed.cta.trim(),
    image_prompt:
      typeof parsed.image_prompt === "string"
        ? parsed.image_prompt.trim()
        : "",
  };
}

function parseImageToCaptionHashtagsResponse(
  content: string
): ImageToCaptionHashtagsResponse {
  const parsed = JSON.parse(extractJsonText(content)) as Partial<ImageToCaptionHashtagsResponse>;

  if (typeof parsed.caption !== "string") {
    throw new Error("Invalid response structure from Gemini Vision");
  }

  return {
    caption: parsed.caption.trim(),
    hashtags: normalizeHashtags(parsed.hashtags),
  };
}

export async function generatePost(
  request: GeneratePostRequest
): Promise<GeneratePostResponse> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    // TODO: Implement a proper mock response in the Content Engine
    return {
      expanded_prompt: "[Mock] Expanded prompt for " + request.topic,
      caption: "[Mock] Caption for " + request.topic,
      hashtags: ["#mock", "#demo"],
      cta: "[Mock] CTA",
      image_prompt: "[Mock] Image prompt for " + request.topic,
    };
  }

  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT_TEXT_TO_IMAGE }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: buildUserPrompt(request) }],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Gemini API error:", errorBody);
    throw new Error("Gemini request failed");
  }

  const completion = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const content = completion.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("Empty response from Gemini");
  }

  return parseGeneratePostResponse(content);
}

const MOCK_IMAGE_RESPONSE: ImageToCaptionHashtagsResponse = {
  caption:
    "Sun-kissed moments and good vibes only. ✨ What would you caption this?",
  hashtags: [
    "#PhotoOfTheDay",
    "#InstaGood",
    "#Viral",
    "#ContentCreator",
    "#SocialMedia",
    "#Trending",
    "#Aesthetic",
    "#ExplorePage",
  ],
}

function stripBase64Prefix(image: string): string {
  const match = image.match(/^data:[^;]+;base64,(.+)$/)
  return match ? match[1] : image
}

export async function imageToCaptionHashtags(
  image: string,
  mimeType = "image/jpeg"
): Promise<ImageToCaptionHashtagsResponse> {
  const data = stripBase64Prefix(image.trim())
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    return MOCK_IMAGE_RESPONSE
  }

  const imagePart = {
    inlineData: {
      mimeType: mimeType || "image/jpeg",
      data,
    },
  }

  try {
  const response = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT_IMAGE_TO_CAPTION }],
      },
      contents: [
        {
          role: "user",
          parts: [
            imagePart,
            { text: "Analyze this image and generate a caption and 10-15 viral hashtags." },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.8,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text()
    console.error("Gemini Vision API error:", errorBody)
    return MOCK_IMAGE_RESPONSE
  }

  const completion = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
    }>
  }

  const content = completion.candidates?.[0]?.content?.parts?.[0]?.text

  if (!content) {
    return MOCK_IMAGE_RESPONSE
  }

  return parseImageToCaptionHashtagsResponse(content)
  } catch (error) {
    console.error("Gemini Vision request failed:", error)
    return MOCK_IMAGE_RESPONSE
  }
}

export const generateCaptionAndHashtagsFromImage = imageToCaptionHashtags
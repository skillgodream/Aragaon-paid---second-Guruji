/**
 * Unified Image Generation Service
 * Supports FLUX.1 Schnell (via Fal.ai) and Gemini Image models (via Google GenAI),
 * with runtime and environment-based toggling and instant quota circuit breaking.
 */

import { GoogleGenAI } from '@google/genai';

export type ImageProvider = 'flux' | 'imagen';

export interface ImageGenerationConfig {
  provider: ImageProvider;
  activeModel: string;
  hasFalKey: boolean;
  hasGeminiKey: boolean;
  availableProviders: ImageProvider[];
  models: {
    flux: string;
    imagen: string;
  };
}

export interface GenerateImageOptions {
  prompt: string;
  role?: string;
  stepTitle?: string;
  aspectRatio?: '16:9' | '1:1' | '4:3' | '3:4' | '9:16';
  provider?: ImageProvider;
  geminiApiKey?: string;
  falApiKey?: string;
}

export interface GenerateImageResult {
  success: boolean;
  provider: ImageProvider;
  model: string;
  imageUrl?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  seed?: number;
  error?: string;
  isQuotaExceeded?: boolean;
  originalPrompt: string;
  enhancedPrompt: string;
  durationMs?: number;
}

// In-memory runtime override if toggled dynamically in the app
let runtimeProviderOverride: ImageProvider | null = null;

// Global & per-model cooldown circuit breaker to avoid repeatedly calling models with 0 free-tier quota
const modelCooldownUntil = new Map<string, number>();
let globalGeminiImageQuotaPausedUntil = 0;

function isModelInCooldown(model: string): boolean {
  if (Date.now() < globalGeminiImageQuotaPausedUntil) return true;
  const until = modelCooldownUntil.get(model);
  if (!until) return false;
  if (Date.now() < until) return true;
  modelCooldownUntil.delete(model);
  return false;
}

function recordModelFailure(model: string, err: any): boolean {
  const rawMsg = String(err?.message || err || '');
  const isZeroFreeTierQuota =
    rawMsg.includes('limit: 0') ||
    rawMsg.includes('free_tier') ||
    rawMsg.includes('NOT_FOUND') ||
    rawMsg.includes('404');
  const isQuotaOrRateLimit =
    isZeroFreeTierQuota ||
    rawMsg.includes('429') ||
    rawMsg.includes('RESOURCE_EXHAUSTED') ||
    rawMsg.includes('quota') ||
    err?.status === 429 ||
    err?.code === 429;

  if (isZeroFreeTierQuota) {
    // Pause all free-tier image generation for 60 minutes when free-tier limit is 0
    const pauseUntil = Date.now() + 60 * 60 * 1000;
    modelCooldownUntil.set(model, pauseUntil);
    globalGeminiImageQuotaPausedUntil = pauseUntil;
  } else if (isQuotaOrRateLimit) {
    const pauseUntil = Date.now() + 10 * 60 * 1000;
    modelCooldownUntil.set(model, pauseUntil);
    globalGeminiImageQuotaPausedUntil = pauseUntil;
  }
  return isQuotaOrRateLimit;
}

/**
 * Normalizes and extracts the active Fal API key from environment or request.
 */
export function getFalApiKey(overrideKey?: string): string | undefined {
  const raw = (
    overrideKey ||
    process.env.FAL_KEY ||
    process.env.FAL_API_KEY ||
    process.env.VITE_FAL_KEY ||
    ''
  ).trim();
  const cleaned = raw.replace(/^["']|["']$/g, '').trim();
  return cleaned || undefined;
}

/**
 * Normalizes and extracts the Gemini API key from environment or request.
 */
export function getGeminiApiKey(overrideKey?: string): string | undefined {
  const raw = (
    overrideKey ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.API_KEY ||
    ''
  ).trim();
  const cleaned = raw.replace(/^["']|["']$/g, '').trim();
  return cleaned || undefined;
}

/**
 * Resolves the configured image generation provider.
 */
export function getActiveImageProvider(): ImageProvider {
  if (runtimeProviderOverride) {
    return runtimeProviderOverride;
  }

  const envConfig = (
    process.env.IMAGE_GENERATION_PROVIDER ||
    process.env.IMAGE_PROVIDER ||
    ''
  ).toLowerCase().trim();

  if (envConfig.startsWith('imagen') || envConfig === 'google' || envConfig.startsWith('gemini')) {
    return 'imagen';
  }
  if (envConfig.startsWith('flux') || envConfig === 'fal') {
    if (getFalApiKey()) {
      return 'flux';
    }
    if (getGeminiApiKey()) {
      return 'imagen';
    }
    return 'flux';
  }

  const hasGemini = Boolean(getGeminiApiKey());
  const hasFal = Boolean(getFalApiKey());

  if (hasGemini) return 'imagen';
  if (hasFal) return 'flux';

  return 'imagen';
}

/**
 * Allows switching provider at runtime.
 */
export function setRuntimeImageProvider(provider: ImageProvider | null): void {
  runtimeProviderOverride = provider;
}

/**
 * Returns complete configuration status for UI inspection.
 */
export function getImageGenerationConfig(): ImageGenerationConfig {
  const currentProvider = getActiveImageProvider();
  const hasFal = Boolean(getFalApiKey());
  const hasGemini = Boolean(getGeminiApiKey());

  const fluxModel = process.env.FLUX_MODEL || 'fal-ai/flux/schnell';
  const imagenModel = process.env.IMAGEN_MODEL || 'gemini-2.5-flash-image';

  const available: ImageProvider[] = [];
  if (hasGemini) available.push('imagen');
  if (hasFal) available.push('flux');
  if (available.length === 0) {
    available.push('imagen', 'flux');
  }

  return {
    provider: currentProvider,
    activeModel: currentProvider === 'flux' ? fluxModel : imagenModel,
    hasFalKey: hasFal,
    hasGeminiKey: hasGemini,
    availableProviders: available,
    models: {
      flux: fluxModel,
      imagen: imagenModel,
    },
  };
}

/**
 * Enhances raw SOP instructions into a rich photographic workplace prompt.
 * Ensures the generated visuals are documentary-style, realistic, and contain zero burnt text.
 */
export function buildEnhancedSOPPrompt(
  prompt: string,
  role?: string,
  stepTitle?: string
): string {
  const roleName = role ? role.trim() : 'professional workplace frontline specialist';
  const actionDescription = prompt.trim();
  const context = stepTitle ? `Action: "${stepTitle}". ` : '';

  return (
    `Editorial workplace photograph of a ${roleName} performing an operational task in an authentic commercial workplace environment. ` +
    `${context}${actionDescription}. ` +
    `Warm natural architectural lighting, shallow depth of field, medium shot showing authentic human interaction, tools, or workstation. ` +
    `Photorealistic, editorial magazine photography, high resolution 4k, crisp authentic details. ` +
    `Strictly a real photograph — Zero burned-in text, NO tables, NO charts, NO diagrams, NO watermarks, NO logos.`
  );
}

/**
 * Generates an image using FLUX.1 Schnell via Fal.ai.
 */
async function generateWithFluxSchnell(
  enhancedPrompt: string,
  aspectRatio: string,
  falKey?: string
): Promise<{ imageUrl: string; seed?: number }> {
  const resolvedKey = getFalApiKey(falKey);
  if (!resolvedKey) {
    throw new Error(
      'FAL_KEY is not configured on the server. Please set FAL_KEY in your environment to use FLUX.1 Schnell.'
    );
  }

  const model = process.env.FLUX_MODEL || 'fal-ai/flux/schnell';
  const endpoint = `https://fal.run/${model}`;

  let imageSize: any = 'landscape_16_9';
  if (aspectRatio === '1:1') imageSize = 'square_hd';
  else if (aspectRatio === '9:16') imageSize = 'portrait_16_9';
  else if (aspectRatio === '4:3') imageSize = 'landscape_4_3';
  else if (aspectRatio === '3:4') imageSize = 'portrait_4_3';

  const body = {
    prompt: enhancedPrompt,
    image_size: imageSize,
    num_inference_steps: 4,
    num_images: 1,
    enable_safety_checker: true,
    sync_mode: true,
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Key ${resolvedKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'aistudio-flux-service',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errText = await response.text();
      try {
        const errJson = JSON.parse(errText);
        errorDetail = errJson.detail || errJson.message || errText;
      } catch {
        errorDetail = errText;
      }
    } catch {
      errorDetail = `HTTP ${response.status}`;
    }
    throw new Error(`Fal.ai FLUX API returned status ${response.status}: ${errorDetail}`);
  }

  const data = await response.json();
  const images = data.images || [];
  if (!images.length || !images[0]?.url) {
    throw new Error('Fal.ai returned success response but no image URL was found.');
  }

  return {
    imageUrl: images[0].url,
    seed: data.seed,
  };
}

/**
 * Generates a photorealistic workplace image using Google GenAI generateContent image models.
 * Uses a fast circuit breaker so free-tier keys with limit: 0 fall back immediately without console noise.
 */
async function generateWithImagen(
  enhancedPrompt: string,
  aspectRatio: string,
  geminiKey?: string
): Promise<{ imageUrl: string; model: string }> {
  if (Date.now() < globalGeminiImageQuotaPausedUntil) {
    throw new Error('QUOTA_EXHAUSTED: Gemini image generation quota is paused for this session.');
  }

  const resolvedKey = getGeminiApiKey(geminiKey);
  if (!resolvedKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY to use Gemini Image.'
    );
  }

  const ai = new GoogleGenAI({
    apiKey: resolvedKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const validRatios: ('1:1' | '3:4' | '4:3' | '9:16' | '16:9')[] = [
    '1:1', '3:4', '4:3', '9:16', '16:9',
  ];
  const mappedRatio = validRatios.includes(aspectRatio as any)
    ? (aspectRatio as '1:1' | '3:4' | '4:3' | '9:16' | '16:9')
    : '16:9';

  const geminiImageModels = [
    process.env.IMAGEN_MODEL && process.env.IMAGEN_MODEL.startsWith('gemini-')
      ? process.env.IMAGEN_MODEL
      : '',
    'gemini-2.5-flash-image',
    'gemini-3.1-flash-image-preview',
  ].filter((m, idx, arr) => Boolean(m) && arr.indexOf(m) === idx);

  for (const imgModel of geminiImageModels) {
    if (isModelInCooldown(imgModel)) {
      continue;
    }
    try {
      const response = await ai.models.generateContent({
        model: imgModel,
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: mappedRatio,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          return {
            imageUrl: `data:${mime};base64,${part.inlineData.data}`,
            model: imgModel,
          };
        }
      }
    } catch (flashErr: any) {
      const isQuota = recordModelFailure(imgModel, flashErr);
      if (isQuota) {
        // Immediate break — free-tier keys with limit:0 share quota across image models
        break;
      }
    }
  }

  throw new Error('QUOTA_EXHAUSTED: Gemini image generation quota reached on current API key tier.');
}

/**
 * Main entry point: Generates an image using either Google Gemini Image ('imagen') or FLUX.1 Schnell ('flux'),
 * respecting provider overrides, environment toggles, and fallbacks.
 */
export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResult> {
  const startTime = Date.now();
  const provider = options.provider || getActiveImageProvider();
  const aspectRatio = options.aspectRatio || '16:9';

  const enhancedPrompt = buildEnhancedSOPPrompt(
    options.prompt,
    options.role,
    options.stepTitle
  );

  const fluxModel = process.env.FLUX_MODEL || 'fal-ai/flux/schnell';
  const imagenModel = process.env.IMAGEN_MODEL || 'gemini-2.5-flash-image';
  const targetModel = provider === 'flux' ? fluxModel : imagenModel;

  try {
    if (provider === 'flux') {
      const result = await generateWithFluxSchnell(
        enhancedPrompt,
        aspectRatio,
        options.falApiKey
      );
      return {
        success: true,
        provider: 'flux',
        model: targetModel,
        imageUrl: result.imageUrl,
        seed: result.seed,
        originalPrompt: options.prompt,
        enhancedPrompt,
        durationMs: Date.now() - startTime,
      };
    } else {
      const result = await generateWithImagen(
        enhancedPrompt,
        aspectRatio,
        options.geminiApiKey
      );
      return {
        success: true,
        provider: 'imagen',
        model: result.model || targetModel,
        imageUrl: result.imageUrl,
        mimeType: 'image/jpeg',
        originalPrompt: options.prompt,
        enhancedPrompt,
        durationMs: Date.now() - startTime,
      };
    }
  } catch (primaryErr: any) {
    const errorMsg = primaryErr?.message || String(primaryErr);
    const isQuotaExceeded =
      errorMsg.includes('QUOTA_EXHAUSTED') ||
      errorMsg.includes('429') ||
      errorMsg.includes('RESOURCE_EXHAUSTED') ||
      errorMsg.includes('limit: 0');

    if (provider === 'flux' && getGeminiApiKey(options.geminiApiKey)) {
      try {
        const fallbackResult = await generateWithImagen(
          enhancedPrompt,
          aspectRatio,
          options.geminiApiKey
        );
        return {
          success: true,
          provider: 'imagen',
          model: fallbackResult.model || imagenModel,
          imageUrl: fallbackResult.imageUrl,
          mimeType: 'image/jpeg',
          originalPrompt: options.prompt,
          enhancedPrompt,
          durationMs: Date.now() - startTime,
        };
      } catch {
        // Fallback also unavailable
      }
    }

    if (provider === 'imagen' && getFalApiKey(options.falApiKey)) {
      try {
        const fallbackResult = await generateWithFluxSchnell(
          enhancedPrompt,
          aspectRatio,
          options.falApiKey
        );
        return {
          success: true,
          provider: 'flux',
          model: fluxModel,
          imageUrl: fallbackResult.imageUrl,
          seed: fallbackResult.seed,
          originalPrompt: options.prompt,
          enhancedPrompt,
          durationMs: Date.now() - startTime,
        };
      } catch {
        // Fallback also unavailable
      }
    }

    return {
      success: false,
      provider,
      model: targetModel,
      error: errorMsg,
      isQuotaExceeded,
      originalPrompt: options.prompt,
      enhancedPrompt,
      durationMs: Date.now() - startTime,
    };
  }
}

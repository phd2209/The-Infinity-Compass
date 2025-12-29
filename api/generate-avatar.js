import Replicate from 'replicate';
import { RateLimiter } from './utils/rateLimiter.js';

/**
 * Generate Cosmic Avatar using Replicate API
 * POST /api/generate-avatar
 * Body: { prompt, numerologyData }
 *
 * Uses SDXL model for high-quality portrait generation
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, numerologyData } = req.body;

  // Validate required fields
  if (!prompt) {
    return res.status(400).json({
      error: 'invalid_request',
      message: 'Missing required field: prompt',
    });
  }

  // Apply rate limiting (more restrictive for image generation)
  const limiter = new RateLimiter(3, 1); // 3 avatar generations per minute
  const identifier = req.ip || 'unknown';
  const rateLimitResult = limiter.check(identifier);

  // Add rate limit headers
  res.setHeader('X-RateLimit-Limit', limiter.maxRequests);
  res.setHeader('X-RateLimit-Remaining', rateLimitResult.remaining);
  res.setHeader('X-RateLimit-Reset', Math.floor(rateLimitResult.resetTime / 1000));

  if (!rateLimitResult.allowed) {
    return res.status(429).json({
      error: 'rate_limit_exceeded',
      message: 'Too many avatar generation requests. Please wait a moment.',
      retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
    });
  }

  // Check for API key
  const apiKey = process.env.REPLICATE_API_KEY;
  if (!apiKey) {
    console.error('REPLICATE_API_KEY not configured');
    return res.status(500).json({
      error: 'configuration_error',
      message: 'Avatar generation service not configured',
    });
  }

  try {
    console.log('Generating avatar with Replicate...');
    console.log('Prompt:', prompt.substring(0, 100) + '...');

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: apiKey,
    });

    // Use SDXL model - excellent for portraits with mystical/fantasy themes
    // Model: stability-ai/sdxl
    // Use prediction API to avoid streaming issues
    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt: prompt,
        negative_prompt: "ugly, deformed, blurry, bad anatomy, bad proportions, distorted face, low quality, watermark, text, duplicate, mutation, disfigured",
        width: 1024,
        height: 1024,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 25,
        guidance_scale: 7.5,
        seed: Math.floor(Math.random() * 1000000), // Random seed for variety
      }
    });

    console.log('Prediction created:', prediction.id);

    // Wait for the prediction to complete
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      result = await replicate.predictions.get(prediction.id);
      console.log('Prediction status:', result.status);
    }

    if (result.status === 'failed') {
      throw new Error(`Prediction failed: ${result.error || 'Unknown error'}`);
    }

    console.log('Replicate output:', result.output);

    // Replicate returns an array of image URLs
    const imageUrl = Array.isArray(result.output) ? result.output[0] : result.output;

    if (!imageUrl) {
      throw new Error('No image URL returned from Replicate');
    }

    console.log('Avatar generated successfully:', imageUrl);

    return res.status(200).json({
      imageUrl: imageUrl,
      prompt: prompt,
      model: 'stability-ai/sdxl',
      numerologyData: numerologyData, // Echo back for reference
    });

  } catch (error) {
    console.error('Error generating avatar:', error);

    // Handle specific error types
    if (error.message?.includes('insufficient credits')) {
      return res.status(402).json({
        error: 'payment_required',
        message: 'Avatar generation credits exhausted. Please contact support.',
      });
    }

    if (error.message?.includes('rate limit')) {
      return res.status(429).json({
        error: 'rate_limit_exceeded',
        message: 'External API rate limit reached. Please try again in a moment.',
      });
    }

    return res.status(500).json({
      error: 'generation_failed',
      message: 'Failed to generate avatar. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

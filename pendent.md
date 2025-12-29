Numerology Crystal Pendant GuideThis Markdown file summarizes the numerology-based crystal pendant feature for your site. It includes the association table (tied to traditional numerology meanings) and detailed logic for implementation, especially the AI image generation for previews.You can copy-paste this entire content into a file named numerology-pendant-guide.md in your project (e.g., in a docs folder).Numerology Associations TableThe crystal and material are automatically selected based on the user's reduced numerology number(s) (e.g., from birth day or name). These links stem from numerological traits, planetary rulerships, and metaphysical properties.Number
Suggested Crystals (with brief vibe)
Suggested Pendant Material (chain/base)
1
Garnet (courage, strength), Clear Quartz (clarity, amplification), Citrine (success, energy)
Gold (leadership, vitality)
2
Rutilated Quartz (confidence, protection), Moonstone (intuition, harmony), Selenite (peace, cleansing)
Silver (emotional balance, receptivity)
3
Amazonite (communication, creativity), Carnelian (joy, motivation), Sunstone (optimism, vitality)
Gold or Tin (expansion, expression)
4
Green Quartz (balance, well-being), Hematite (grounding, stability), Black Tourmaline (protection, structure)
Iron/Steel or Platinum (endurance, durability)
5
Aquamarine (courage, adaptability), Amazonite (freedom, adventure), Labradorite (change, intuition)
Brass/Bronze (versatility, quick thinking)
6
Blue Quartz (harmony, calm), Rose Quartz (love, compassion), Green Aventurine (nurturing, prosperity)
Copper or Silver (beauty, relationships)
7
Amethyst (spirituality, insight), Labradorite (mysticism, transformation)
Bronze or Silver (introspection, wisdom)
8
Citrine (abundance, intellect), Pyrite (success, protection), Garnet (power, manifestation)
Iron/Steel or Gold (ambition, authority)
9
Rose Quartz (unconditional love, empathy), Malachite (transformation, healing), Lapis Lazuli (wisdom, truth)
Copper or Gold (humanitarianism, passion)

Examples of Real-World Inspirations (for prompt crafting or design reference):Implementation Logic (for Your React Vite + Node.js/Vercel Setup)1. Data StorageStore the table in your backend (e.g., as a JSON file or object in code).Example pendantAssociations.js (Node.js module):js

export const pendantAssociations = {
  1: { crystals: ['Garnet', 'Clear Quartz', 'Citrine'], material: 'Gold' },
  2: { crystals: ['Rutilated Quartz', 'Moonstone', 'Selenite'], material: 'Silver' },
  // ... add all 1-9
};

2. WorkflowAfter numerology reading: Compute reduced number(s), e.g., birth day reduction (29 → 11 → 2).
Select primary crystal (e.g., first in list or random) and material.
User selects pendant type (shape/style): Oval, Heart, Teardrop, Hexagon, Raw, etc.
Engraving: ${firstName} ${reducedNumber} (e.g., "Emma 2").

3. AI Image Generation (Using Replicate)Since you already use Replicate, create a Vercel Lambda function (API route) to generate previews.Example API route (api/generate-pendant.js in /pages/api or /app/api for App Router):js

import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { crystal, material, shape, engraving, name, number } = req.body;

  const prompt = `Photorealistic professional jewelry photo of a ${shape}-shaped necklace pendant made from ${material} metal, featuring a faceted ${crystal} gemstone as the centerpiece. The back or side of the crystal is engraved with "${engraving}" in elegant script font. Sparkling under soft studio lighting, high detail, isolated on white background, mystical numerology vibe.`;

  const negativePrompt = 'blurry, text overlay, people, distorted, low quality';

  try {
    const output = await replicate.run('stability-ai/sdxl:your-model-id-or-default', {
      input: { prompt, negative_prompt: negativePrompt, width: 768, height: 768 },
    });
    res.status(200).json({ imageUrl: output[0] });
  } catch (error) {
    res.status(500).json({ error });
  }
}

In React frontend: Call this API after user selects type, display the image, allow regenerate.4. Frontend Integration (React)Use a form/dropdown for pendant types.
Show loading spinner during generation.
Display generated image with "Buy" or "Download Preview" button.

5. Replicate Model Recommendations, Prompting, and Pendant Page SelectionsThis section covers recommendations for Replicate models, best practices for crafting prompts, details on the user selection flow on the "Pendant" page, and how those selections dynamically translate into the AI prompt for image generation.Replicate Model RecommendationsReplicate offers various models suitable for generating photorealistic jewelry images. Based on your use case (custom pendants with crystals, engravings, and materials), here are top recommendations:stability-ai/sdxl (or variants like stability-ai/stable-diffusion-xl-base-1.0): Excellent for photorealism, detail in gems/metals, and custom prompts. It's fast and handles intricate descriptions well. Use this as the default for high-quality previews.
black-forest-labs/flux-dev or black-forest-labs/flux-schnell: Great for speed and realism in product renders. Flux models excel at coherent compositions (e.g., accurate engraving placement) and are more efficient for Vercel Lambdas (lower latency/cost).
stability-ai/stable-diffusion-3-medium: If you need better text rendering for engravings, this handles legible script fonts more reliably.
Fallback/Alternatives: If photorealism isn't perfect, try fofr/realvisxl-v3 for hyper-realistic jewelry-specific outputs.

In your API code, specify the model in the replicate.run() call (e.g., replace 'stability-ai/sdxl:your-model-id-or-default' with the full model path). Test models in Replicate's playground first. Start with default settings (e.g., 768x768 resolution, 20-50 steps) and adjust for quality vs. speed—aim for under 10-15 seconds per generation to keep users engaged.Prompting Best PracticesPrompts are key to getting consistent, high-quality images. Use a template structure to ensure scalability:Base Structure: Descriptive + Specific Elements + Style + Constraints.Start with style: "Photorealistic professional jewelry product photo of..."
Add core elements: Pendant type/shape, material, crystal, engraving.
Enhance vibe: Tie to numerology (e.g., "with an ethereal glow symbolizing harmony" for number 2).
End with technicals: "High detail, sparkling facets, isolated on white background, 8k resolution."

Variables to Inject: Dynamically insert user/numerology data (see translation below).
Negative Prompts: Always include to avoid artifacts: "blurry, deformed, extra limbs, text artifacts, low resolution, ugly, mutated."
Tips:Be verbose for better results: Describe crystal properties (e.g., "iridescent blue moonstone with milky sheen").
Use weights: In prompts, add (emphasis:1.2) for key parts, like "(engraved text:1.3)".
Iterate: Generate 2-3 variations per call (Replicate supports batching) and let users choose.
Length: Keep under 200 tokens for most models to avoid truncation.

Example Full Prompt: For number 2 (Moonstone, Silver, Heart shape, engraving "Emma 2"):
"Photorealistic image of a heart-shaped necklace pendant crafted from polished silver metal, centered with a faceted moonstone gemstone that shimmers with iridescent blues and whites, symbolizing intuition and harmony. The side of the pendant is engraved with 'Emma 2' in elegant cursive script. Sparkling under soft studio lighting, highly detailed facets and reflections, isolated on a neutral white background, professional e-commerce style, 8k ultra HD."

Details on Selections in the "Pendant" PageThe "Pendant" page (e.g., a React component like PendantCustomizer.jsx) should appear after the numerology reading, as an upsell or extension. Flow:Auto-Selected Elements: Display the recommended crystal and material based on the user's numbers (e.g., "Based on your birth number 2, we recommend Moonstone in Silver for harmony and intuition."). Show 1-3 crystal options from the table (e.g., dropdown to pick among Rutilated Quartz, Moonstone, Selenite), but default to the first or most "vibrant" one. Material is fixed per number but could allow overrides if desired.
User Selections: Pendant Type/Shape: Dropdown or cards with previews (e.g., "Necklace (Classic)", "Keychain", "Heart Shape", "Oval", "Raw Crystal"). Limit to 5-8 options to simplify.
Engraving Preview: Text input for custom tweaks (default: first name + reduced number), with a live text preview.
Additional Customizations (Optional): Chain length, accent colors, or "Add Glow Effect" checkbox for mystical vibe.

UI Elements: Info Cards: Explain links (e.g., "Moonstone enhances your number 2's emotional balance.").
Generate Button: Triggers API call after selections.
Feedback Loop: Show generated image(s), with "Regenerate" or "Try Different Crystal" buttons.

State Management: Use React state (or Redux) to hold selections, update prompt variables on change.

This keeps the page interactive and tied to the reading, boosting personalization without overwhelming users.How Selections Translate into the PromptSelections plug directly into the prompt template for dynamic generation. In code (e.g., in the API handler or frontend before sending), build the prompt by interpolating variables:Mapping:Numerology Number → Crystal/Material: Lookup from pendantAssociations (e.g., number 2 → crystal = 'Moonstone', material = 'Silver').
User Pendant Type → Shape/Style: e.g., "heart-shaped necklace pendant".
Engraving → Text: e.g., "engraved with 'Emma 2' in elegant script".
Optional Vibe: Append number's brief description (from table) for thematic enhancement, e.g., "symbolizing intuition and harmony".

Template in Code:js

const prompt = `
  Photorealistic professional jewelry photo of a ${selectedShape}-shaped ${selectedType} made from ${material} metal,
  featuring a faceted ${crystal} gemstone as the centerpiece.
  The ${engravingPosition} is engraved with "${engravingText}" in elegant script font.
  Sparkling under soft studio lighting, high detail, isolated on white background,
  mystical numerology vibe symbolizing ${numberVibe}.
`;

Examples of Translation:Input: Number 5 (Aquamarine, Brass), Shape: Oval, Type: Keychain, Engraving: "Jordan 5", Vibe: "freedom and adventure".
→ Prompt: "Photorealistic... oval-shaped keychain made from brass metal, featuring a faceted aquamarine gemstone... engraved with 'Jordan 5'... symbolizing freedom and adventure."
If user picks alternate crystal (e.g., Labradorite for 5): Override in prompt for "labradorite gemstone with iridescent flashes".

This ensures the AI output matches exactly what the user sees/sees, creating a seamless experience.This setup fits perfectly with Vercel Lambdas (serverless functions) and your existing Replicate usage. Start with free previews, then upsell physical versions via partners.


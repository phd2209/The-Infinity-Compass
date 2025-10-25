# Demo Screenshots

This folder contains the screenshots used in the demo modal on the login page.

## Current Files

- `fortune-teller.png` - Fortune teller image for welcome slide
- `discord-auth.PNG` - Discord OAuth authorization screen
- `nft-selection.PNG` - Wallet address entry page
- `nft-selection_1.PNG` - NFT selection and details entry page
- `reading-sample.PNG` - Sample numerology reading result

## Important Notes

**This is the ONLY location for demo images.**

- ✅ Files in `public/` are served at the root level in both dev and production
- ✅ Images are referenced as `/demo/filename.png` in the code
- ✅ Vite automatically copies `public/` contents to `dist/` during build
- ❌ Do NOT place these files in `src/assets/` - it creates confusion and duplication

## Updating Screenshots

To update or add new screenshots:

1. Place the new image file in this `public/demo/` folder
2. Update the image path in `src/components/DemoModal.tsx` if needed
3. Use the path format: `/demo/filename.png`
4. No import statements needed - files are served directly

## File Format

- **Format:** PNG or JPG
- **Recommended size:** At least 800px wide for clarity
- **File naming:** Use descriptive names with hyphens (e.g., `discord-auth.PNG`)

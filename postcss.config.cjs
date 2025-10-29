module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss').default({
      content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './public/**/*.{html,js}',
      ],
      defaultExtractor: content => {
        // Extract class names from HTML and Vue templates
        const extracted = content.match(/[\w-/:]*[\w-]/g) || [];
        // Remove duplicates
        return [...new Set(extracted)];
      },
      safelist: [
        // Add classes to safelist that should not be purged
        // Common Tailwind-like classes that might be used dynamically
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
        /data-(.*?)/,
        // Add specific classes that might be dynamically generated
        'active',
        'inactive',
        'show',
        'hide',
        'visible',
        'hidden',
        // Add colors from the game
        'bg-red',
        'bg-green', 
        'bg-yellow',
        'bg-orange',
        'bg-blue',
        'bg-purple',
        'bg-nila',
        'text-red',
        'text-green',
        'text-yellow',
        'text-orange',
        'text-blue',
        'text-purple',
        'text-nila',
        // Add responsive prefixes
        /^sm:/,
        /^md:/,
        /^lg:/,
        /^xl:/,
        /^2xl:/,
        // Special classes for number grid and sequence display
        'w-8', 'w-10', 'w-12', 'h-8', 'h-10', 'h-12',
      ]
    })
  ]
}
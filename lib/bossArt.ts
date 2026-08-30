/**
 * Shared art for conquered phases — jagged crack lines drawn over the ruined
 * section. Raw SVG string so it can be used from React
 * (dangerouslySetInnerHTML) and the DOM-built victory splash alike.
 * Strokes use currentColor.
 */
export const CRACKS_SVG = `<svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true" preserveAspectRatio="none">
  <path stroke-width="2.5" d="M300 150 L245 118 L210 122 L168 92 M245 118 L228 84 M300 150 L352 120 L390 128 L438 96 M352 120 L366 82 M300 150 L268 196 L222 210 M268 196 L262 238 M300 150 L340 190 L346 232 M340 190 L386 204"/>
  <path stroke-width="1.5" opacity="0.6" d="M168 92 L140 88 M168 92 L158 66 M438 96 L468 88 M438 96 L452 70 M222 210 L188 224 M346 232 L360 262 M228 84 L214 60 M366 82 L378 58"/>
  <path stroke-width="1" opacity="0.35" d="M140 88 L112 96 M158 66 L148 44 M468 88 L492 96 M452 70 L462 48 M188 224 L162 244 M262 238 L252 262 M360 262 L380 276"/>
</svg>`;

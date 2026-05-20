import type { NextConfig } from 'next';

// Content Security Policy — every directive is scoped to what the site
// actually loads. Anything outside this list gets blocked by the browser.
const CSP = [
  // Fallback for unspecified resource types — self only
  "default-src 'self'",
  // Scripts: self + inline (Next.js hydration + GA init script) + Google Tag Manager
  // 'unsafe-inline'     — required for GA dangerouslySetInnerHTML init script
  // 'wasm-unsafe-eval'  — required for WebAssembly (Turbopack dev server + DotLottie WASM renderer)
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://www.googletagmanager.com",
  // Styles: self + inline (Tailwind utility classes) + Google Fonts CSS
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts: self + Google Fonts static files + data URIs
  "font-src 'self' https://fonts.gstatic.com data:",
  // Images: self + data URIs + blobs + any HTTPS source (covers OG images, partner logos, etc.)
  "img-src 'self' data: blob: https:",
  // Fetch/XHR: self + any HTTPS (covers the backend API, GA, REST Countries)
  //            + localhost for local dev
  "connect-src 'self' https: http://localhost:*",
  // Iframes: Google Maps embed only
  "frame-src https://www.google.com",
  // Web Workers: Lottie animation workers run in blob URLs
  "worker-src 'self' blob:",
  // Block all plugin types (Flash, Java, etc.)
  "object-src 'none'",
  // Prevent <base> tag injection attacks
  "base-uri 'self'",
  // Forms may only submit to same origin
  "form-action 'self'",
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Strip the X-Powered-By: Next.js header — no need to advertise the stack
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [60, 75, 95],
  },

  compress: true,

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@tabler/icons-react'],
  },

  turbopack: {},

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // ── Performance (existing) ────────────────────────────────────────
          { key: 'X-DNS-Prefetch-Control', value: 'on' },

          // ── Clickjacking protection (existing) ───────────────────────────
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },

          // ── MIME-sniffing prevention ──────────────────────────────────────
          // Stops the browser from guessing a file's content type, preventing
          // a class of attacks where a crafted file is executed as a script.
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // ── Legacy XSS filter (older browsers) ───────────────────────────
          { key: 'X-XSS-Protection', value: '1; mode=block' },

          // ── Referrer control ─────────────────────────────────────────────
          // Sends the full URL to same-origin requests but only the origin
          // (no path/query) to external sites, keeping URL structure private.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // ── HTTPS enforcement ────────────────────────────────────────────
          // Tells browsers to only contact this site over HTTPS for 2 years.
          // Prevents SSL-stripping / downgrade attacks.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },

          // ── Browser feature restrictions ─────────────────────────────────
          // Disables APIs the site does not use; the chatbot voice input
          // needs microphone=(self) so it is explicitly allowed.
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'geolocation=()',
              'microphone=(self)',
              'payment=()',
              'usb=()',
              'interest-cohort=()',
            ].join(', '),
          },

          // ── Content Security Policy ───────────────────────────────────────
          // Restricts every resource type to its minimum required origin set.
          // See the CSP constant above for per-directive explanations.
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

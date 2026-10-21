# The site uses a server runtime (not static export) so the Assistant can run

The Assistant needs a server route to call the Claude API without exposing the key, so the site deploys as a normal Next.js app on Vercel rather than a static export. Every page except the Assistant route stays statically rendered. The route has a per-IP rate limit and a monthly spend cap because it is a public endpoint that costs money.

# Images

Everything in `/public` is served from the root URL. A file at
`public/images/founders/maddie.jpg` is reachable at `/images/founders/maddie.jpg`
— drop the `public` part when writing the path.

## Folder guide

| Folder | Holds | Wired up in |
| --- | --- | --- |
| `logos/` | The Gathering Is Real mark, used in the nav, footer, and hero | Hardcoded in the components |
| `slideshow/` | The three 4:5 hero slides | `components/sections/HeroSlideshow.tsx` |
| `founders/` | Portraits, and the pair shot used on About → Our Story | `data/founders.ts`, `data/media.ts` |
| `pastProjects/` | Photos per project, one subfolder each | `data/pastProjects.ts` |
| `currentProject/` | Image of the place the current project is running | `data/currentProject.ts` |
| `qr/` | Donation and social QR codes | `app/donate/page.tsx`, `data/socials.ts` |
| `about/` | Spare slot for About page imagery | `data/media.ts` |

Videos live in `/public/videos/` and are listed in `data/media.ts` and
`data/pastProjects.ts`.

## Adding an image

1. Put the file in the right folder above.
2. Set its path in the data file named in the table.

A slot left as `null` renders a placeholder rather than breaking the page.

## Things worth knowing

- **Use lowercase file extensions** (`.jpg`, not `.JPG`). Deploys run on Linux,
  which is case-sensitive — a mismatch works locally on macOS and 404s in
  production.
- **No spaces or `&` in filenames.** Both break URLs. Use hyphens.
- **Videos must be `.mp4` (H.264).** `.MOV` files straight off a phone will not
  play in most browsers.
- **Compress before committing.** Phone video runs 10–20× larger than it needs
  to be for web. The clips here were re-encoded with:
  `ffmpeg -i in.mp4 -vf scale=720:-2 -c:v libx264 -crf 28 -preset slow -movflags +faststart -an out.mp4`
- **Crop to the aspect ratio it will display at** so the browser does no further
  cropping. Founder portraits are 3:4, the Our Story photo is 3:2, hero slides
  are 4:5.
- **Replacing an image? Change the filename too.** Next.js caches optimised
  images by URL, so overwriting a file in place keeps serving the old version.

## QR codes

The social and Zeffy codes were generated from their URLs; the Venmo code was
extracted from the official Venmo business card. To regenerate the generated
ones:

```bash
npx qrcode -o public/images/qr/instagram.svg -t svg "<url>"
```

`qrcode` is not a project dependency — `npx` fetches it for the one-off run.

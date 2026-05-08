# Images

Drop your images here. Next.js serves everything in /public at the root URL.

## Folder Guide

| Folder | What goes here | Used in |
|---|---|---|
| `/images/` (root) | `logo.svg` or `logo.png`, `venmo-qr.png` | Navbar, Footer, Donate page |
| `/images/team/` | Headshots — `firstname-lastname.jpg` | About page team grid |
| `/images/programs/` | Program photos — `community-outreach.jpg`, etc. | Programs page |
| `/images/events/` | Event photos or banners — `spring-service-day.jpg` | Events pages |
| `/images/blog/` | Article cover photos — match the post slug | Blog listing + post pages |

## Tips
- Prefer `.webp` for photos (smaller file size, great quality)
- `.svg` for the logo (scales perfectly at any size)
- Keep photos under 1MB — Next.js will optimize them automatically via next/image
- Recommended size: 1200×800px for banners, 400×400px for team headshots

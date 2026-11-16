# Editing the website (no coding needed)

The site's words, photos and project list all live in a few small files. You change a file, GitHub checks your change for mistakes, you look at a preview, and only then does it go live. A mistake can't reach the live site because the check blocks it.

## What to edit

| I want to… | Edit this file | What to change |
|---|---|---|
| Announce the next project | `data/currentProject.ts` | Fill in `name`, `location`, `need`, `who`, `when`, then change `active: false` to `active: true` |
| Add a finished project | `data/pastProjects.ts` | Copy the whole `{ ... }` block for Guam, paste it below with a comma, change every value |
| Announce an event or news | `data/announcements.ts` | Copy the whole `{ ... }` block for the Silent Disco, paste it below with a comma, change the values. Events disappear by themselves after `endsAt`, news after `expiresAt`. Optional photo: upload a `.jpg` to `public/images/announcements/` and set `image` |
| Change or remove the featured video (set src to null) | `data/media.ts` | Under `homeFeature`, change `src` (and `poster`) to the new file path, or set `src` to `null` to hide the video section completely |
| Change a founder's name/photo | `data/founders.ts` | Edit the text or photo path |
| Swap a video or the About photo | `data/media.ts` | Change the path (upload the file first, see below) |
| Change Instagram/Facebook/YouTube links | `data/socials.ts` | Edit `url` and `handle` |
| Add an Instagram post to /trending | `data/instagram.ts` | To add a post, paste its URL into `data/instagram.ts`. |
| Add a flyer to /trending (moves to "Past events" by itself) | `data/trendingItems.ts` | Upload a .jpg to `public/images/`, copy a block, set `expiresAt` |
| Change wording on a page | `app/<page>/page.tsx` | Edit the text between the tags; leave everything with `<` `>` and `{ }` alone |

## How to publish a change (from the GitHub website)

1. Open the file on GitHub and click the **pencil** icon.
2. Make your edit.
3. Click **Commit changes…**, choose **Create a new branch and start a pull request**, then **Propose changes** and **Create pull request**.
4. Wait about two minutes for the checks. A green **gate** check means no mistakes were found. If it is red, click **Details**: the message names the file and what to fix. Edit the same file again on the same branch.
5. Open the **Preview** link in the pull request (posted by the hosting service) and look at your change on a phone-sized window too.
6. Click **Merge pull request**. The live site updates in a couple of minutes.

## Adding photos and videos

- Upload through **Add file → Upload files** into the right folder under `public/` (for example `public/images/pastProjects/Fiji/`), in the same pull request.
- Photos: `.jpg`, under 2 MB (resize first). Videos: `.mp4` (H.264), under 8 MB. Phone `.MOV` files do not play in most browsers.
- Spell the file name exactly, including capital letters. `IMG_1.JPG` and `img_1.jpg` are different files on the live site, even though your computer treats them as the same. The check catches this.

## If something looks wrong on the live site

See `docs/RUNBOOK.md`. The short version: don't edit more. Roll back to the last good version first, fix after.

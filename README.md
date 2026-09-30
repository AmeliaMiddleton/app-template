# App template

Starter for Amelia Cox's free demo apps. Each app gets its own repo made from this template. They all come with:

- Angular 22 with the accessible layout from ameliacox.me: skip link, landmarks, visible focus, dark mode, reduced motion, Atkinson Hyperlegible
- A **"Customize this for your school"** popup that invites visitors to **request a bid** or **request more information** on geekamu.com
- GitHub Actions CI (tests and build) and ready-to-use Cloudflare Pages settings

## Start a new app

1. On GitHub, select **Use this template → Create a new repository** and name it (e.g. `reading-helper`).
2. In `src/app/app-info.ts`, set:
   - `slug`: the repo name, e.g. `reading-helper`. It's sent to the request form so you know which app it came from.
   - `name`: the display name, e.g. `Reading Helper`
3. In `src/index.html`, update the `<title>` and `description`.
4. Build the demo in `src/app/home/`.

## The request popup

`src/app/request-cta/` holds a "Customize this for your school" button in the header and a dialog.

- The dialog opens on its own once per visitor after `popupDelayMs` (default 60 seconds). It waits if the visitor is typing, and the button reopens it at any time.
- Visitors can say who it's for (teacher, school, district, other). Both buttons link to `requestUrl` with the details filled in:

  ```
  https://geekamu.com/request?app=reading-helper&type=bid&for=district
  https://geekamu.com/request?app=reading-helper&type=info
  ```

  | Parameter | Values                                                              |
  | --------- | ------------------------------------------------------------------- |
  | `app`     | the app's `slug`                                                    |
  | `type`    | `bid` or `info`                                                     |
  | `for`     | `teacher`, `school`, `district`, `other`, or left out if not chosen |

## Deploy on Cloudflare Pages

Create a Pages project connected to the new repo with:

| Setting                | Value                                               |
| ---------------------- | --------------------------------------------------- |
| Production branch      | `main`                                              |
| Build command          | `npm run build`                                     |
| Build output directory | `dist/app/browser`                                  |
| Environment variable   | `NODE_VERSION` = `24.15.0` (Production and Preview) |

The site deploys to `<project-name>.pages.dev`. Any path loads the app, so page refreshes work without extra setup.

## Development

Requires Node.js 24.15.0 (pinned in `.nvmrc`).

```bash
npm install
npm start        # http://localhost:4200
npm test         # unit tests (Vitest)
npm run build    # production build in dist/app/browser
```

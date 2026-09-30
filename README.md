# App template

Starter for Amelia Cox's free demo apps. Each app gets its own repo made from this template. It's plain **HTML, CSS and JavaScript**: no framework, no npm, no build step.

Every app comes with:

- An accessible layout: skip link, landmarks, visible focus, dark mode, reduced motion, Atkinson Hyperlegible
- A **"Customize this for your school"** popup that invites visitors to **request a bid** or **request more information** on geekamu.com

## Files

```
public/                 ← everything that gets published
  index.html            the page: header, demo section, footer, request dialog
  css/styles.css        colors, layout, buttons, dialog
  js/app-info.js        per-app settings (name, slug, request URL, popup delay)
  js/request-cta.js     the request popup
  js/main.js            fills in the app name and starts the popup
  favicon.ico
```

## Start a new app

1. On GitHub, select **Use this template → Create a new repository** and name it (e.g. `reading-helper`).
2. In `public/js/app-info.js`, set:
   - `slug`: the repo name, e.g. `reading-helper`. It's sent to the request form so you know which app it came from.
   - `name`: the display name, e.g. `Reading Helper`
3. In `public/index.html`, update the `<title>` and `description`.
4. Build the demo inside the `<section class="demo">` in `public/index.html`. Add more CSS or JS files under `public/` as needed.

## The request popup

The dialog is in `public/index.html`, and its behavior is in `public/js/request-cta.js`.

- It opens on its own once per visitor after `popupDelayMs` (default 60 seconds). It waits if the visitor is typing, and the header button reopens it any time.
- Esc or "Not now" closes it and returns focus to where the visitor was.
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

| Setting                | Value                  |
| ---------------------- | ---------------------- |
| Production branch      | `main`                 |
| Framework preset       | None                   |
| Build command          | _(leave empty)_        |
| Build output directory | `public`               |

The site deploys to `<project-name>.pages.dev`.

## Preview locally

The scripts are JavaScript modules, so open the page through a local web server rather than double-clicking the file:

```bash
cd public
python3 -m http.server 8000   # then open http://localhost:8000
```

Any static server works, such as the VS Code "Live Server" extension.

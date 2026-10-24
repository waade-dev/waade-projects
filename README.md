# Waade — Projects

A small public directory of Amith Athreya’s websites. Built with plain HTML, CSS and JavaScript. Search, category filters, keyboard navigation, responsive cards, and no frontend dependencies.

## Run locally

```sh
python3 -m http.server 4174
```

Open http://localhost:4174.

## Update the collection

Edit `projects.json`. Each entry has `id`, `name`, `category`, `description`, `url`, `label`, `art`, and `number`. Keep external URLs HTTPS. The available illustrations are `papers`, `blueprint`, `space`, `library`, `atlas`, `profile`, and `skills`. Use the optional `access` field to label a destination that requires sign-in.

The six launch entries were checked against production links in the Vercel dashboard on 24 October 2026. This is a curated snapshot, not a live integration. No Vercel token, private repository URL, environment variable, or account identifier is exposed to visitors.

Project counts and the directory range update from the catalog automatically. Keep the initial fallback count and range, and the no-JavaScript links in `index.html`, in sync when changing the collection. Skill Studio was added from its verified ChatGPT Sites publication; it requires sign-in.

## Deploy

Import this repository into Vercel with the **Other** framework preset. There are no install or build commands. Serve the repository root. Pushes to the production branch redeploy the site automatically after Git integration is connected.

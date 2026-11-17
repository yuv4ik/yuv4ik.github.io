# evgenyzborovsky.com

Personal blog of Evgeny Zborovsky, built with [Eleventy](https://www.11ty.dev/) and hosted on GitHub Pages.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm start        # http://localhost:8080, rebuilds on save
npm run build    # production build into _site/
```

Google Analytics is only included in production builds (`npm run build`), never while serving locally.

## Writing a post

Add `_posts/YYYY-MM-DD-title.md`:

```markdown
---
title: "Post title"
date: "YYYY-MM-DD"
categories: [xamarin-forms, ios]
---

First paragraph becomes the page description.
```

The URL is `/YYYY/MM/DD/title/`, taken from the file name. Posts can use the Jekyll-style tags `{% highlight csharp %}…{% endhighlight %}`, `{% post_url YYYY-MM-DD-title %}` and `{% gist id %}`, or fenced code blocks.

## Deploying

Pushing to `main` builds and deploys through `.github/workflows/deploy.yml`. Pull requests are built but not deployed.

## Licence

Content is licensed under [CC BY-NC 4.0](LICENSE.md). JetBrains Mono is used under the SIL Open Font License 1.1 (`assets/fonts/OFL.txt`).

# React Remix Form Builder

A modern, responsive form builder application built with React, Remix, and TailwindCSS. This application allows users to create, customize, and deploy forms with a drag-and-drop interface, dark/light mode theming, and responsive previews for different device sizes.

- 📖 [Remix docs](https://remix.run/docs)

## Development

Run the dev server:

```shellscript
npm run dev
```

## Deployment

### Local Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

### GitHub Pages Deployment

To deploy this application to GitHub Pages:

1. Create a new repository on GitHub
2. Link your local repository to the GitHub repository:

```sh
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

3. Push your code to GitHub:

```sh
git push -u origin master
```

4. Deploy to GitHub Pages using the gh-pages package:

```sh
npm run deploy
```

Alternatively, GitHub Actions will automatically deploy the application when you push to the master branch.

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

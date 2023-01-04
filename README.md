# Shared Package Setup

The `shared` package is common utilities and domain functionality between mobile and web clients.

To avoid creating a private npm registry to publish the shared package to be used among both web/mobile, the package is shared by using npm pack and install. Both platforms have some limitations that prevent the simple `npm install ../shared` approach which creates a symlink.

For mobile, React Native's metro bundler:

1. No support for symlinks
2. No (current) support for package.json exports field: https://github.com/facebook/metro/issues/670

For web, the shared package requires react as a devDependency. Despite being a dev dependency, when installing via a symlink, two versions of react are included which break the usage of react hooks.

So instead of simply using npm install at a relative location, we need to `npm pack` the shared package and install the tar from the mobile package. To support the build js files in the `shared/dist` directory, we needed to make a small patch to the package resolver in the `metro.config.js`.

For ease of development, you can run: `make watch` from the shared package to ensure that updates to the source ts files get built to JS and exported to mobile accordingly.
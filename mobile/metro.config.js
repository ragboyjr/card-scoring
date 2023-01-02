/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.startsWith('@card-scoring/shared')) {
        moduleName = moduleName.replace('@card-scoring/shared', '@card-scoring/shared/dist');
      }

      return context.resolveRequest(context, moduleName, platform);
    }
  },
};

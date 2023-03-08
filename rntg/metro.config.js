let MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks')

module.exports = {
  resolver: {
    resolveRequest: MetroSymlinksResolver(),
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
}

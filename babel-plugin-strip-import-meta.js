// Replace `import.meta` references with a no-op stub so libraries that use
// `import.meta.env` (e.g. zustand devtools) bundle cleanly under Metro's
// CommonJS output, where top-level `import.meta` would be a syntax error.

module.exports = function () {
  return {
    name: 'strip-import-meta',
    visitor: {
      MetaProperty(path) {
        if (
          path.node.meta &&
          path.node.meta.name === 'import' &&
          path.node.property &&
          path.node.property.name === 'meta'
        ) {
          path.replaceWithSourceString('({ env: { MODE: "production" } })');
        }
      },
    },
  };
};

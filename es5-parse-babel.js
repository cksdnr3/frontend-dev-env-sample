module.exports = function es5ParseBabel() {
  return {
    visitor: {
      VariableDeclaration(path) {
        const kind = path.node.kind;
        console.log(kind);
        if (kind === "const") {
          path.node.kind = "var";
        }
      },
    },
  };
};

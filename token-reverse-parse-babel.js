module.exports = function tokenReverseParseBabel() {
    return {
        visitor: {
            Identifier(path) {
                const name = path.node.name;
                console.log(name);

                path.node.name = name
                    .split("")
                    .reverse()
                    .join("");
            }

            
        }
    }
}
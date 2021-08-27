exports.requireF = (modulePath) => {
    try {
      return require(modulePath);
    } catch (e) {
      return {};
    }
  };
// wrapper function to handle condtional import file

exports.requireF = (modulePath) => {
  try {
    return require(modulePath);
  } catch (e) {
    return {};
  }
};

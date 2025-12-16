function asString(value) {
  return Array.isArray(value) ? value[0] : value;
}

module.exports = asString;

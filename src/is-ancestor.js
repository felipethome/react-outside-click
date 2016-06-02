module.exports = function (parent, elem) {
  var currentNode = parent;

  while (currentNode) {
    if (currentNode === elem) {
      return true;
    }

    currentNode = currentNode.parentElement;
  }

  return false;
};
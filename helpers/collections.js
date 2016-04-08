module.exports = {
  offset (collectionEntry, collection, offset) {
    var ind = collectionEntry._index
    return collection[ind + offset]
  }
}

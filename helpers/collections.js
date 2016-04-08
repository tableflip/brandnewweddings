module.exports = {
  offset (collectionEntry, collection, offset) {
    var ind = collectionEntry._index
    return collection[ind + offset]
  },
  others (collectionEntry, collection, count) {
    var remainder = collection.filter((entry) => entry._index !== collectionEntry._index)
    var start = remainder.splice(0, collectionEntry._index - 1)
    remainder = remainder.concat(start)
    return remainder.slice(0, count)
  },
  featured (collection) {
    return collection.find((entry) => entry.featured)
  }
}

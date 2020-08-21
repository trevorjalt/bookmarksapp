const bookmarks = [];
let addNewBookmark = false;
let rating = 0;
let error = null;

const setError = function(error) {
  this.error = error;
};

const addBookmark = function (bookmark) {
  const newBookmark = bookmark;
  Object.assign(newBookmark, {expand: false});
  this.bookmarks.push(newBookmark);
  // console.log(bookmark);
};

const findById = function (id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
}

const findAndDelete = function (id) {
  console.log(this.bookmarks)
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
}

const toggleAddNewBookmark = function() {
  this.addNewBookmark = !this.addNewBookmark;
};

const findAndUpdate = function(id, newData) {
  Object.assign(this.bookmarks.find(bookmark => bookmark.id === id), newData);
}




export default {
  bookmarks,
  addNewBookmark,
  rating,
  error,
  setError,
  findById,
  addBookmark,
  findAndDelete,
  toggleAddNewBookmark,
  findAndUpdate,


};
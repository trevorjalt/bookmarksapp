// Global Variables


const bookmarks = [];
let addNewBookmark = false;
let rating = 0;
let error = null;


// Functions to manipulate the store

const setError = function(error) {
  this.error = error;
};

const addBookmark = function (bookmark) {
  const newBookmark = bookmark;
  Object.assign(newBookmark, {expand: false});
  this.bookmarks.push(newBookmark);
};

const findById = function (id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const filterBookmarks =  function () {
  return this.bookmarks.filter(bookmark => bookmark.rating >= this.rating);
};

const toggleAddNewBookmark = function() {
  this.addNewBookmark = !this.addNewBookmark;
};

const findAndUpdate = function(id, newData) {
  Object.assign(this.bookmarks.find(bookmark => bookmark.id === id), newData);
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};



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
  filterBookmarks
};
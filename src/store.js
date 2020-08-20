const bookmarks = [];
let addNewBookmark = false;
let error = null;

const setError = function(error) {
  this.error = error;
};

const addBookmark = function (bookmark) {
  // let expand = {expand:false};
  // bookmark = {...bookmark, ...expand};
  this.bookmarks.push(bookmark);
  console.log(bookmark);
};

// const findById(id) {
//   return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
// }

const toggleAddNewBookmark = function() {
  this.addNewBookmark = !this.addNewBookmark;
};

// const toggleExpandBookmark(id) {
//   let currentBookmark = currentBookmark.findById(id)
//   currentBookmark.expand = !currentBookmark.expand;
// };


export default {
  bookmarks,
  addNewBookmark,
  error,
  setError,
  // findById,
  addBookmark,
  toggleAddNewBookmark,
  // toggleExpandBookmark

};
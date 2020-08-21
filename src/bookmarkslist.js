import $ from 'jquery';

import store from './store';
import api from './api';


const generateBookmarkCondensedElement = function (bookmark) {
  return `
      <div id="js-bookmark-item" class="bookmark-render">
      <section class="bookmark-top">
        <div class="content-header">
            <p class="text-margin">${bookmark.title}.</p>
            <form for="close-button" id="js-close-expanded" class="close-header-right js-header-right" id="close-button">
                <button id="remove-bookmark" class="button2 close-button" type="submit" value="submit">remove.</button>
            </form>
        </div>
    </section>
    <section class="text-margin">
      <p>${bookmark.rating}.</p>
    </section>
    </div>`;
};

const generateBookmarkCreateScreen = function () {
  return `
  <div class="bookmark-render">
  <section class="bookmark-top">
    <div class="content-header">
      <p class="text-margin">create a bookmark.</p>
      <button id="close" class="button2 close-button">close.</button>
    </div>
  </section>
  <section class="bookmarks-app">
      <form id="js-add-bookmark" class="add-new-input input-container">
        <div>
          <label for="bookmark-title">title.</label>
          <input type="text" name="title" class="js-bookmark-entry-title" id="bookmark-title" required>
          <label for="bookmark-url">web address.</label>
          <input type="url" name="url" id="url" placeholder="https://example.com" pattern="https://.*" size="30"required>
          <label for="bookmark-description">description.</label>
          <input type="text" name="description" id="bookmark-description">
        </div>
        <section>
          <div class="add-bookmark-align">
              
              <legend>rating.</legend>
              
              <input type="radio" id="five-stars" name="rating" value="5">
              <label for="five-stars" required>5</label>
              <input type="radio" id="four-stars" name="rating" value="4">
              <label for="four-stars">4</label>
              <input type="radio" id="three-stars" name="rating" value="3">
              <label for="three-stars">3</label>
              <input type="radio" id="two-stars" name="rating" value="2">
              <label for="two-stars">2</label>
              <input type="radio" id="one-star" name="rating" value="1">
              <label for="one-stars">1</label>
              
          </div>
          <div class="add-bookmark-align">
            <button id="add-bookmark" class="button close-button" type="submit" value="submit">add.</button>
          </div>
        </section>
      </form>
    </section>
    </div>`;
};

// const generateItemExpandedView = 

const generateBookmarksString = function (bookmarkList) {
  const bookmarks = bookmarkList.map((bookmark) => generateBookmarkCondensedElement(bookmark));
  return bookmarks.join('');
};

const render = function () {
  let bookmarks = [...store.bookmarks];
  console.log(store);
  if (store.addNewBookmark) {
    const html = generateBookmarkCreateScreen();
    $('#create-screen').html(html);
  } else {
    $('#create-screen').empty();
  }
  // render the bookmarks in the DOM
  const bookmarksString = generateBookmarksString(bookmarks);
  // insert that HTML into the DOM
  $('#js-bookmark-list').html(bookmarksString);
};

const handleCloseButton = function () {
  $('#create-screen').on('click', '#close', function () {
    // $('#create-screen').empty();
    store.toggleAddNewBookmark();
    console.log('click');
    render();
  });
};

const handleCreateScreen = function () {
  $('#new-bookmark').click(function () {
    store.toggleAddNewBookmark();
    render();

  });
};

$.fn.extend({
  serializeJson: function() {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});

const handleNewBookmarkSubmit = function () {
  $('#create-screen').on('submit', '#js-add-bookmark', function (event) {
    event.preventDefault();
    console.log('submit');
    const newBookmarkData = $(event.target).serializeJson();
    api.createBookmark(newBookmarkData)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.toggleAddNewBookmark();
        render();
      });
    // .catch((error) => {
    //   store.setError(error.message);
    //   renderError();
    // });
  });
};

const getItemIdFromElement = function (bookmark) {
  return $(bookmark)
    .closest('.js-bookmark-item')
    .data('bookmark-id');
};

// const handleExpandBookmark = function () {
//   $('#js-bookmark-list').on('click', '#js-bookmark-item', function (event) {
//     const id = getItemIdFromElement(event.currentTarget);
//     store.toggleExpandBookmark(id);
//     render();
//   });
// };

const bindEventListeners = function () {
  handleNewBookmarkSubmit();
  handleCreateScreen();
  handleCloseButton();
  // handleExpandBookmark();

};

export default {
  render,
  bindEventListeners
};
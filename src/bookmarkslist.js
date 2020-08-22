import $ from 'jquery';

import store from './store';
import api from './api';


// Bookmark Item Templates

const generateBookmarkElement = function (bookmark) {
  if (bookmark.rating >= store.rating) {
    if (bookmark.expand) {
      return `
      <div id="saved-bookmark" class="bookmark-render js-bookmark-item" data-item-id="${bookmark.id}">
        <section class="bookmark-top">
          <div class="content-header">
            <h3 class="text-margin">${bookmark.title}.</h3>
            <button id="remove-button" class="maroon-button gray-button-margin">remove.</button>
            </div>
        </section>
        <section class="text-margin">
          <p>${bookmark.desc ? bookmark.desc : ''}</p>
            <div class="button-align">

                <a href="${bookmark.url}" id="visit-site" target="_blank" class="gray-button">visit.</a>
                <button id="close-button" class="gray-button gray-button-margin">close.</button>
            </div>
            <div>
              <p>${bookmark.rating || 0} ⭐️</p>
            </div>
        </section>
      </div>`;
    } else {
      return `
        <div class="bookmark-render js-bookmark-item" data-item-id="${bookmark.id}">
          <section class="bookmark-top">
            <div class="content-header">
              <h3 class="text-margin">${bookmark.title}.</h3>
                <div>
                <button id="expand-button" class="gray-button gray-button-margin">expand.</button>
                <button id="remove-button" class="maroon-button gray-button-margin">remove.</button>
                </div>
            </div>
          </section>
          <section class="text-margin">
            <p>${bookmark.rating || 0} ⭐️</p>
          </section>
        </div>`;
    }
  } else {
    return '';
  }
};

const generateBookmarkCreateElement = function () {
  return `
    <div class="bookmark-render">
      <section class="bookmark-top">
        <div class="content-header">
          <h3 class="text-margin">create a bookmark.</h3>
          <button id="close-button" class="gray-button gray-button-margin">close.</button>
        </div>
      </section>
      <section class="bookmarks-app">
        <form id="js-add-bookmark" class="input-container">
          <div>
            <label for="title">title.</label>
            <input type="text" name="title" id="title" required>
            <label for="url">web address.</label>
            <input type="url" name="url" id="url" placeholder="https://example.com" pattern="https://.*" size="30" required>
            <label for="description">description.</label>
            <input type="text" name="desc" id="description" aria-label="description.">
          </div>
          <section>
            <div class="add-bookmark-align">
                <legend>rating.</legend>
                <input type="radio" id="five-stars" name="rating" aria-label="5" value="5">
                <label for="five-stars">5⭐️</label>
                <input type="radio" id="four-stars+" name="rating" aria-label="4+" value="4" required>
                <label for="four-stars+">4⭐️</label>
                <input type="radio" id="three-stars+" name="rating" aria-label="3+" value="3">
                <label for="three-stars+">3⭐️</label>
                <input type="radio" id="two-stars+" name="rating" aria-label="2+" value="2">
                <label for="two-stars+">2⭐️</label>
                <input type="radio" id="one-star+" name="rating" aria-label="1+" value="1">
                <label for="one-stars+">1⭐️</label>
            </div>
            <div class="add-bookmark-align">
              <button id="add-bookmark" class="brown-button" type="submit" value="submit">add.</button>
            </div>
          </section>
        </form>
      </section>
    </div>`;
};

const generateErrorElement = function (message) {
  return `
      <section class="error-container-template">
        <h2 id="error-text" class="error-text">Whoops! It seems you've encountered an error: ${message}</h2>
        <button id="close-error-button" class="brown-button">close.</button>
      </section>
    `;
};


// Additional Assistive Functions


const generateBookmarksString = function (bookmarkList) {
  const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-bookmark-item')
    .data('item-id');

};

$.fn.extend({
  serializeJson: function() {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});


// Functions for Rendering


const renderError = function () {
  if (store.error) {
    const el = generateErrorElement(store.error);
    $('#error-container').html(el);
  } else {
    $('#error-container').empty();
  }
};


const render = function () {
  renderError();
  let bookmarks = [...store.bookmarks];
  if (store.addNewBookmark) {
    const html = generateBookmarkCreateElement();
    $('#create-screen').html(html);
  } else {
    $('#create-screen').empty();
  }
  // render the bookmarks in the DOM
  const bookmarksString = generateBookmarksString(bookmarks);
  // insert that HTML into the DOM
  $('#js-bookmark-list').html(bookmarksString);
};


// Event Handlers


const handleCloseButton = function () {
  $('#create-screen').on('click', '#close-button', function () {
    store.toggleAddNewBookmark();
    render();
  });
};

const handleCreateScreen = function () {
  $('#new-bookmark').click(function () {
    store.toggleAddNewBookmark();
    render();

  });
};


const handleNewBookmarkSubmit = function () {
  $('#create-screen').on('submit', '#js-add-bookmark', function (event) {
    event.preventDefault();
    const newBookmarkData = $(event.target).serializeJson();
    api.createBookmark(newBookmarkData)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.toggleAddNewBookmark();
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};


const handleExpandBookmark = function () {
  $('#js-bookmark-list').on('click', '.js-bookmark-item', function (event) {
    const id = getItemIdFromElement(event.currentTarget);
    const bookmark = store.findById(id);
    store.findAndUpdate(id, {expand: !bookmark.expand});
    render();
  });
};

const handleDeleteItemClicked = function () {
  $('#js-bookmark-list').on('click', '#remove-button', function (event) {
    const id = getItemIdFromElement(event.target);
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        store.setError(error.message);
        renderError();
      });
  });
};

const handleRatingFilterChange = function () {
  $('.js-filter-rating').change(function (event) {
    let val = $(event.target).val();
    store.rating = val;
    store.filterBookmarks(store.rating);
    render();
  });
};

const handleCloseError = function () {
  $('#error-container').on('click', '#close-error-button', function () {
    store.setError(null);
    renderError();
  });
};


const bindEventListeners = function () {
  handleNewBookmarkSubmit();
  handleCreateScreen();
  handleCloseButton();
  handleExpandBookmark();
  handleDeleteItemClicked();
  handleRatingFilterChange();
  handleCloseError();

};

export default {
  render,
  bindEventListeners
};
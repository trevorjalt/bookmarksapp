import $ from 'jquery';

import store from './store';
import api from './api';


const generateBookmarkElement = function (bookmark) {
  if (bookmark.expand) {
    return `
    <div class="bookmark-render js-bookmark-item" data-item-id="${bookmark.id}">
      <section class="bookmark-top">
        <div class="content-header">
          <p class="text-margin">${bookmark.title}</p>
          <button id="close-button" class="gray-button gray-button-margin">close.</button>
          </div>
      </section>
      <section class="text-margin">
        <p>${bookmark.desc}</p>
          <div class="button-align">

              <a href="${bookmark.url}" target="_blank">visit.</a>
              <button id="js-remove-bookmark" class="gray-button gray-button-margin">remove.</button>

          </div>
          <p>${bookmark.rating}</p>
      </section>
    </div>`;
  } else {
    return `
      <div class="bookmark-render js-bookmark-item" data-item-id="${bookmark.id}">
        <section class="bookmark-top">
          <div class="content-header">
            <p class="text-margin">${bookmark.title}.</p>

              <button id="js-remove-bookmark" class="gray-button gray-button-margin">remove.</button>
            
          </div>
        </section>
        <section class="text-margin">
          <p>${bookmark.rating}.</p>
        </section>
      </div>`;
  }
};



const generateBookmarkCreateElement = function () {
  return `
    <div class="bookmark-render">
      <section class="bookmark-top">
        <div class="content-header">
          <p class="text-margin">create a bookmark.</p>
          <button id="close-button" class="gray-button gray-button-margin">close.</button>
        </div>
      </section>
      <section class="bookmarks-app">
        <form id="js-add-bookmark" class="input-container">
          <div>
            <label for="bookmark-title">title.</label>
            <input type="text" name="title" id="bookmark-title" required>
            <label for="bookmark-url">web address.</label>
            <input type="url" name="url" id="bookmark-url" placeholder="https://example.com" pattern="https://.*" size="30"required>
            <label for="bookmark-description">description.</label>
            <input type="text" name="desc" id="bookmark-description">
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
              <button id="add-bookmark" class="brown-button" type="submit" value="submit">add.</button>
            </div>
          </section>
        </form>
      </section>
    </div>`;
};


const generateBookmarksString = function (bookmarkList) {
  const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};

const render = function () {
  let bookmarks = [...store.bookmarks];
  console.log(store);
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

const handleCloseButton = function () {
  $('#create-screen').on('click', '#close-button', function () {
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

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-bookmark-item')
    .data('item-id');

};

const handleExpandBookmark = () => {
  $('#js-bookmark-list').on('click', '.js-bookmark-item', function (event) {
    const id = getItemIdFromElement(event.currentTarget);
    console.log(event.currentTarget)
    const bookmark = store.findById(id);
    store.findAndUpdate(id, {expand: !bookmark.expand});
    render();
  });
};

const handleDeleteItemClicked = function () {
  $('#js-bookmark-list').on('click', '#js-remove-bookmark', function (event) {
    console.log('remove');
    console.log($(event.target))
    const id = getItemIdFromElement(event.target);
    

    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      // .catch((error) => {
      //   console.log(error);
      //   store.setError(error.message);
      //   renderError();
      // });
  });
};



const bindEventListeners = function () {
  handleNewBookmarkSubmit();
  handleCreateScreen();
  handleCloseButton();
  handleExpandBookmark();
  handleDeleteItemClicked();

};

export default {
  render,
  bindEventListeners
};
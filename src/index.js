import $ from 'jquery';

import 'normalize.css';
import './css/index.css';

import store from './store';
import api from './api';
import bookmarkslist from './bookmarkslist';

function main() {
  api.getBookmarks()
    .then((bookmarks) => {
      // console.log(bookmarks)
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarkslist.render();
      console.log(store.bookmarks)
    });
  
  console.log('DOM is loaded');
  bookmarkslist.bindEventListeners();
  bookmarkslist.render();

//   const startMsg = $('<p>Webpack is working!</p>');
//   $('#root').append(startMsg);
}


$(main);
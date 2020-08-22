import $ from 'jquery';

import 'normalize.css';
import './css/index.css';

import store from './store';
import api from './api';
import bookmarkslist from './bookmarkslist';


function main() {
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarkslist.render();
    });
  
  bookmarkslist.bindEventListeners();
  bookmarkslist.render();
}


$(main);
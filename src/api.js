const BASE_URL = 'https://thinkful-list-api.herokuapp.com/trevor';


// One function to handle all our fetch requests.


const listApiFetch = function (...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
};


// CRUD functions


const getBookmarks = function () {
  return listApiFetch(`${BASE_URL}/bookmarks`);
};


const createBookmark = function (json) {
  return listApiFetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: json
  });
};

const deleteBookmark = function (id) {
  return listApiFetch(BASE_URL + '/bookmarks/' + id, {
    method: 'DELETE'
  });
};



export default {
  getBookmarks,
  createBookmark,
  deleteBookmark,
};
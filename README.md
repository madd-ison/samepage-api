# SAMEPAGE API

**GET Discussion Board**
----
  Returns json data for history of messages that match the chat id for the logged in group.

* **URL**

  /api/messages

* **Method:**

  `GET`

* **Data Params**

  Requires Auth - User Id, Bearer Token

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
        "id": 9,
        "chat_id": 1,
        "date": "2020-10-31T21:26:02.403Z",
        "content": "totally agree - adding it to the list",
        "author": "sana"
    }`
 
* **Error Response:**

  * **Code:** 401 Unauthorized<br />
    **Content:** `{ error : "Missing bearer token" }`

* **Sample Call:**

  ```javascript
    var settings = {
  "url": "/api/messages",

  "method": "GET",

  "headers": {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
    },
  };

  $.ajax(settings).done(function (response) {
  console.log(response);
  });


**Get Message By Id**
----
  Returns json data for a specific post.

* **URL**

  /api/messages/:id

* **Method:**

  `GET`

*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

  Requires Auth - User Id, Bearer Token

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{
        "id": 9,
        "chat_id": 1,
        "date": "2020-10-31T21:26:02.403Z",
        "content": "totally agree - adding it to the list",
        "author": "sana"
    }`
 
* **Error Response:**

  * **Code:** 401 Unauthorized<br />
    **Content:** `{ error : "Missing bearer token" }`
  * **Code:** 404 Not Found<br />
    **Content:** `{ error : "Message not found" }`

* **Sample Call:**

  ```javascript
    var settings = {
  "url": "/api/messages/:id",

  "method": "GET",

  "headers": {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  },}; 
  $.ajax(settings).done(function (response) {
  console.log(response);});


**Post A Message**
----
  Creates a new post with a new id.

* **URL**

  /api/messages

* **Method:**

  `POST`


* **Data Params**

  - Requires Auth - User Id, Bearer Token
  - Content - res.body

* **Success Response:**

  * **Code:** 201 <br />
    **Content:** `{
        "id": 1,
        "chat_id": 1,
        "date": "2020-10-31T21:26:02.403Z",
        "content": "new post!",
        "author": "maddison"
    }`
 
* **Error Response:**

  * **Code:** 401 Unauthorized<br />
    **Content:** `{ error : "Missing bearer token" }`
  * **Code:** 400 Bad Request<br />
    **Content:** `{ error : "Content is missing" }`

* **Sample Call:**

  ```javascript
   var settings = {
  "url": "/api/messages",

  "method": "POST",

  "headers": {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  },
  "data": JSON.stringify({"content":"test"}),
  };

  $.ajax(settings).done(function (response) {
  console.log(response);});

  ```

**Delete A Post**
----
  Deletes a post with a specific id.

* **URL**

  /api/messages/:id

* **Method:**

  `DELETE`

*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

  - Requires Auth - User Id, Bearer Token

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{}`
 
* **Error Response:**

  * **Code:** 401 Unauthorized<br />
    **Content:** `{ error : "Missing bearer token" }`
  * **Code:** 404<br />
    **Content:** `{ error : "Message not found" }`

* **Sample Call:**

  ```javascript
   var settings = {
  "url": "/api/messages/:id",

  "method": "DELETE",

  "headers": {
    "Authorization": "Bearer token",
    "Content-Type": "application/json"
  },

  $.ajax(settings).done(function (response) {
  console.log(response);});

  ```

## Client Repo:
* [github/maddi-ison](https://github.com/madd-ison/samepage-client)

## Live App:

* [samePage](https://samepage.vercel.app/)

### Demo Credentials:
* username: username1
* password: Password1!
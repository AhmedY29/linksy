const apiUrl = "https://682340b665ba05803395f8c3.mockapi.io/";

async function handleGetUsers() {
  try {
    let res = await fetch(`${apiUrl}users`);
    let users = await res.json();
    return users;
  } catch (error) {
    console.log(`Error In GetUsers: ${error}`);
  }
}
let navBtns = document.getElementById("nav-btns");
let welcomeMsg = document.getElementById("welcomeMsg");
let nameMsg = document.getElementById("welcome-name");

navBtns.className = "d-flex";
let logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  navBtns.className = "d-flex";
  nameMsg.innerText = ``;
  welcomeMsg.className = "d-none";
});

function getNameFromLocalStorage() {
  let username = localStorage.getItem("accountName");

  if (username) {
    navBtns.className = "d-none";
    nameMsg.innerText = `Welcome, ${username} 👋🏻`;
    welcomeMsg.className = "d-flex";
  }
}

getNameFromLocalStorage();
// Get Posts

async function handleGetPosts() {
  try {
    let res = await fetch(`${apiUrl}posts`);
    let posts = await res.json();
    return posts;
  } catch (error) {
    console.log(`Error In GetPosts: ${error}`);
  }
}

// Show Posts in UI

async function handleShowPosts() {
  let postsContainer = document.getElementById("posts-container");
  let users = await handleGetUsers();
  let posts = await handleGetPosts();

  let reversePost = posts.reverse();

  reversePost.forEach(async (post) => {
    postsContainer.innerHTML = "";

    console.log(post.authorId);
    let user = users.find((user) => user.id == post.authorId);
    let isAuthor = await handleDeleteBtn(post.id);
    postsContainer.innerHTML += `
    <div
        class="post container shadow-sm rounded-2 w-100 p-3 d-flex flex-column gap-3"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex gap-3 align-items-center">
            <div class="user-avatar">
              <img
                class="rounded-circle"
                src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                alt="avatar"
                width="50"
              />
            </div>
            <div class="post-author d-flex gap-2 w-100">
              <div class="author-name d-flex flex-column gap-2 w-100">
                <h6>${user.username}</h6>
              </div>
            </div>
          </div>
          <span
            id="delete-post-btn"
            onclick="handleDeletePost(${post.id})"
            class="btn btn-danger material-symbols-outlined ${
              isAuthor ? "d-flex" : "d-none"
            }"
            >delete</span
          >
        </div>

        <div class="post-text">
          <p>
            ${post.postText}
          </p>
        </div>
        <div class="post-img w-100">
          <img
            class="object-fit-cover rounded-2 w-100"
            src="${post.postImgUrl}"
            alt=""
            height="400"
          />
        </div>

        <div class="post-actions d-flex justify-content-between">
          <div class="like-comment d-flex align-items-center gap-2">
            <p>
              <span class="material-symbols-outlined"> favorite </span>
            </p>
            <p style="cursor: pointer" id="comment-btn" onclick="handleOpenDeleteDialog(${
              post.id
            })">
              <span class="material-symbols-outlined"> comment </span>
              <span id="comment-count">${post.comments.length}</span>
            </p>
          </div>
          <div class="share">
            <p>
              <span class="material-symbols-outlined"> ios_share </span>
            </p>
          </div>
        </div>
      </div>
    `;
  });
}

handleShowPosts();
// add

let postText = document.getElementById("post-text");
let postImgUrl = document.getElementById("post-img-url");
let addPostBtn = document.getElementById("add-btn-post");

addPostBtn.addEventListener("click", async () => {
  let username = localStorage.getItem("accountName");

  if (!username) {
    alert("You have to Login to Add Post");
    return;
  }

  if (!postText.value.trim()) {
    alert("Please Fill Filed");
    return;
  }
  if (!postImgUrl.value.trim()) {
    alert("Please Fill Filed");
    return;
  }

  let users = await handleGetUsers();

  let userId = users.find((user) => user.username == username).id;
  console.log(userId);

  let newPost = {
    postText: postText.value,
    postImage: postImgUrl.value,
    authorId: userId,
  };
  await handleAddPost(newPost);
  postText.value = "";
  postImgUrl.value = "";
});

async function handleAddPost(post) {
  try {
    console.log(post);
    await fetch(`${apiUrl}posts`, {
      method: "POST",
      body: JSON.stringify({
        postText: post.postText,
        postImgUrl: post.postImage,
        authorId: post.authorId,
      }),
      headers: { "Content-type": "application/json" },
    });

    alert("Add Post Successfully");
    handleShowPosts();
  } catch (error) {
    console.log("Error In Add New Post:", error);
  }
}

// delete
let deletePostBtn = document.getElementById("delete-post-btn");

async function handleDeleteBtn(id) {
  let username = localStorage.getItem("accountName");

  if (!username) {
    return;
  }

  let users = await handleGetUsers();
  let posts = await handleGetPosts();
  let userId = users.find((user) => user.username == username).id;

  let authorPost = posts.find((post) => post.id == id).authorId;
  console.log(authorPost);
  if (userId == authorPost) {
    deletePostBtn.className = "btn btn-danger material-symbols-outlined";
    return true;
  }
  return false;

  //   if (localStorage.getItem("user")) {
  //   }
}

async function handleDeletePost(id) {
  let confirmDelete = confirm("Are You Sure You Wants Delete Post?");
  if (confirmDelete) {
    await fetch(`${apiUrl}posts/${id}`, {
      method: "DELETE",
    });
    alert("Delete Post Successfully");
    handleShowPosts();
  }
}

// comment Dialog

let commentBtn = document.getElementById("comment-btn");
let cancelCommentBtn = document.getElementById("cancel-comment-dialog");
let commentDialog = document.getElementById("comment-dialog");

async function handleOpenDeleteDialog(id) {
  await handleCommentsData(id);
  commentDialog.open = true;
  document.body.style.overflow = "hidden";
  commentDialog.className =
    "d-flex align-items-center justify-content-center position-fixed top-0 w-100 h-100";
  return true;
}

async function handleCommentsData(id) {
  try {
    let res = await fetch(`${apiUrl}posts/${id}`);
    let post = await res.json();
    console.log(post.comments);
    getEditElements(id, post.comments);
    handleShowComments(post.comments, id);
  } catch (error) {
    console.log("Error In Get Post:", error);
  }
}

cancelCommentBtn.addEventListener("click", () => {
  commentDialog.open = false;
  document.body.style.overflow = "auto";
  commentDialog.className = "d-none";
});

function handleShowComments(comments, postId) {
  let commentsContainer = document.getElementById("comments-section");

  let username = localStorage.getItem("accountName");
  console.log(postId);
  if (comments.length <= 0) {
    commentsContainer.innerHTML = `<div class="comment">
            <div class="user-info d-flex align-items-center gap-2">
                <p>There is No Comments yet</p>
                
                </div>
                </div>`;
  } else {
    commentsContainer.innerHTML = "";
    comments.forEach((comment, index) => {
      let isAuthor = username == comment.username;

      commentsContainer.innerHTML += `          <div class="comment">
      <div class="user-details d-flex justify-content-between">
      <div class="user-info d-flex align-items-center gap-2">
      <img
      class="rounded-circle"
      src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
      alt="avatar"
      width="50"
      />
      <h6>${comment.username}</h6>
      </div>
                            <span
            id="delete-post-btn"
            onclick="handleDeleteComment(${index},${postId})"
            class="btn btn-danger material-symbols-outlined ${
              isAuthor ? "d-flex" : "d-none"
            }"
            >delete</span
          >
            </div>

      <div class="comment-text ms-5 w-75">
      <p style="overflow-wrap: break-word;">
            ${comment.commentText}
            </p>
            </div>
            <hr />

            </div>
            
            `;
    });
  }
}

let addCommentBtn = document.getElementById("add-comment-btn");
let editPostId;
let editComments = [];

addCommentBtn.addEventListener("click", async () => {
  let commentInput = document.getElementById("comment-text");
  let username = localStorage.getItem("accountName");
  console.log(editPostId, editComments);
  if (!username) {
    alert("You have to Login to add Comment");
    return;
  }

  if (!commentInput.value.trim()) {
    alert("Please Fill Filed");
    return;
  }
  try {
    let newComment = {
      username: username,
      commentText: commentInput.value,
    };
    editComments.push(newComment);
    let sendComments = editComments;
    console.log(sendComments);
    await fetch(`${apiUrl}posts/${editPostId}`, {
      method: "PUT",
      body: JSON.stringify({
        comments: sendComments,
      }),
      headers: { "Content-type": "application/json" },
    });
  } catch (error) {
    console.log("Error in Add Comment:", error);
  }
  commentInput.value = "";
  handleCommentsData(editPostId);
  handleShowPosts();
});

function getEditElements(postId, comments) {
  editPostId = postId;
  editComments = comments;
  return;
}

async function handleDeleteComment(commentId, postId) {
  let posts = await handleGetPosts();
  let post = posts.find((post) => post.id == postId);
  post.comments.splice(commentId, 1);
  let newComments = post.comments;

  console.log(newComments);

  console.log(commentId);

  let confirmDelete = confirm("Are You Sure You Wants Delete Comment?");
  if (confirmDelete) {
    await fetch(`${apiUrl}posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify({
        comments: newComments,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    alert("Delete Comment Successfully");
  }
  handleCommentsData(postId);
  handleShowPosts();
}

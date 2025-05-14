const apiUrl = "https://682340b665ba05803395f8c3.mockapi.io/";

async function handelGetUsers() {
  try {
    let res = await fetch(`${apiUrl}users`);
    let users = await res.json();
    return users;
  } catch (error) {
    console.log(`Error In GetUsers: ${error}`);
  }
}
// Start Login
let loginForm = document.getElementById("login-form");
let emailLogInput = document.getElementById("login-email-input");
let passLogInput = document.getElementById("login-password-input");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const users = await handelGetUsers();

  let userExist = users.find(
    (user) =>
      user.email == emailLogInput.value && user.password == passLogInput.value
  );
  if (userExist) {
    localStorage.setItem("accountName", userExist.username);
    alert("Login Successfully, Press Ok to Redirect You To Home Page");
    window.location.href = "./index.html";
  } else {
    alert("Error In Login Check Email Or Password");
    return;
  }
});
// End Login

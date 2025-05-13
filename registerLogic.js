const apiUrl = "https://682340b665ba05803395f8c3.mockapi.io/";
// Start Create an Account

let registerForm = document.getElementById("register-form");
let usernameRegInput = document.getElementById("username-input");
let emailRegInput = document.getElementById("email-input");
let passRegInput = document.getElementById("password-input");
let confirmPassRegInput = document.getElementById("confirm-password-input");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let newUser = {
    username: usernameRegInput.value.toLowerCase(),
    email: emailRegInput.value.toLowerCase(),
    password: passRegInput.value,
    confirmPassword: confirmPassRegInput.value,
  };
  handleCreateUser(newUser);
});

async function handleCreateUser(user) {
  console.log(user);
  if (user.password != user.confirmPassword) {
    alert("Password Does not Match");
  }
  const users = await handelGetUsers();
  console.log(users);
  let emailExist = users.find((e) => e.email == user.email) ? true : false;

  if (emailExist) {
    alert("This Email Already Exist");
    return;
  }

  let userExist = users.find((e) => e.username == user.username) ? true : false;

  if (userExist) {
    alert("This User Already Exist");
    return;
  }

  handelCreateUsers(user);
}

async function handelGetUsers() {
  try {
    let res = await fetch(`${apiUrl}users`);
    let users = await res.json();
    return users;
  } catch (error) {
    console.log(`Error In GetUsers: ${error}`);
  }
}
async function handelCreateUsers(user) {
  try {
    await fetch(`${apiUrl}users`, {
      method: "POST",
      body: JSON.stringify({
        email: user.email,
        username: user.username,
        password: user.password,
      }),
      headers: { "Content-type": "application/json" },
    });
    alert("Create an Account Successfully, Press Ok To Redirect to Login Page");
    window.location.href = "./login.html";
  } catch (error) {
    console.log(`Error In CreateUsers: ${error}`);
  }
}

// End Create an Account

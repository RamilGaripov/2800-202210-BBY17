const fName = document.getElementById("firstName");
const lName = document.getElementById("lastName");
const pword = document.getElementById("password");
const email = document.getElementById("email");
const dob = document.getElementById("birthday");

const errorMsg = document.getElementById("errorMsg");


document.querySelector("#submit").addEventListener("click", function (e) {
  var messages = [];
  console.log(messages);
  if (fName.value === "" || fName.value == null) {
    messages.push("First Name is required.");
  }

  if (lName.value === "" || lName.value == null) {
    messages.push("Last Name is required.");
  }

  // console.log(email.value);
  // console.log(email.value.length);
  if (email.value.length < 1) {
    messages.push("Email is required.");
  }

  //This mailformat string is taken from w3recource: 
  //@author: w3resource
  //@URL: https://www.w3resource.com/javascript/form/email-validation.php
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if(!email.value.match(mailformat)){
    messages.push("You have entered an invalid email address!");
  }
  

  if (dob.value === "" || dob.value == null) {
    messages.push("Birthday is required.");
  }

  if (pword.value.length < 6) {
    messages.push("Password must contain at least 6 characters.");
  }
  

  if (messages.length > 0) {
    e.preventDefault(); //prevents standard behavior of the button. 
    errorMsg.textContent = messages[0];
   
  } else {
    e.preventDefault();
    createAccount({
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      birthday: document.getElementById("birthday").value,
      password: document.getElementById("password").value,
      passwordConfirm: document.getElementById("passwordConfirm").value
    });
  }

});


async function createAccount(data) {

  if (data.password != data.passwordConfirm) {
    document.getElementById("errorMsg").textContent = "Passwords are not matching.";
    return;
  }
  try {
    console.log(data);
    const response = await fetch("/create-account", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await response.json();
    console.log(parsedJSON);
    // if fail -> error else redirect to correct pages;
    if (parsedJSON.status == "fail") {
      document.getElementById("errorMsg").textContent = parsedJSON.msg;
    } else {
      if (parsedJSON.privileges) {
        window.location.replace("/dashboard");
      } else {
        window.location.replace("/");
      }
    }
  } catch (err) {
    console.log(err);
  }

}

document.querySelector("#go_back").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/");
});
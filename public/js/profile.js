const greeting = document.getElementById("greeting");
const fName = document.getElementById("firstname");
const lName = document.getElementById("lastname");
const pword = document.getElementById("password");
const email = document.getElementById("email");
const dob = document.getElementById("dob");
const pic = document.getElementById("profilepic");
const errorMsg = document.getElementById("errorMsg");

var user_id = null;

async function getMyInfo() {
  const response = await fetch("/profile-info", {
    method: "GET"
  });
  const myData = await response.json();
  populateInfo(myData.data);
}

function populateInfo(data) {
  // console.log(data.id);
  greeting.textContent = data.first_name;
  fName.value = data.first_name;
  lName.value = data.last_name;
  email.value = data.email;
  pword.value = data.password;
  var dobFormatted = data.dob.substring(0, 10);
  dob.value = dobFormatted;
  pic.src = data.avatar;
  

  user_id = data.id;
}

document.querySelector("#submit_edits").addEventListener("click", function (e) {
  var messages = [];
  console.log(messages);
  console.log(dob.value);
  if (fName.value === "" || fName.value == null) {
    messages.push("First Name is required.");
  }

  if (lName.value === "" || lName.value == null) {
    messages.push("Last Name is required.");
  }

  if (email.value.length < 1) {
    messages.push("Email is required.");
  }

  //This mailformat string is taken from w3recource: 
  //@author: w3resource
  //@URL: https://www.w3resource.com/javascript/form/email-validation.php
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email.value.match(mailformat)) {
    messages.push("You have entered an invalid email address!");
  }


  if (dob.value === "" || dob.value == null) {
    messages.push("Birthday is required.");
  }

  if (dob.value < "1900-01-01") {
    messages.push("Please enter a valid date of birth.");
  }

  if (dob.value > "2019-06-01") {
    messages.push("The user has to be at least 3 years old.");
  }

  if (pword.value.length < 6) {
    messages.push("Password must contain at least 6 characters.");
  }

  if (messages.length > 0) {
    e.preventDefault(); //prevents standard behavior of the button. 
    errorMsg.textContent = messages[0];

  } else {
    e.preventDefault();
    editUser({
      user_id: user_id,
      first_name: document.getElementById("firstname").value,
      last_name: document.getElementById("lastname").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      dob: document.getElementById("dob").value
    });
  }
});

async function editUser(data) {
  try {
    errorMsg.textContent = "";
    const response = await fetch("/update-user", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await response.json();
    if (parsedJSON.status == "fail") {
      console.log("This user's info could not be updated.");
    } else {
      document.getElementById("serverMsg").textContent = parsedJSON.msg;
      //need to take em back to the dashboard
      // window.location.replace("/edit");
    }
  } catch (err) {
    console.log(err);
  }
}

document.querySelector("#go_back").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/main");
});

//upload photo js for profile
//This code is taken from Arron Ferguson's example "UPLOAD-FILE"
// @author Arron Ferguson
const uploadForm = document.getElementById("upload-images-form");
uploadForm.addEventListener("submit", uploadImages);

async function uploadImages(e) {
  e.preventDefault();
  try {
    const imageUpload = document.querySelector("#image-upload");
    const formData = new FormData();

    for (let i = 0; i < imageUpload.files.length; i++) {
      // put the images from the input into the form data
      formData.append("avatar", imageUpload.files[i]);
    }

    console.log(formData);

    const response = await fetch("/post-new-avatar", {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (data.status == "fail") {
      document.getElementById("serverMsg").textContent = data.msg;
    } else {
      document.getElementById("serverMsg").textContent = data.msg;
    }

  } catch (err) {
    console.log(err);
  }
}

getMyInfo();
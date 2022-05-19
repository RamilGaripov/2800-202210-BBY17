document.querySelector("#submit").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Submit pressed.")
    
    editUser({
        first_name : document.getElementById("firstname").value,
        last_name : document.getElementById("lastname").value,
        email : document.getElementById("email").value,
        password : document.getElementById("password").value,
        dob : document.getElementById("dob").value
    });
});

async function editUser(data) {
    try{
    console.log("Edit user activated.");
    console.log(data);
    const response = await fetch("/update-user", {
        method: "POST",
        headers: {
            "Accept" : "application/json",
            "Content-Type" : "application/json"
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
    } catch(err) {
        console.log(err);
    }
}

document.querySelector("#go_back").addEventListener("click", function(e) {
    e.preventDefault();    
    window.location.replace("/main");
});

//upload photo js for profile
const upLoadForm = document.getElementById("upload-images-form");
upLoadForm.addEventListener("submit", uploadImages);

async function uploadImages(e) {
  try{
  e.preventDefault();

  const imageUpload = document.querySelector("#image-upload");
  const formData = new FormData();

  for (let i = 0; i < imageUpload.files.length; i++) {
    // put the images from the input into the form data
    formData.append("files", imageUpload.files[i]);
  }

  console.log(formData);

  const response = await fetch("/post-new-avatar", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: formData
  })
  const data = await response.json();
  console.log(data);

  if (data.status == "fail") {
    console.log("Unable to update your photo.");
    document.getElementById("serverMsg").textContent = data.msg;
  } else {
    console.log("Your photo has been updated.");
    document.getElementById("serverMsg").textContent = data.msg;
  }


  } catch(err) {
    console.log(err);
  }
}

document.querySelector("#go_back").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/main");
});

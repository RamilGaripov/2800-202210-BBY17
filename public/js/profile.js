document.querySelector("#submit_edits").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Submit pressed.");
    
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
//This code is taken from Arron Ferguson's example "UPLOAD-FILE"
// @author Arron Ferguson
const uploadForm = document.getElementById("upload-images-form");
uploadForm.addEventListener("submit", uploadImages);

async function uploadImages(e) {
  e.preventDefault();
  try{
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

  } catch(err) {
    console.log(err);
  }
}

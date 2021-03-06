//Login page code which allows users to sign in
document.querySelector("#submit").addEventListener("click", function(e) {
  e.preventDefault();
  loginUser({
    email : document.getElementById("email").value,
    password : document.getElementById("password").value
  });
});

async function loginUser(data) {
  try {
    
    let responseObject = await fetch("/login", {
      method: "POST", 
      headers: {
        "Accept" : "application/json",
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(data)
    });
    let parsedJSON = await responseObject.json();
    // if fail -> error else redirect to correct pages;
    if (parsedJSON.status == "fail") {
      console.log("Couldn't log you in.");
      document.getElementById("errorMsg").textContent = parsedJSON.msg;
    } else {
      if (parsedJSON.privileges) {
        window.location.replace("/dashboard");
      } else {
        window.location.replace("/main");
      }
    }
  } catch(err) {
    console.log(err);
  }
}

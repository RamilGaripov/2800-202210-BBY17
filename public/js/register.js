document.querySelector("#submit").addEventListener("click", function (e) {
  e.preventDefault(); //prevents standard behavior of the button. 
  console.log("Registering a new user.");
  createAccount({
    firstName : document.getElementById("firstName").value,
    lastName : document.getElementById("lastName").value,
    email : document.getElementById("email").value,
    birthday : document.getElementById("birthday").value,
    password : document.getElementById("password").value,
    passwordConfirm : document.getElementById("passwordConfirm").value
  })

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
  })
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
  } catch(err) {
    console.log(err);
  }

}

document.querySelector("#go_back").addEventListener("click", function (e) {
  e.preventDefault(); 
  window.location.replace("/");
});
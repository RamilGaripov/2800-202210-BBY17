//THIS FUNCTION CURRENTLY GIVES ERRORS:

ready(function () {
  console.log("Client script loaded.");

  // POST TO THE SERVER
  document.querySelector("#submit").addEventListener("click", function (e) {
    alert("SUBMITTING");
    e.preventDefault();
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let queryString = "email=" + email.value + "&password=" + password.value;
    console.log("data that we will send", email.value, password.value);

    ajaxPOST("/login", function (data) {
        //   console.log("You are trying to log in. This function is called in client.js!");
        if (data) {
          let dataParsed = JSON.parse(data);
          console.log(dataParsed);
          if (dataParsed.status == "fail") {
            document.getElementById("errorMsg").innerHTML = dataParsed.msg;
          } else {
            window.location.replace("/profile");
          }
        }
        //document.getElementById("errorMsg").innerHTML = dataParsed.msg;
      },
      queryString
    );
  });
});

function ready(callback) {
    if (document.readyState != "loading") {
        callback();
        console.log("ready state is 'complete'");
    } else {
        document.addEventListener("DOMContentLoaded", callback);
        console.log("Listener was invoked");
    }
}
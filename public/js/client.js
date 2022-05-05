//THIS FUNCTION CURRENTLY GIVES ERRORS:

ready(function () {
  console.log("Client script loaded.");

  // POST TO THE SERVER. Send the information entered in the form and submit it. 
  document.querySelector("#submit").addEventListener("click", function (e) {
    e.preventDefault(); //prevents standard behavior of the button. 
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let queryString = "email=" + email.value + "&password=" + password.value;
    console.log("data being sent to the server", email.value, password.value);
    
    //Checking if function is async or not
    // if (ajaxPOST.constructor.name === 'AsyncFunction') {
    //   // 👇️ this runs
    //   console.log('✅ function is async');
    // } else {
    //   console.log('⛔️ function is NOT async');
    // }

    function ajaxPOST(url, callback, data) {
      
      //prepares the proper format for the data to send to the server
      let params = typeof data == 'string' ? data : Object.keys(data).map(
              function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
          ).join('&');
      console.log("params in ajaxPOST", params);

      //retrieves data from the server
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
          if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
              //console.log('responseText:' + xhr.responseText);
              callback(this.responseText);

          } else {
              console.log(this.status);
          }
      }
      xhr.open("POST", url);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(params);
  }


    ajaxPOST("/login", function (data) {
        if (data) {
          let dataParsed = JSON.parse(data);
          console.log("Data about the user:");
          console.log(dataParsed);
          let privileges = dataParsed.privileges;
          if (dataParsed.status == "fail") {
            document.getElementById("errorMsg").textContent = dataParsed.msg;
          } else if (privileges) {
            window.location.replace("/admin");
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
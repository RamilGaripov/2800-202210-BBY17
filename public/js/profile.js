document.querySelector("#submit").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Submit pressed.")
    
    editUser({
        first_name : document.getElementById("firstname").value,
        last_name : document.getElementById("lastname").value,
        email : document.getElementById("email").value,
        admin : document.getElementById("admin").checked,
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
document.
document.querySelector("#go_back").addEventListener("click", function(e) {
    e.preventDefault();    
    window.location.replace("/main");
});


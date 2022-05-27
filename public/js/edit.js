const fName = document.getElementById("firstname");
const lName = document.getElementById("lastname");
const email = document.getElementById("email");
const dob = document.getElementById("dob");
const errorMsg = document.getElementById("errorMsg");

document.querySelector("#submit").addEventListener("click", function (e) {
    var messages = [];
    
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

    if (messages.length > 0) {
        e.preventDefault(); //prevents standard behavior of the button. 
        errorMsg.textContent = messages[0];

    } else {
        e.preventDefault();
        editUser({
            first_name: document.getElementById("firstname").value,
            last_name: document.getElementById("lastname").value,
            email: document.getElementById("email").value,
            admin: document.getElementById("admin").checked,
            dob: document.getElementById("dob").value,
            points: document.getElementById("points").value
        });
    }
});

//allows admins to edit ppl's info from the admin dashboard
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
        }
    } catch (err) {
        console.log(err);
    }
}

document.querySelector("#go_back").addEventListener("click", function (e) {
    e.preventDefault();
    window.location.replace("/dashboard");
});
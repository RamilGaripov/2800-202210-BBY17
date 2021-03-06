//creates the dashboard table and populates it with data received from the app.get("/get-accounts") method on the server side. This is function declaration. The function is called at the bottom of this file!
async function getAccounts() {
    try {
        let response = await fetch("/get-accounts", {
            method: "GET",
        });

        //ATTRIBUTION:
        //This table creation code is taken from the examples of our COMP2537 professor, Mr. Arron Ferguson.
        //RDBMS-CRUD MySQL example.
        var str;
        if (response.status === 200) {
            const data = await response.json();
            // console.log("the data: ", data);

            //For veiwport width above 682px
            if (window.innerWidth > 682) {
                str = `<tr>
                <th class="id_header"><span>ID</span></th>
                <th class="first_name_header"><span>First Name</span></th>
                <th class="last_name_header"><span>Last Name</span></th>
                <th class="email_header"><span>Email</span></th>
                <th class="points_header"><span>Total Points</span></th>
                <th class="edit_header"></th>
                <th class="reset_header"></th>
                <th class="delete_header"></th>
                </tr>`;

                for (let i = 0; i < data.rows.length; i++) {
                    let row = data.rows[i];
                    //console.log("row", row);
                    str += ("<tr><td class='id'>" + row.id +
                        "</td><td class='first_name'>" + row.first_name +
                        "</td><td class='last_name'>" + row.last_name +
                        "</td><td class='email'>" + row.email +
                        "</td><td class='points'>" + row.points +
                        "</td><td class='edit'>" + "<button type='submit' class='edit_user dash'>Edit</button>" +
                        "</td><td class='reset'>" + "<button type='submit' class='reset_password dash'>Reset</button>" +
                        "</td><td class='delete'>" + "<button type='submit' class='delete_user dash'>Delete</button>" +
                        "</td></tr>");
                    // id_array.push(row)
                }
                assignFunctionality();
                
            } else {
                str = `<tr>
                    <th class="id_header"><span>ID</span></th>
                    <th class="first_name_header"><span>First Name</span></th>
                    <th class="last_name_header"><span>Last Name</span></th>
                    <th class="email_header"><span>Email</span></th>
                    <th class="points_header"><span>Total Points</span></th>
                    </tr>`;

                for (let i = 0; i < data.rows.length; i++) {
                    let row = data.rows[i];
                    //console.log("row", row);
                    str +=
                        "<tr><td class='id'>" +
                        row.id +
                        "</td><td class='first_name'>" +
                        row.first_name +
                        "</td><td class='last_name'>" +
                        row.last_name +
                        "</td><td class='email'>" +
                        row.email +
                        "</td><td class='points'>" +
                        row.points +
                        "</td></tr><tr class='button_area'><td class='edit'>" +
                        "<button type='submit' class='edit_user dash'>Edit</button>" +
                        "</td><td></td><td class='reset'>" +
                        "<button type='submit' class='reset_password dash'>Reset</button>" +
                        "</td><td></td><td class='delete'>" +
                        "<button type='submit' class='delete_user dash'>Delete</button>" +
                        "</td></tr>";
                    // id_array.push(row)
                }
                assignFunctionality();
            }

            function assignFunctionality() {
            //provides EDIT BUTTON functionality 
            document.getElementById("accounts").innerHTML = str;
            const edits = document.getElementsByClassName("edit_user");
            for (let j = 0; j < edits.length; j++) {
                edits[j].addEventListener("click", function (e) {
                    e.preventDefault();
                    console.log("Let's edit the user with id", data.rows[j].id);
                    //When calling this function, we're passing a JSON object in the parameters, using {key : value} format.
                    editUser({
                        id: data.rows[j].id
                    });
                });
            }

            //provides RESET PASSWORD BUTTON functionality 
            const resets = document.getElementsByClassName("reset_password");
            for (let l = 0; l < resets.length; l++) {
                resets[l].addEventListener("click", function (e) {
                    e.preventDefault();
                    console.log("Let's reset the password of the user with id", data.rows[l].id);
                    //When calling this function, we're passing a JSON object in the parameters, using {key : value} format.
                    resetPassword({
                        id: data.rows[l].id
                    });
                });
            }

            //provides DELETE BUTTON functionality 
            const deletes = document.getElementsByClassName("delete_user");
            for (let k = 0; k < deletes.length; k++) {
                deletes[k].addEventListener("click", function (e) {
                    e.preventDefault();

                    Swal.fire({
                        title: 'Delete ' + data.rows[k].first_name + ' ' + data.rows[k].last_name + "'s account?",
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#ffa62b',
                        confirmButtonText: 'Delete!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deleteUser({
                                id: data.rows[k].id,
                                fName: data.rows[k].first_name,
                                lName: data.rows[k].last_name
                            });
                        }
                    });
                });
            }
        }
        } else {
            console.log(response.status);
        }

    } catch (error) {
        console.log(error);
    }
}

//sends id of the user to the server. Redirects to the edit.html
async function editUser(data) {
    try {
        // console.log("Edit user activated.");
        // console.log(data);
        const response = await fetch("/edit-user", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        let parsedJSON = await response.json();
        if (parsedJSON.status == "fail") {
            console.log("Couldn't edit this user's info.");
        } else {
            window.location.replace("/edit");
        }
    } catch (err) {
        console.log(err);
    }
}

//sends id of the user to the server. Redirects to the edit.html
async function resetPassword(data) {
    try {
        const response = await fetch("/reset-user-password", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        let parsedJSON = await response.json();
        if (parsedJSON.status == "fail") {
            console.log("Couldn't reset this user's pw.");
        } else {
            console.log("Password reset.");
            getAccounts();
            document.getElementById("serverMsg").textContent = parsedJSON.msg;
        }
    } catch (err) {
        console.log(err);
    }
}

//deletes the user from the db and refreshes the page
async function deleteUser(data) {
    try {
        const response = await fetch("/delete-user", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await response.json();
        if (parsedJSON.status == "fail") {
            Swal.fire(
                'Warning!',
                "You cannot delete the last remaining administrator.",
                'info'
            );
        } else {
            console.log("User deleted.");
            getAccounts();
            Swal.fire(
                'Deleted!',
                data.fName + ' ' + data.lName + "'s account has been deleted.",
                'success'
            );
        }
    } catch (err) {
        console.log(err);
    }
}

function resize() {
    //   console.log(window.innerHeight + window.innerWidth);
    getAccounts();
}
window.onresize = resize;

getAccounts();
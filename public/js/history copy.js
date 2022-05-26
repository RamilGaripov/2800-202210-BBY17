async function getPosts() {
    try {
        const response = await fetch("/get-previous-activities", {
            method: "GET"
        });

        const data = await response.json();
        console.log(data);
        const rows = data.rows;

        // const comments_response = await fetch("/get-comments", {
        //     method: "GET"
        // });
        // const comments = await comments_response.json();
        // console.log(comments);
        if (data.status == "fail") {
            document.getElementById("serverMsg").textContent = data.msg;
        } else {

            // one_post = document.querySelector(".card_template");
            // postInsert = document.getElementById("postInsert");


            // one_post.content.cloneNode(true);
            // document.getElementsByClassName("subtitle").textContent = "You completed a " + row.title + " game on " + row.time_completed;
            // document.getElementsByClassName("activity_title").textContent = row.title;
            // document.getElementsByClassName("comment_section").textContent = row.comment;
            // document.getElementsByClassName("points").textContent = row.points;
            // document.getElementsByClassName("activity_pic").setAttribute("src", row.image);
            // postInsert.appendChild(one_post);

            let str =
                `<section class="user_posts">
                  <legend class="subtitle"></legend>
                  <fieldset class="border user_post_div">
                    <div class="left_box">
                      <img alt="activity" class="activity_pic"/>
                      <form class="upload-images-form">
                        <input class="image-upload" type="file" value="Upload Image" accept="image/png, image/gif, image/jpeg"
                          multiple="multiple" />
                        <input class="submit" type="submit" value="Submit" />
                      </form>
                    </div>
                  </fieldset>

                  <fieldset class="border">
                    <div>
                      <b>Name: </b><span class="activity_title"></span>
                      <b>Points Received: <span class="points"></span></b>
                    </div>
                    <textarea class="comment_section" cols="40" rows="10"
                      placeholder="How did you feel about this experience?"></textarea>
                    <button type="submit" class="submit_comment">SAVE</button>
                  </fieldset>
            </section>`;



            //Temporary solution for history posts creation. Need to re-think this part.

            // var putHere;
            // for (let m = 0; m < rows.length; m++) {
            //     var post = document.createElement("fieldset");
            //     putHere = document.getElementById("postshare");
            //     putHere.appendChild(post);
            //     post.textContent="HIII";
            // }

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];

                document.getElementsByClassName("posts")[i].innerHTML = str;
                document.getElementsByClassName("subtitle")[i].textContent = "You completed a " + row.title + " game on " + row.time_completed;
                document.getElementsByClassName("activity_title")[i].textContent = row.title;
                document.getElementsByClassName("comment_section")[i].textContent = row.comment;
                document.getElementsByClassName("points")[i].textContent = row.points;
                document.getElementsByClassName("activity_pic")[i].setAttribute("src", row.image);
            }

            // provides SAVE BUTTON functionality
            const saves = document.getElementsByClassName("submit_comment");
            for (let j = 0; j < saves.length; j++) {
                saves[j].addEventListener("click", function (e) {
                    e.preventDefault();
                    const user_comment = document.getElementsByClassName("comment_section")[j].value;
                    saveComment({
                        play_id: rows[j].play_id,
                        comment: user_comment
                    });
                });
            }

            document.getElementById("activity_title").textContent = rows[0].title;

        }
    } catch (err) {
        console.log(err);
    }
}

async function saveComment(data) {
    try {
        console.log("Saving the comment");
        // console.log(data);

        const response = await fetch("/update-comment", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        let parsedJSON = await response.json();
        if (parsedJSON.status == "fail") {
            document.getElementById("serverMsg").textContent = parsedJSON.msg;
        } else {
            getPosts();
            document.getElementById("serverMsg").textContent = parsedJSON.msg;
        }

    } catch (err) {
        console.log(err);
    }
}

getPosts();









//creates the dashboard table and populates it with data received from the app.get("/get-accounts") method on the server side. This is function declaration. The function is called at the bottom of this file!
async function getAccounts() {
    try {
        let response = await fetch("/get-accounts", {
            method: "GET"
        });

        //ATTRIBUTION: 
        //This table creation code is taken from the examples of our COMP2537 professor, Mr. Arron Ferguson. 
        //RDBMS-CRUD MySQL example. 

        if (response.status === 200) {
            const data = await response.json();
            // console.log("the data: ", data);

            for (let i = 0; i < data.rows.length; i++) {
                let row = data.rows[i];
                //console.log("row", row);
                new_row = document.querySelector();

                   one_post = document.querySelector(".card_template");
            postInsert = document.getElementById("postInsert");


            one_post.content.cloneNode(true);
                str += ("<tr><td class='id'>" + row.id +
                    "</td><td class='first_name'>" + row.first_name +
                    "</td><td class='last_name'>" + row.last_name +
                    "</td><td class='email'>" + row.email +
                    "</td><td class='points'>" + row.points +
                    "</td><td class='edit'>" + "<button type='submit' class='edit_user dash'>Edit</button>" +
                    "</td><td class='reset'>" + "<button type='submit' class='reset_password dash'>Reset Password</button>" +
                    "</td><td class='delete'>" + "<button type='submit' class='delete_user dash'>Delete</button>" +
                    "</td></tr>");
                // id_array.push(row)
            }

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
                          Swal.fire(
                            'Deleted!',
                            data.rows[k].first_name + ' ' + data.rows[k].last_name + "'s account has been deleted.",
                            'success'
                          );
                          deleteUser({
                            id: data.rows[k].id
                          });
                        }
                      });
                });
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
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
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
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
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
            console.log("Cannot delete this user.");
        } else {
            console.log("User deleted.");
            getAccounts();
        }
    } catch (err) {
        console.log(err);
    }
}

getAccounts();
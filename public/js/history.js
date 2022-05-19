//creates the dashboard table and populates it with data received from the app.get("/get-accounts") method on the server side. This is function declaration. The function is called at the bottom of this file!
// async function getPosts() {
//     try {
//         let response = await fetch("/get-posts", {
//             method: "GET"
//         });


        // if (response.status === 200) {
        //     const data = await response.json();
        //     // console.log("the data: ", data);
            // let str = `<tr>
            //     <th class="id_header"><span>ID</span></th>
            //     <th class="first_name_header"><span>First Name</span></th>
            //     <th class="last_name_header"><span>Last Name</span></th>
            //     <th class="email_header"><span>Email</span></th>
            //     <th class="points_header"><span>Total Points</span></th>
            //     <th class="edit_header"></th>
            //     <th class="delete_header"></th>
            //     </tr>`;

            // for (let i = 0; i < data.rows.length; i++) {
            //     let row = data.rows[i];
            //     //console.log("row", row);
            //     str += ("<tr><td class='id'>" + row.id +
            //         "</td><td class='first_name'>" + row.first_name +
            //         "</td><td class='last_name'>" + row.last_name +
            //         "</td><td class='email'>" + row.email +
            //         "</td><td class='points'>" + row.points +
            //         "</td><td class='edit'>" + "<button type='submit' class='edit_user'>Edit</button>" +
            //         "</td><td class='delete'>" + "<button type='submit' class='delete_user'>Delete</button>" +
        //             "</td></tr>");
        //         // id_array.push(row)
        //     }

        //     //provides EDIT BUTTON functionality 
        //     document.getElementById("accounts").innerHTML = str;
        //     const edits = document.getElementsByClassName("edit_user");
        //     for (let j = 0; j < edits.length; j++) {
        //         edits[j].addEventListener("click", function (e) {
        //             e.preventDefault();
        //             console.log("Let's edit the user with id", data.rows[j].id);
        //             //When calling this function, we're passing a JSON object in the parameters, using {key : value} format.
        //             editUser({
        //                 id: data.rows[j].id
        //             });
        //         })
        //     }

        //     //provides DELETE BUTTON functionality 
        //     const deletes = document.getElementsByClassName("delete_user");
        //     for (let k = 0; k < deletes.length; k++) {
        //         deletes[k].addEventListener("click", function (e) {
        //             e.preventDefault();
        //             if (confirm("Delete " + data.rows[k].first_name + " " + data.rows[k].last_name + "'s account?")) {
        //                 console.log("Let's delete the user with id", data.rows[k].id);
        //                 deleteUser({
        //                     id: data.rows[k].id
        //                 });
        //             }
        //         });
        //     }
        // } else {
        //     console.log(response.status);
        // }

//     } catch (error) {
//         console.log(error);
//     }
// }

// //sends id of the user to the server. Redirects to the edit.html
// async function editUser(data) {
//     try {
//         // console.log("Edit user activated.");
//         // console.log(data);
//         const response = await fetch("/edit-user", {
//             method: "POST",
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(data)
//         });
//         let parsedJSON = await response.json();
//         if (parsedJSON.status == "fail") {
//             console.log("Couldn't edit this user's info.");
//         } else {
//             window.location.replace("/edit");
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }

// //deletes the user from the db and refreshes the page
// async function deleteUser(data) {
//     try {
//         // console.log("Delete user activated");
//         // console.log(data);

//         const response = await fetch("/delete-user", {
//             method: "POST",
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(data)
//         });
//         let parsedJSON = await response.json();
//         if (parsedJSON.status == "fail") {
//             console.log("Cannot delete this user.");
//         } else {
//             console.log("User deleted.")
//             getAccounts();
//         }

//     } catch (err) {
//         console.log(err);
//     }
// }

// document.querySelector("#go_to_main").addEventListener("click", function(e) {
//     e.preventDefault();
//     window.location.replace("/main");
// })

// getPosts();

{/* <section style="border:1px solid black; padding:10px;">
            <h2 class="subtitle">post title placehodl</h2>
            <div style="display: flex">
              <div class="left_box">
                <img src="" alt="" />
                <form id="upload-images-form">
                  <input
                    id="image-upload"
                    type="file"
                    value="Upload Image"
                    accept="image/png, image/gif, image/jpeg"
                    multiple="multiple"
                  />
                  <input id="submit" type="submit" value="Submit" />
                </form>
              </div>
              <div style="display: block">
                <div><span>Name:Hello</span> <span>Points:World</span></div>
                <textarea name="" id="" cols="30" rows="10"></textarea>
              </div>
            </div>
          </section> */}

async function getPosts() {
    try{
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
           
        //     let str = `<section class="user_posts"><h2 class="subtitle">post title placehodl</h2><div class="user_post_div">
        //     <div class="left_box">
        //       <img src="" alt="" />
        //       <form id="upload-images-form">
        //         <input
        //           id="image-upload"
        //           type="file"
        //           value="Upload Image"
        //           accept="image/png, image/gif, image/jpeg"
        //           multiple="multiple"
        //         />
        //         <input id="submit" type="submit" value="Submit" />
        //       </form>
        //     </div>
        //     <div style="display: block">
        //       <div><p>Name: <span class="activity_title"></span></p> <span>Points:World</span></div>
        //       <textarea name="" id="" cols="30" rows="10"></textarea>
        //     </div>
        //   </div></section>`;

          let str = `<section class="user_posts"><h2 class="subtitle"></h2><div class="user_post_div">
            <div class="left_box">
              <img src="" alt="" />
              <form class="upload-images-form">
                <input
                  class="image-upload"
                  type="file"
                  value="Upload Image"
                  accept="image/png, image/gif, image/jpeg"
                  multiple="multiple"
                />
                <input class="submit" type="submit" value="Submit" />
              </form>
            </div>
            <div style="display: block">
              <div><p>Name: <span class="activity_title"></p><p>Points: <span class="points"></span></p></div>
              <textarea class="comment_section" cols="30" rows="10"></textarea>
              <button type="submit" class="submit_comment">SAVE</button>
            </div>
          </div></section>`;

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];

                
                document.getElementsByClassName("posts")[i].innerHTML = str;
                document.getElementsByClassName("subtitle")[i].textContent = "You completed a " + row.title + " game on " + row.time_completed;
                console.log("Time: ", row.time_completed);
                console.log("Converted time: ", row.time_completed.toLocaleString('en-GB', { timeZone: 'UTC' }));
                document.getElementsByClassName("activity_title")[i].textContent = row.title;
                document.getElementsByClassName("comment_section")[i].textContent = row.comment;
            }

            // provides SAVE BUTTON functionality 
            const saves = document.getElementsByClassName("submit_comment");
            for (let j = 0; j < saves.length; j++) {
                saves[j].addEventListener("click", function(e) {
                    e.preventDefault();
                    const user_comment = document.getElementsByClassName("comment_section")[j].value;
                    saveComment({play_id : rows[j].play_id, comment: user_comment});
                });
            }
            
            // document.getElementById("activity_title").textContent = rows[0].title;

        }
    } catch(err) {
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
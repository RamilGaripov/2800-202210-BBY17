function getAllAccounts() {

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {

              let data = JSON.parse(this.responseText);
              if(data.status == "success") {

                let str = `<tr>
                <th class="id_header"><span>ID</span></th>
                <th class="first_name_header"><span>First Name</span></th>
                <th class="last_name_header"><span>Last Name</span></th>
                <th class="email_header"><span>Email</span></th>
                <th class="edit_header"></th>
                <th class="delete_header"></th>

                </tr>`;

                    for(let i = 0; i < data.rows.length; i++) {
                        let row = data.rows[i];
                        //console.log("row", row);
                        str += ("<tr><td class='id'>" + row.id
                            + "</td><td class='first_name'>" + row.first_name
                            + "</td><td class='last_name'>" + row.last_name
                            + "</td><td class='email'>" + row.email
                            + "</td><td class='edit'>" + "<button type='submit' id='edit_user'>Edit</button>"
                            + "</td><td class='delete'>" + "<button type='submit' id='delete_user'>Delete</button>"
                            + "</td></tr>");
                    }
                    // console.log(data.rows[0].dob.substring(0, 8));
                    //console.log(str);

                    // document.querySelector("#edit_user").addEventListener("click", function(e) {
                    //     e.preventDefault();
                    //     console.log("Let's edit the user.");
                    // });
                    
                    // document.querySelector("#delete_user").addEventListener("click", function(e) {
                    //     e.preventDefault();
                    //     console.log("Let's delete the user.");
                    // });

                    document.getElementById("accounts").innerHTML = str;

                    // select all spans under the email class of td elements
                    // let first_names = document.querySelectorAll("td[class='first_name']");
                    // for(let j = 0; j < first_names.length; j++) {
                    //     first_names[j].addEventListener("click", editCell);
                    // }
                    
                    // let last_names = document.querySelectorAll("td[class='last_name']");
                    // for(let k = 0; k < last_names.length; k++) {
                    //     last_names[k].addEventListener("click", editCell);
                    // }

                    // let emails = document.querySelectorAll("td[class='email']");
                    // for(let l = 0; l < emails.length; l++) {
                    //     emails[l].addEventListener("click", editCell);
                    // }

                    // let passwords = document.querySelectorAll("td[class='password'] span");
                    // for(let m = 0; m < passwords.length; m++) {
                    //     passwords[m].addEventListener("click", editCell);
                    // }

                    // let admins = document.querySelectorAll("td[class='admin'] span");
                    // for(let n = 0; n < admins.length; n++) {
                    //     admins[n].addEventListener("click", editCell);
                    // }

                    // let dobs = document.querySelectorAll("td[class='dob'] span");
                    // for(let o = 0; o < dobs.length; o++) {
                    //     dobs[o].addEventListener("click", editCell);
                    // }

                } else {
                    console.log("Error!");
                }

            } else {

              // not a 200, could be anything (404, 500, etc.)
              console.log(this.status);

            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("GET", "/get-accounts");
    xhr.send();
}

getAllAccounts();



//DO I NEED SEPARATE FUNCTIONS FOR ALL THE TYPES OF DATA? 
//for DOB, i wanna use input type="date"
//for email, i wanna use input type="email"

// function editCell(e) {
//     console.log("EDITING CELLS");
    
//     let spanText = e.target.textContent;
//     console.log("Editing :", spanText);
//     let parent = e.target.parentNode;
//     console.log(parent);
//     let input = document.createElement("input");
//     input.value = spanText;
//     console.log("NEW DATA: ", input.value);

//     input.addEventListener("keyup", function(e) {
//         let v = null;
//         if (e.code === "Enter") {
//             console.log("Pressed enter");
//             v = input.value;
//             let newSpan = document.createElement("span");
//                     // have to wire an event listener to the new element
//                     newSpan.addEventListener("click", editCell);
//                     newSpan.innerHTML = v;
//                     parent.innerHTML = "";
//                     parent.appendChild(newSpan);
//                     let dataToSend = {id: parent.parentNode.querySelector(".id").textContent,
//                                       first_name: parent.parentNode.querySelector(".first_name").textContent,
//                                       last_name: parent.parentNode.querySelector(".last_name").textContent,
//                                       email: v,
//                                       password: parent.parentNode.querySelector(".first_name").textContent,
//                                     };

//                     // now send
//                     const xhr = new XMLHttpRequest();
//                     xhr.onload = function () {
//                         if (this.readyState == XMLHttpRequest.DONE) {

//                             // 200 means everthing worked
//                             if (xhr.status === 200) {
//                               document.getElementById("status").innerHTML = "Record updated.";
//                               getCustomers();

//                             } else {
//                               // not a 200, could be anything (404, 500, etc.)
//                               console.log(this.status);
//                             }

//                         } else {
//                             console.log("ERROR", this.status);
//                         }
//                     }
//                     xhr.open("POST", "/update-account");
//                     xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//                     xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//                     //console.log("dataToSend", "id=" + dataToSend.id + "&email=" + dataToSend.email);
//                     xhr.send("id=" + dataToSend.id + "&email=" + dataToSend.email);

//                 }
//             });
//     parent.textContent = "";
//     parent.appendChild(input);
// }

// function editCell(e) {

//     // add a listener for clicking on the field to change email
//     // span's text
//     let spanText = e.target.innerHTML;
//     // span's parent (td)
//     let parent = e.target.parentNode;
//     // create a new input, and add a key listener to it
//     let input = document.createElement("input");
//     input.value = spanText;
//     input.addEventListener("keyup", function(e) {
//         let s = null;
//         let v = null;
//         // pressed enter
//         if(e.which == 13) {
//             v = input.value;
//             let newSpan = document.createElement("span");
//             // have to wire an event listener to the new element
//             newSpan.addEventListener("click", editCell);
//             newSpan.innerHTML = v;
//             parent.innerHTML = "";
//             parent.appendChild(newSpan);
//             let dataToSend = {id: parent.parentNode.querySelector(".id").innerHTML,
//                               name: parent.parentNode.querySelector(".name").innerHTML,
//                               email: v};

//             // now send
//             const xhr = new XMLHttpRequest();
//             xhr.onload = function () {
//                 if (this.readyState == XMLHttpRequest.DONE) {

//                     // 200 means everthing worked
//                     if (xhr.status === 200) {
//                       document.getElementById("status").innerHTML = "Record updated.";
//                       getCustomers();


//                     } else {

//                       // not a 200, could be anything (404, 500, etc.)
//                       console.log(this.status);

//                     }

//                 } else {
//                     console.log("ERROR", this.status);
//                 }
//             }
//             xhr.open("POST", "/update-customer");
//             xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
//             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//             //console.log("dataToSend", "id=" + dataToSend.id + "&email=" + dataToSend.email);
//             xhr.send("id=" + dataToSend.id + "&email=" + dataToSend.email);

//         }
//     });
//     parent.innerHTML = "";
//     parent.appendChild(input);

// }
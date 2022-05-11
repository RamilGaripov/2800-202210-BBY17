// function getAllAccounts() {

//     const xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//         if (this.readyState == XMLHttpRequest.DONE) {

//             // 200 means everthing worked
//             if (xhr.status === 200) {

//               let data = JSON.parse(this.responseText);
//               if(data.status == "success") {

//                 let str = `<tr>
//                 <th class="id_header"><span>ID</span></th>
//                 <th class="first_name_header"><span>First Name</span></th>
//                 <th class="last_name_header"><span>Last Name</span></th>
//                 <th class="email_header"><span>Email</span></th>
//                 <th class="edit_header"></th>
//                 <th class="delete_header"></th>

//                 </tr>`;

//                     for(let i = 0; i < data.rows.length; i++) {
//                         let row = data.rows[i];
//                         //console.log("row", row);
//                         str += ("<tr><td class='id'>" + row.id
//                             + "</td><td class='first_name'>" + row.first_name
//                             + "</td><td class='last_name'>" + row.last_name
//                             + "</td><td class='email'>" + row.email
//                             + "</td><td class='edit'>" + "<button type='submit' id='edit_user'>Edit</button>"
//                             + "</td><td class='delete'>" + "<button type='submit' id='delete_user'>Delete</button>"
//                             + "</td></tr>");
//                     }

//                     document.getElementById("accounts").innerHTML = str;
//                 } else {
//                     console.log("Error!");
//                 }

//             } else {

//               // not a 200, could be anything (404, 500, etc.)
//               console.log(this.status);

//             }

//         } else {
//             console.log("ERROR", this.status);
//         }
//     }
//     xhr.open("GET", "/get-accounts");
//     xhr.send();
// }

// getAllAccounts();


async function getAccounts() {
    try {
        let response = await fetch("/get-accounts", {
            method: "GET"
        });
        
        if (response.status === 200) {
            const data = await response.json();
            // console.log("the data: ", data);
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
                            + "</td><td class='edit'>" + "<button type='submit' class='edit_user'>Edit</button>"
                            + "</td><td class='delete'>" + "<button type='submit' class='delete_user'>Delete</button>"
                            + "</td></tr>");
                    }

                    document.getElementById("accounts").innerHTML = str;
                    const edits = document.getElementsByClassName("edit_user");
                    for (let j = 0; j < edits.length; j++) {
                        edits[j].addEventListener("click", function(e) {
                            console.log("Let's edit the user with id", (j+1));
                            //need to redirect to the page where it will fetch all the information of that user with id = j+1.
                            window.location.replace("/edit-user");
                        })
                    }

                    const deletes = document.getElementsByClassName("delete_user");
                    for (let k = 0; k < deletes.length; k++) {
                        deletes[k].addEventListener("click", function(e) {
                            console.log("Let's delete the user with id", (k+1));
                        });
                    }
        } else {
            console.log(response.status);
        }
        

    } catch(error) {
        console.log(error);
    }
}

getAccounts();

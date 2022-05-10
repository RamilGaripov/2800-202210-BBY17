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
                <th class="password_header"><span>Password</span></th>
                <th class="admin_header"><span>Administrator</span></th>
                <th class="dob_header"><span>Date of Birth</span></th>
                </tr>`;


                    for(let i = 0; i < data.rows.length; i++) {
                        let row = data.rows[i];
                        //console.log("row", row);
                        str += ("<tr><td class='id'>" + row.id
                            + "</td><td class='first_name'>" + row.first_name
                            + "</td><td class='last_name'>" + row.last_name
                            + "</td><td class='email'>" + row.email
                            + "</td><td class='password'>" + row.password
                            + "</td><td class='admin'>" + row.is_admin 
                            + "</td><td class='dob'>" + row.dob.substring(0, 10) + "</td></tr>");
                    }
                    // console.log(data.rows[0].dob.substring(0, 8));
                    //console.log(str);
                    document.getElementById("accounts").innerHTML = str;

                    // select all spans under the email class of td elements
                    let records = document.querySelectorAll("td[class='email']");
                    for(let j = 0; j < records.length; j++) {
                        records[j].addEventListener("click", editCell);
                    }

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

function editCell(e) {
    console.log("EDITING CELLS");

    // // add a listener for clicking on the field to change email
    // // span's text
    // let spanText = e.target.innerHTML;
    // // span's parent (td)
    // let parent = e.target.parentNode;
    // // create a new input, and add a key listener to it
    // let input = document.createElement("input");
    // input.value = spanText;
    // input.addEventListener("keyup", function(e) {
    //     let s = null;
    //     let v = null;
    //     // pressed enter
    //     if(e.which == 13) {
    //         v = input.value;
    //         let newSpan = document.createElement("span");
    //         // have to wire an event listener to the new element
    //         newSpan.addEventListener("click", editCell);
    //         newSpan.innerHTML = v;
    //         parent.innerHTML = "";
    //         parent.appendChild(newSpan);
    //         let dataToSend = {id: parent.parentNode.querySelector(".id").innerHTML,
    //                           name: parent.parentNode.querySelector(".name").innerHTML,
    //                           email: v};

    //         // now send
    //         const xhr = new XMLHttpRequest();
    //         xhr.onload = function () {
    //             if (this.readyState == XMLHttpRequest.DONE) {

    //                 // 200 means everthing worked
    //                 if (xhr.status === 200) {
    //                   document.getElementById("status").innerHTML = "Record updated.";
    //                   getCustomers();


    //                 } else {

    //                   // not a 200, could be anything (404, 500, etc.)
    //                   console.log(this.status);

    //                 }

    //             } else {
    //                 console.log("ERROR", this.status);
    //             }
    //         }
    //         xhr.open("POST", "/update-customer");
    //         xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //         xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //         //console.log("dataToSend", "id=" + dataToSend.id + "&email=" + dataToSend.email);
    //         xhr.send("id=" + dataToSend.id + "&email=" + dataToSend.email);

    //     }
    // });
    // parent.innerHTML = "";
    // parent.appendChild(input);

}
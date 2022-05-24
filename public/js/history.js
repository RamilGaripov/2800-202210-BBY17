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
    </div>
    </section>`;
           
            //Temporary solution for history posts creation. Need to re-think this part.

             // var putHere;
            // for (let m = 0; m < rows.length; m++) {
            //     var post = document.createElement("fieldset");
            //     putHere = document.getElementById("postshere");
            //     putHere.appendChild(post);
            //     post.textContent="HIII";
            // }

            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];

                console.log("DB format: ", row.time_completed);
                var date = new Date(row.time_completed);
                date = new Date(date.getTime());
                let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
                var day = date.toLocaleString("en-US", dateOptions);
                let timeOptions = { hour12: 'true', hour: "numeric", minute: "numeric", second: "numeric"};
                var time = date.toLocaleString("en-US", timeOptions);
                
                console.log("Format post locale-string conversion: ", date);
                document.getElementsByClassName("posts")[i].innerHTML = str;
                document.getElementsByClassName("subtitle")[i].textContent = "You completed a " + row.title + " game on " + day + " at " + time;
                document.getElementsByClassName("activity_title")[i].textContent = row.title;
                document.getElementsByClassName("comment_section")[i].textContent = row.comment;
                document.getElementsByClassName("points")[i].textContent = row.points;
                document.getElementsByClassName("activity_pic")[i].setAttribute("src", row.image);
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
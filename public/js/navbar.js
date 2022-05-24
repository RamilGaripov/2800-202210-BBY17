let container = document.querySelector(".container");

function navInsertion() {

  let nav = document.createElement("nav");
  nav.innerHTML = `<a id="logo" href="/html/main.html"></a>
<ul class="navbarul">
    <li class="option">
        <img src="/img/home_icon.png" alt="main page" id="go_to_main" class="nav_links" >Main Page
    
    <li class="option">
        <img src="/img/rewards_icon.png" alt="rewards" id="go_to_rewards" class="nav_links">Rewards
    </li>
    <li class="option">
        <img src="/img/clock.png" alt="history" id="go_to_history" class="nav_links">History
    </li>
    </li>
    <li class="option">
        <img src="/img/profile_icon.png" alt="profile" id="go_to_edit" class="nav_links">Edit Profile
    </li>
    <li class="option" id="adminLink">
    <img src="/img/wrench_icon.png" alt="profile" class="nav_links">Admin Dash
    </li>
</ul>
<form action="/logout"class="logout">
<button type="submit" id="logout"><img src="/img/bye.png" alt="exit"><b>Leave</b></button>
</form>`;

  container.prepend(nav);
}
navInsertion();


document
  .querySelector("#go_to_history")
  .addEventListener("click", function (e) {
    e.preventDefault();
    window.location.replace("/history");
  })

document
  .querySelector("#go_to_rewards")
  .addEventListener("click", function (e) {
    e.preventDefault();
    // alert("this feature is coming soon!");
    Swal.fire({
      title: "Error",
      text: "This feature is coming soon!",
      icon: "warning",
      confirmButtonText: "Okay"
    });
    // window.location.replace("/timeline.html");
  });

document.querySelector("#go_to_edit").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/profile");
});

document.querySelector("#go_to_main").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/main");
});

document.querySelector("#logout").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/logout");
});

// allows the admins to redirect back to the dashboard

// console.log(is_admin);

async function adminShow() {
  const response = await fetch("/is-admin", {
    method: "GET"
  });
  const data = await response.json();
  const is_admin = data.privileges;
  if (is_admin) {
    console.log("This is an admin."); //take this out once you dont need it
    document.getElementById("adminlink").style.display = "flex";
  } 
}
adminShow();
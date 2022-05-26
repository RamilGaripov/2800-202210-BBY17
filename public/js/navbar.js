let container = document.querySelector(".container");

function navInsertion() {

  let nav = document.createElement("nav");
  nav.innerHTML = `<a id="logo" href="#top"></a>
<ul class="navbarul" id="top">
    <li class="option" id="go_to_main">
        <img src="/img/home_icon.png" alt="main page"  class="nav_links" >Main Page
    
    <li class="option" id="go_to_reward">
        <img src="/img/rewards_icon.png" alt="rewards"  class="nav_links">Rewards
    </li>
    <li class="option" id="go_to_history">
        <img src="/img/clock.png" alt="history"  class="nav_links">History
    </li>
    </li>
    <li class="option" id="go_to_edit" >
        <img src="/img/profile_icon.png" alt="profile" class="nav_links">Edit Profile
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
  });


document.querySelector("#go_to_edit").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/profile");
});

document.querySelector("#go_to_main").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/main");
});

document.querySelector("#go_to_reward").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/reward");
});

document.querySelector("#logout").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/logout");
});

document.querySelector("#adminLink").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.replace("/dashboard");
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
    document.querySelector("#adminLink").style.display = "flex";
  } 
}
adminShow();
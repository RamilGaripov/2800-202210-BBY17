let container = document.querySelector(".container");
function navInsertion() {
 
  let nav = document.createElement("nav");
  nav.innerHTML = `<a id="logo" href="/html/main.html"></a>
<ul class="navbarul">
    <li class="option">
        <img src="/img/profile_icon.png" alt="profile" id="go_to_edit" class="nav_links">Edit Profile
    </li>
    <li class="option">
        <img src="/img/rewards_icon.png" alt="rewards" id="go_to_rewards" class="nav_links">Rewards
    </li>
    <li class="option">
        <img src="/img/clock.png" alt="history" id="go_to_history" class="nav_links">History
    </li>
    <li class="option">
        <img src="/img/mind_games_icon.png" alt="main page" id="go_to_main" class="nav_links" >Main Page
    </li>
</ul>
<form action="/logout"class="logout">
<button type="submit" id="logout"><img src="/img/bye.png" width>Leave</button>
</form>`;

    container.prepend(nav);
}
navInsertion();

document
  .querySelector("#go_to_history")
  .addEventListener("click", function (e) {
    e.preventDefault();
    window.location.replace("/previous_activities");
  });

document
  .querySelector("#go_to_rewards")
  .addEventListener("click", function (e) {
    e.preventDefault();
    console.log("/timeline.html");
    window.location.replace("/timeline.html");
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

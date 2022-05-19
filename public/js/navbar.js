document.querySelector("#go_to_history").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.replace("/history");
})

document.querySelector("#go_to_rewards").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("/timeline.html");
    window.location.replace("/timeline.html");
})

document.querySelector("#go_to_edit").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.replace("/profile");
})

document.querySelector("#go_to_main").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.replace("/main");
})

document.querySelector("#logout").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.replace("/logout");
})
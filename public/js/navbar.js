document.querySelector("#go_to_history").addEventListener("click", function(e) {
    e.preventDefault();
    window.location.replace("/previous_activities");
})

document.querySelector("#go_to_rewards").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("page doesnt exist yet");
    // window.location.replace("/");
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
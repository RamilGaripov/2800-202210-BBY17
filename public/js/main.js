document.querySelector("#go_to_profile").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("profile pressed")
    window.location.replace("/profile");
});

document.querySelector("#go_to_history").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("history pressed")
    window.location.replace("/history");
});


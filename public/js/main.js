document.querySelector("#go_to_profile").addEventListener("click", function(e) {
    e.preventDefault();
    console.log("profile pressed")
    window.location.replace("/profile");
});
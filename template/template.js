//fancy popup
document
  .querySelector("#go_to_reward")
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
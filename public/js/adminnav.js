// allows the admins to redirect back to the dashboard
function adminShow() {
    if (is_admin) {
        document.getElementById("adminlink").style.visibility = "visible";
    }
}
adminShow();
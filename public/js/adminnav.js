// allows the admins to redirect back to the dashboard

// var admin = req.session.is_admin.value;

// console.log(is_admin);

async function adminShow() {
    if ( is_admin == !is_admin) {
        document.getElementById("adminlink").style.visibility = "visible";
    } 
}
adminShow();
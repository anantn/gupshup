
function prereqs() {
  if (!navigator.id) {
    redirect("Sorry, Persona could not be loaded!");
    return;
  }
  if (!navigator.mozGetUserMedia) {
    redirect("Sorry, getUserMedia is not available!");
    return;
  }
  if (!window.mozPeerConnection) {
    redirect("Sorry, PeerConnection is not available!");
    return;
  }

  // All pre-requisites available!
  navigator.id.watch({
    onlogin: function(ast) {
      jQuery.post(
        "login", {assertion:ast},
        function() { window.location.reload(); },
        function() { redirect("Login failed!"); }
      );
    },
    onlogout: function() {
      jQuery.post(
        "logout",
        function() { redirect("You have been logged out!"); },
        function() { redirect("Logout failed!"); }
      );
    }
  });

  // Enable the sign-in/sign-out button, if needed.
  var box = document.getElementById("login-box");
  if (box) {
    box.style.display = "block";
  }
}

function redirect(msg) {
  if (window.location.search == "") {
    window.location.href ="login?err=" + encodeURIComponent(msg);
  }
}

function login() {
  navigator.id.request();
}

function logout() {
  navigator.id.logout();
}

prereqs();

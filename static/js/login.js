
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

  // All pre-requisites available! TODO: Provide loggedInEmail param.
  navigator.id.watch({
    onlogin: function(ast) {
      showLoader();
      jQuery.post(
        "login", {assertion: ast},
        function() { window.location.reload(); }
      ).error(function() { redirect("Login failed!"); });
    },
    onlogout: function() {
      jQuery.post(
        "logout", null,
        function() { redirect("You have been logged out!", true); }
      ).error(function() { redirect("Logout failed!"); });
    }
  });

  // Enable the sign-in/sign-out button, if needed.
  showLogin();
}

function redirect(msg, force) {
  if (force || window.location.search == "") {
    window.location.href ="login?err=" + encodeURIComponent(msg);
  } else {
    showLogin();
  }
}

function showLoader() {
  var box = document.getElementById("login-box");
  var loader = document.getElementById("loading");
  if (box && loader) {
    box.style.display = "none";
    loader.style.display = "block";
  }
}

function showLogin() {
  var box = document.getElementById("login-box");
  if (box) {
    box.style.display = "block";
  }
  var loader = document.getElementById("loading");
  if (loader) {
    loader.style.display = "none";
  }
}

prereqs();

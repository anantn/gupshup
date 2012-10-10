
function prereqs() {
  if (!navigator.mozGetUserMedia) {
    error("Sorry, getUserMedia is not available! (Did you set media.navigator.enabled?)");
    return;
  }
  if (!window.mozRTCPeerConnection) {
    error("Sorry, PeerConnection is not available! (Did you set media.peerconnection.enabled?)");
    return;
  }

  // Enable the sign-in/sign-out button, if needed.
  showLogin();
}

function doLogin(name) {
  showLoader();
  document.location = ""
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

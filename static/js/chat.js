
// Ugh, globals.
var peerc;
var source = new EventSource("events");

source.addEventListener("ping", function(e) {}, false);

source.addEventListener("userjoined", function(e) {
  appendUser(e.data);
}, false);

source.addEventListener("userleft", function(e) {
  removeUser(e.data);
}, false);

source.addEventListener("offer", function(e) {
  var offer = JSON.parse(e.data);

  document.getElementById("incomingUser").innerHTML = offer.from;
  document.getElementById("incomingAccept").onclick = function() {
    $("#incomingCall").modal("hide");
    acceptCall(offer);
  };
  $("#incomingCall").modal();
}, false);

source.addEventListener("answer", function(e) {
  var answer = JSON.parse(e.data);
  peerc.setRemoteDescription(answer.answer, function() {
    console.log("Call established!");
  }, error);
}, false);

function appendUser(user) {
  var d = document.createElement("div");
  d.setAttribute("id", btoa(user));

  var a = document.createElement("a");
  a.setAttribute("class", "btn btn-block btn-inverse");
  a.setAttribute("onclick", "initiateCall('" + user + "');");
  a.innerHTML = "<i class='icon-user icon-white'></i> " + user;

  d.appendChild(a);
  d.appendChild(document.createElement("br"));
  document.getElementById("users").appendChild(d);
}

function removeUser(user) {
  var d = document.getElementById(btoa(user));
  if (d) {
    document.getElementById("users").removeChild(d);
  }
}

// TODO: refactor, this function is almost identical to initiateCall().
function acceptCall(offer) {
  document.getElementById("main").style.display = "none";
  document.getElementById("call").style.display = "block";

  navigator.mozGetUserMedia({video:true}, function(vs) {
    document.getElementById("localvideo").src = vs;
    document.getElementById("localvideo").play();

    navigator.mozGetUserMedia({audio:true}, function(as) {
      document.getElementById("localaudio").src = as;
      document.getElementById("localaudio").play();

      var pc = new mozPeerConnection();
      pc.addStream(vs);
      pc.addStream(as);

      pc.onRemoteStreamAdded = function(obj) {
        if (obj.type == "video") {
          document.getElementById("remotevideo").src = obj.stream;
        } else {
          document.getElementById("remoteaudio").src = obj.stream;
        }
        document.getElementById("dialing").style.display = "none";
        document.getElementById("hangup").style.display = "block";
      };

      pc.setRemoteDescription(offer.offer, function() {
        pc.createAnswer(offer.offer, function(answer) {
          pc.setLocalDescription(answer, function() {
            // Send answer to remote end.
            peerc = pc;
            jQuery.post(
              "answer", {
                to: offer.from,
                from: offer.to,
                answer: JSON.stringify(answer)
              },
              function() { console.log("Answer sent!"); }
            ).error(error);
          }, error);
        }, error);
      }, error);
    }, error);
  }, error);
}

function initiateCall(user) {
  document.getElementById("main").style.display = "none";
  document.getElementById("call").style.display = "block";

  navigator.mozGetUserMedia({video:true}, function(vs) {
    document.getElementById("localvideo").src = vs;
    document.getElementById("localvideo").play();

    navigator.mozGetUserMedia({audio:true}, function(as) {
      document.getElementById("localaudio").src = as;
      document.getElementById("localaudio").play();

      var pc = new mozPeerConnection();
      pc.addStream(vs);
      pc.addStream(as);

      pc.onRemoteStreamAdded = function(obj) {
        if (obj.type == "video") {
          document.getElementById("remotevideo").src = obj.stream;
        } else {
          document.getElementById("remoteaudio").src = obj.stream;
        }
        document.getElementById("dialing").style.display = "none";
        document.getElementById("hangup").style.display = "block";
      };

      pc.createOffer(function(offer) {
        pc.setLocalDescription(offer, function() {
          // Send offer to remote end.
          peerc = pc;
          jQuery.post(
            "offer", {
              to: user,
              from: document.getElementById("user").innerHTML,
              offer: JSON.stringify(offer)
            },
            function() { console.log("Offer sent!"); }
          ).error(error);
        }, error);
      }, error);
    }, error);
  }, error);
}

function endCall() {
  document.getElementById("call").style.display = "none";
  document.getElementById("main").style.display = "block";
}

function error(e) {
  alert("Oh no! " + e);
  endCall();
}


var source = new EventSource("events");

source.addEventListener("ping", function(e) {
  alert("got ping");
}, false);

source.addEventListener("userjoined", function(e) {
  alert(e.data);
}, false);

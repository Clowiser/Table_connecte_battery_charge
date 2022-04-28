var modal = document.getElementById("myModal");

var btn = document.getElementById("btn");

var btn2 = document.getElementById("btn2");

var btn3 = document.getElementById("btn3");

var btn4 = document.getElementById("btn4");

var btn5 = document.getElementById("btn5");

var btn6 = document.getElementById("btn6");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

btn2.onclick = function() {
    modal.style.display = "block";
}

btn3.onclick = function() {
    modal.style.display = "block";
}

btn4.onclick = function() {
    modal.style.display = "block";
}

btn5.onclick = function() {
    modal.style.display = "block";
}

btn6.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function AutorizarVideo(){
    var texto=document.getElementById("Status-video")
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function(stream) {
            var tracks = stream.getTracks();
            tracks[0].stop()
            texto.innerHTML = "Status: Autorizado";
          })
          .catch(function (err0r) {
            texto.innerHTML = "Status: " +err0r;
          });
    }
}

function LigarVideo(){
    var texto=document.getElementById("Status-video")
    var video = document.querySelector("#elemento-video");
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(function (stream) {
            video.srcObject = stream;
            texto.innerHTML = "Status: Câmera Ligada";
          })
          .catch(function (err0r) {
            texto.innerHTML = "Status: " +err0r;
          });
      }
}

function DesligarVideo() {
    var video = document.querySelector("#elemento-video");
    var stream = video.srcObject;
    var tracks = stream.getTracks();
    tracks[0].stop()
    video.srcObject = null;
    var texto=document.getElementById("Status-video")
    texto.innerHTML = "Status: Câmera Desligada";
}
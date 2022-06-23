
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
            LigarVideo.status=1
            LigarVideo.mediaRecorder = new MediaRecorder(stream, {mimeType:"video/webm"});
            SalvarVideo.arquivo=[]
            LigarVideo.mediaRecorder.ondataavailable = (e) => {
              SalvarVideo.arquivo.push(e.data);
            };
            LigarVideo.mediaRecorder.onstart = (e) => {
              setTimeout(PausarGravacao(), 1)
            };
            LigarVideo.mediaRecorder.onresume= (e) => {
              setTimeout(PausarGravacao(), 1)
            };
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
    LigarVideo.status=0
    tracks[0].stop()
    video.srcObject = null;
    var texto=document.getElementById("Status-video")
    texto.innerHTML = "Status: Câmera Desligada";
}

function PausarGravacao(){
  LigarVideo.mediaRecorder.pause();
  console.log("Pausado")
  LigarVideo.mediaRecorder.requestData()
}

function SalvarVideo(){
  const arquivo_blob = new Blob(SalvarVideo.arquivo, {type:"video/mp4"});
  if (SalvarVideo.link!=""){
    URL.revokeObjectURL(SalvarVideo.link);
  }
  SalvarVideo.link=URL.createObjectURL(arquivo_blob);
  document.getElementById("downloadlocal").href=SalvarVideo.link;
}



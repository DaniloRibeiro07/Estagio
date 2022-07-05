
// Rotina de solicitação da autorização da webcam
function AutorizarVideo(){
    var texto=document.getElementById("Status-video")  //identificar tag texto do status do video
    if (navigator.mediaDevices.getUserMedia) { //verificar se o navegador é compatível
        navigator.mediaDevices.getUserMedia({ video: true }) //solicitar autorização de vídeo
          .then(function(stream) {
            var tracks = stream.getTracks(); //receber faixa vídeo
            tracks[0].stop() //parar faixa de vídeo
            texto.innerHTML = "Status: Autorizado"; //atualizar a tag de texto para autorizado
          })
          .catch(function (err0r) {
            texto.innerHTML = "Status: " +err0r; //atualizar a tag de texto para justificativa de erro
          });
    }
}
//Fim Rotina de solicitação da autorização da webcam

//Início Rotina de solicitação da exibição do vídeo
function LigarVideo(){
    var texto=document.getElementById("Status-video")//identificar tag texto do status do video
    var video = document.querySelector("#elemento-video");//identificar tag da área de vídeo
    if (navigator.mediaDevices.getUserMedia) { //verifica se o navegador é compatível 
        navigator.mediaDevices.getUserMedia({ video: true }) //solicita dados de vídeo
          .then(function (stream) {
            video.srcObject = stream; //adiciona o stream de vídeo à tag de video
            texto.innerHTML = "Status: Câmera Ligada"; //atualiza o texto do status da câmera
            LigarVideo.status=1 //variável de controle, define que a câmera está ligada
            LigarVideo.mediaRecorder = new MediaRecorder(stream, {mimeType:"video/webm", videoBitsPerSecond: 2500000}); //define o formato de vídeo
            SalvarVideo.arquivo=[] //variável que contem os dados da câmera
            LigarVideo.mediaRecorder.ondataavailable = (e) => {
              SalvarVideo.arquivo.push(e.data); //quando houver um conjunto de dados de vídeo, adicione a variável arquivo
            };
            LigarVideo.mediaRecorder.onstart = (e) => {
              Gravar()
            };
            LigarVideo.mediaRecorder.onresume = (e) => {
              Gravar()
            };
          })
          .catch(function (err0r) {
            texto.innerHTML = "Status: " +err0r; //em caso de erro, atualizar a tag de texto junto com o erro
          });
      }
}
//Fim Rotina de solicitação da exibição do vídeo

//ínicio rotina de desligamento de vídeo
function DesligarVideo() {
    var video = document.querySelector("#elemento-video"); //identificar a área de vídeo
    var stream = video.srcObject; //recuperar
    var tracks = stream.getTracks();
    LigarVideo.status=0
    tracks[0].stop()
    video.srcObject = null;
    var texto=document.getElementById("Status-video")
    texto.innerHTML = "Status: Câmera Desligada";
}
//Fim Rotina de desligamento de vídeo

async function Gravar(){
  await esperar(200)
}

function esperar(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      PausarGravacao();
    }, x);
  });
}

function PausarGravacao(){
  if (PausarGravacao.status==1){
    LigarVideo.mediaRecorder.stop()
    PausarGravacao.status=0
  }else{
    LigarVideo.mediaRecorder.pause();
    console.log("Pausado")
    LigarVideo.mediaRecorder.requestData()
  }

}

function SalvarVideo(){
  const arquivo_blob = new Blob(SalvarVideo.arquivo, {type:"video/mp4"});
  if (SalvarVideo.link!=""){
    URL.revokeObjectURL(SalvarVideo.link);
  }
  SalvarVideo.link=URL.createObjectURL(arquivo_blob);
  document.getElementById("downloadlocal").href=SalvarVideo.link;
}



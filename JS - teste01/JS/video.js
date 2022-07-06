
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
    var stream = video.srcObject; //recuperar o elemento stream da área de vídeo
    var tracks = stream.getTracks(); //recuperar as faixas de vídeo do elemeto stream
    LigarVideo.status=0 //atualizar variável de controle
    tracks[0].stop() //parar faixa de vídeo
    video.srcObject = null;//definir como nulo a stream
    var texto=document.getElementById("Status-video") //identificar a tag de status do vídeo
    texto.innerHTML = "Status: Câmera Desligada"; //atualizar a tag de status do vídeo
}
//Fim Rotina de desligamento de vídeo


//ínicio de rotina gravação de take
async function Gravar(){ 
  await esperar(200) //executa a função esperar de forma assíncrona
}
function esperar(x) {
  return new Promise(resolve => { //cria um objeto de processamento assícrono, 
    setTimeout(() => { //quando o tempo decorrido ao chamar a função for >= x, pausa gravação
      PausarGravacao();
    }, x);
  });
}
//Fim Rotina de gravação de take

//ínicio da rotina pausar gravação
function PausarGravacao(){
  if (PausarGravacao.status==1){ //se o status for 1, a gravação é finalizada (parada)
    LigarVideo.mediaRecorder.stop()
    PausarGravacao.status=0 //reinicia o status
  }else{
    LigarVideo.mediaRecorder.pause(); //pausa gravação
    console.log("Pausado") 
    LigarVideo.mediaRecorder.requestData() //solicita dados de vídeo
  }

}
//Fim Rotina de pausar gravação

//ínicio da rotina Salvar Vídeo
function SalvarVideo(){
  const arquivo_blob = new Blob(SalvarVideo.arquivo, {type:"video/mp4"});
  if (SalvarVideo.link!=""){ //se já houver um link inicializado, apague-o
    URL.revokeObjectURL(SalvarVideo.link);
  }
  SalvarVideo.link=URL.createObjectURL(arquivo_blob); //cria um link com o conjunto de dados de vídeo
  document.getElementById("downloadlocal").href=SalvarVideo.link; //define o link do elemento e inicia download
}
//Fim Rotina de pausar gravação


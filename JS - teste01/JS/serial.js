        async function SelectCOM(){
            try{
                SelectCOM.port = await navigator.serial.requestPort()
                desconectCOM.valor=0
                InformacoesDisp()
            }catch (error){

            }
        }
        
        async function InformacoesDisp(){
            fetch("./data/usb.ids.txt")
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                let fabricante="Dispositivo Serial"
                let produto=fabricante
                try {
                    const vendorID=SelectCOM.port.getInfo().usbVendorId.toString(16)
                    const productID=SelectCOM.port.getInfo().usbProductId.toString(16)
                    const inicio_vendor=text.indexOf("\n"+vendorID)+("\n"+vendorID).length+2
                    if (inicio_vendor!=-1){
                        const fim_vendor=text.indexOf('\n',inicio_vendor)
                        const inicio_product=text.indexOf(productID,fim_vendor)+(productID).length+2
                        if (inicio_product!=1){
                            fabricante=text.substring(inicio_vendor,fim_vendor)
                            fim_product=text.indexOf('\n',inicio_product)
                            produto=text.substring(inicio_product,fim_product)
                        }
                    }
                } catch (error) {
                }
                var texto=document.getElementById("text-disp-select")
                if (fabricante!=produto){
                    texto.innerHTML = "Dispositivo selecionado: "  + fabricante + " - " + produto
                }else{
                    texto.innerHTML ="Dispositivo selecionado: " + fabricante
                }
            });
        }

        async function ConectCOM(){
            var texto = document.getElementById("text-status")
            try{
                await SelectCOM.port.open({baudRate:(115200),bufferSize:(255),dataBits:(8),flowControl:("none"),parity:("none"),stopBits:(1)})
                texto.innerHTML = "Status: Conectado"
                writeCOM.escrita = SelectCOM.port.writable.getWriter();
                readCOM();
            }catch (erro){
                texto.innerHTML = "Status: "+erro +" selecione outra porta e tente novamente."
            }
        }

        async function readCOM(){
            readCOM.texto=""
            while (SelectCOM.port.readable) {
                window.reader = SelectCOM.port.readable.getReader();
                try {
                    while (true) {
                        const { value, done } = await reader.read()
                        var caractere=new TextDecoder().decode(value)
                        var caixa =document.getElementById('text-area-read')
                        caixa.scrollTop = caixa.scrollHeight;
                        caixa.value += caractere;
                        readCOM.texto +=caractere;
                        //console.log(readCOM.texto.includes("ok"))
                        if (readCOM.texto=="start\r\n"){
                            writeCOM("M105\r\n")
                        }
                        if (readCOM.texto.includes("ok") && imprimirGCODE.status==1) {
                            imprimirGCODE()
                        }
                        if (readCOM.texto.includes("\n")){
                            readCOM.texto=""
                        }
                        if (desconectCOM.valor==1){
                            break
                        }
                        if (done) {
                            break;
                        }
                    }
                } catch (error) {
                } finally {
                    reader.releaseLock();
                    break
                }
            }
            desconectCOM()
        }

        async function writeCOM(value){
            //console.log(value)
            const encoder = new TextEncoder();
            const texto = value.toUpperCase(); 
            await writeCOM.escrita.write(encoder.encode(texto));
            var caixa =document.getElementById('text-area-write')
            caixa.scrollTop = caixa.scrollHeight;
            caixa.value += texto;
        }

        async function desconectCOM(){
            var texto = document.getElementById("text-status")
            try{
                await SelectCOM.port.close()
                desconectCOM.valor=0
                texto.innerHTML = "Status: Desconectado"
            }catch (erro){
                texto.innerHTML = "Status: "+erro 
            }            
        }

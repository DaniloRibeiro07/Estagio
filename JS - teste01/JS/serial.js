        var port = 0
        var desco= 0

        async function SelectCOM(){
            try{
                port = await navigator.serial.requestPort()
                InformacoesDisp()
            }catch (error){

            }
        }
        
        async function InformacoesDisp(){
            fetch("./data/usb.ids.txt")
            .then((response) => {
                console.log(response)
                return response.text();
            })
            .then((text) => {
                let fabricante="Dispositivo Serial"
                let produto=fabricante
                try {
                    const vendorID=port.getInfo().usbVendorId.toString(16)
                    const productID=port.getInfo().usbProductId.toString(16)
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
                await port.open({baudRate:(115200),bufferSize:(255),dataBits:(8),flowControl:("none"),parity:("none"),stopBits:(1)})
                texto.innerHTML = "Status: Conectado"
                readCOM();
            }catch (erro){
                texto.innerHTML = "Status: "+erro +" selecione outra porta e tente novamente."
            }
        }

        async function readCOM(){
            while (port.readable) {
                const reader = port.readable.getReader();
                try {
                    while (true) {
                        const { value, done } = await reader.read()
                        var texto=new TextDecoder().decode(value)
                        var caixa =document.getElementById('text-area')
                        caixa.scrollTop = caixa.scrollHeight;
                        caixa.value += texto;
                        if (desco){
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
            const encoder = new TextEncoder();
            const writer = port.writable.getWriter();
            const texto = value.toUpperCase() + '\n'; 
            await writer.write(encoder.encode(texto));
            writer.releaseLock();
        }

        async function desconectCOM(){
            var texto = document.getElementById("text-status")
            try{
                await port.close()
                desco=0
                texto.innerHTML = "Status: Desconectado"
            }catch{
                texto.innerHTML = "Status: "+erro 
            }            
        }

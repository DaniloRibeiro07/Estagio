        var port = 0
        var desco= 0
        async function SelectCOM(){
            port = await navigator.serial.requestPort()
            fetch("./data/usb.ids.txt")
                .then((response) => {
                    console.log(response)
                    return response.text();
                })
                .then((text) => {
                    try {
                        const vendorID=port.getInfo().usbVendorId.toString(16)
                        const productID=port.getInfo().usbProductId.toString(16)
                        const inicio_vendor=text.indexOf("\n"+vendorID)+("\n"+vendorID).length+2
                        if (inicio_vendor!=-1){
                            const fim_vendor=text.indexOf('\n',inicio_vendor)
                            const inicio_product=text.indexOf(productID,fim_vendor)+(productID).length+2
                            if (inicio_product!=1){
                                const fabricante=text.substring(inicio_vendor,fim_vendor)
                                const fim_product=text.indexOf('\n',inicio_product)
                                const produto=text.substring(inicio_product,fim_product)
                                console.log(fabricante)
                                console.log(produto)
                            }else{
                                const fabricante = "Dispositivo Desconhecido"
                                const produto = fabricante
                                console.log(fabricante)
                            }
                        }else{
                            const fabricante = "Dispositivo Desconhecido"
                            const produto = fabricante
                            console.log(fabricante)
                        }
                    } catch (error) {
                        const fabricante = "Dispositivo Desconhecido"
                        const produto = fabricante
                        console.log(fabricante)
                    }
                });
        }
        async function ConectCOM(){
            await port.open({baudRate:(115200),bufferSize:(255),dataBits:(8),flowControl:("none"),parity:("none"),stopBits:(1)})
            readCOM();
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
        async function desconectCOM(){
            await port.close()
            desco=0
        }
        async function writeCOM(value){
            const encoder = new TextEncoder();
            const writer = port.writable.getWriter();
            const texto = value.toUpperCase() + '\n'; 
            await writer.write(encoder.encode(texto));
            writer.releaseLock();
        }
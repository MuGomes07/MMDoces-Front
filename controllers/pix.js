// Função para gerar QR Code Pix real simplificado
  function gerarPixQRCode(chave, valor = null, nomeRecebedor = "M.M Doces & Salgados") {
    // Monta o código Pix EMV (simplificado)
    let pixPayload = `00020126580014br.gov.bcb.pix01${chave.length.toString().padStart(2,'0')}${chave}520400005303986540${valor ? (valor*100).toFixed(0).padStart(4,'0') : '0.01'}5802BR5913${nomeRecebedor}6009Campinas62070503***6304`; 
    // Cria QR Code
    new QRCode(document.getElementById("pix-qrcode"), {
      text: pixPayload,
      width: 150,
      height: 150
    });
  }

  // Chamada da função usando sua chave Pix
  gerarPixQRCode("m.marlimonte@gmail.com", 0); // valor 0 significa que o usuário preenche
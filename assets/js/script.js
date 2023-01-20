



let mensagem = new Object();

const user = new Object();

function criarUser(){
        user.name = prompt("Digite o seu nome de usuário");

        const promise=axios.post('https://mock-api.driven.com.br/api/v6/uol/participants' , user);
        promise.then(processResponse);
        promise.catch(processError);
        console.log("Enviou a requisição");


        
}
criarUser();

function carregarMensagem(){

    const  loadMessages = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    loadMessages.then(createChat);
    loadMessages.catch(processError);
}
carregarMensagem();
function processResponse(resposta){

        console.log("usuario cadastrado!");
        console.log (resposta.status);

}


function processError(erro) {
        console.log("Status code: " + erro.response.status); // Ex: 404
        console.log("Mensagem de erro: " + erro.response.data); // Ex: Not Found
}




function statusResponse(resposta){
        console.log("online!");

}


function createChat(resposta){
        let chatContent=document.querySelector('.chatContainer');
        chatContent.innerText = "";
    
        for(let i = 0;  i < 100 ; i ++){
            let hora= resposta.data[i].time;
            let nome_from= resposta.data[i].from;
            let nome_to= resposta.data[i].to;
            let texto= resposta.data[i].text;
            let tipo= resposta.data[i].type;
            
            if (tipo === 'status' || tipo === 'message'){
                chatContent.innerHTML += `
                    <div data-test = "message" class="${tipo}">
                    (${hora}) ${nome_from} para ${nome_to} :${texto}
                    </div> 
    
                `
            }
        }
    
        chatContent.querySelector('div:last-child').scrollIntoView();
}




function verifyStatus(){
        verificadorDeStatus=user;
        const promise= axios.post('https://mock-api.driven.com.br/api/v6/uol/status',verificadorDeStatus);
        promise.then(statusResponse);
        promise.catch(processError);
}
setInterval(() => {
    console.log("verificando status do usuario: "+user.name);
    verifyStatus();
}, 5000);

setInterval(() => {
    carregarMensagem();  
}, 3000);


function btnEnviar(){
     let input = document.getElementById("txtArea");
     let msg = input.value;
     sendMessage(msg);
     input.value = "";
}

function sendMessage(msg){
    
    mensagem.from = user.name;
    mensagem.to = "all";
    mensagem.text = msg;
    mensagem.type="message";
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages',mensagem);  
    promise.then(processResponse);
    promise.catch(processError);

}
"use strict";
let mensagem = new Object();
const user = new Object();

let usuarioAutorizado = 0;

function autenticarUsuario(){

    let inputUsuario = document.getElementById('inputLogin');

    if(usuarioAutorizado == 0 && (inputUsuario.value!= null || inputUsuario.value != undefined|| inputUsuario.value !== "")){
            user.name = inputUsuario.value;
            const  authUser = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
            authUser.then(verificaUsuarioExiste);
            authUser.catch(processErrorAutenticador);
    }else{
            alert("Nome de usuário já existe ou o campo está vazio, por favor escolha outro!");
            inputUsuario.value="";
    }
}


function verificaUsuarioExiste(resposta){
            
            const mainInterface= document.querySelector(".main");
            const loginInterface = document.querySelector (".loginScreen");
            for(let i = 0;  i < 100 ; i ++){
                if(user.name === resposta.data[i].from){
                    spam("o nome de usuario ja existe, tente um outro!");
                    user.name ="";
                }else if (user.name!= undefined || user.name !="" || user.name != resposta.data[i].from){
                    console.log("logado com sucesso!");
                    setTimeout(() => {
                        loginInterface.classList.add("hide");
                        mainInterface.classList.remove("hide");
                    }, 1000);
                    
                    usuarioAutorizado = 1;
                   
                }else{
                    console.log("caiu no else da veirificação");
                }
            }
}


if (usuarioAutorizado == 1){
    criarUser();
}
function carregarMensagem(){
            const  loadMessages = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
            loadMessages.then(createChat);
            loadMessages.catch(processErrorLoadMessages);
}

function criarUser(){
          
            if(usuarioAutorizado== 1){
            const creatingUser= axios.post('https://mock-api.driven.com.br/api/v6/uol/participants' , user);
            creatingUser.then(processResponseCreateUser);
            creatingUser.catch(processErrorCreateUser);
            carregarMensagem();
            
            }else{
            console.log("houve um problema com a autenticação do usuario, por favor volte mais tarde.");
            
        }
}



function processResponseCreateUser(resposta){

            console.log("usuario cadastrado!");
            console.log (resposta.status);

}


function processErrorLoadMessages(erro) {
            console.log("Status code: " + erro.response.status); // Ex: 404
            console.log("erro no loadMessages " + erro.response.data); // Ex: Not Found
}

function processErrorAutenticador(erro) {
            console.log("Status code: " + erro.response.status); // Ex: 404
            console.log("erro no autenticador " + erro.response.data); // Ex: Not Found

}function processErrorCreateUser(erro) {
            console.log("Status code: " + erro.response.status); // Ex: 404
            console.log("Erro no create User: " + erro.response.data); // Ex: Not Found
}
function statusResponse(){
            console.log("online!");

}
function processErrorStatus(erro){
            console.log("Status code: " + erro.response.status); // Ex: 404
            console.log("Erro no status: " + erro.response.data); // Ex: Not Found
}


function createChat(resposta){
            let chatContent=document.querySelector('.chatContainer');
            chatContent.innerText = "";
            let heightPage = chatContent.scrollHeight;
                 
            for(let i = 0;  i < 100 ; i ++){
                let hora= resposta.data[i].time;
                let nome_from= resposta.data[i].from;
                let nome_to= resposta.data[i].to;
                let texto= resposta.data[i].text;
                let tipo= resposta.data[i].type;

                if (tipo === 'status' || tipo === 'message'){
                    chatContent.innerHTML += `
                        <div data-test = "message" class="${tipo}"> 
                        <span class="span_time">(${hora})</span><span class="span_user"> ${nome_from}</span><span> para </span><span class="span_user"> ${nome_to} </span>: ${texto}
                        </div> 
        
                    `
                 
        
                    
                } else {

                    chatContent.innerHTML += `
                    <div data-test = "message" class="${tipo}"> 
                    <span class="span_time">(${hora})</span><span class="span_user"> ${nome_from} </span> reservadamente para <span class="span_user"> ${nome_to} </span>: ${texto}
                    </div> 

                `
                }   

            }  
            
            chatContent.scrollTop = chatContent.scrollHeight;
}



function verifyStatus(){
            const promise= axios.post('https://mock-api.driven.com.br/api/v6/uol/status',user);
            promise.then(statusResponse);
            promise.catch(processErrorStatus);
}

setInterval(() => {
            verifyStatus();          
  
}, 5000);

setInterval(() => {
    
            carregarMensagem();  
   
}, 3000); 


document.addEventListener("keypress", function (e){
            if (e.key === "Enter") {
                btnEnviar();
            }
}, false);


function btnEnviar(){
            sendMessage(document.getElementById("txtArea").value);
            document.getElementById("txtArea").value= "";
}

function sendMessage(msg){
            mensagem.from = user.name;
            mensagem.to = "Todos";
            mensagem.text = msg;
            mensagem.type="message";
            const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);  
            promise.then(processResponseSendMessage);
            promise.catch(processErrorSendMessage);
            carregarMensagem();
}

function processResponseSendMessage(resposta){
    console.log("mensagem enviada com sucesso!");
}
function processErrorSendMessage(erro){
    console.log("Status code: " + erro.response.status); // Ex: 404
    console.log("Erro no envio de mensagens: " + erro.response.data); // Ex: Not Found
}
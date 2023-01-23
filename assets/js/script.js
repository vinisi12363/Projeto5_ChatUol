"use strict";
let mensagem = new Object();
let user = new Object();

let chatContent=document.querySelector('.chatContainer');
let heightPage = chatContent.scrollHeight;

let usuarioAutenticado = 0;

 user.name = prompt("Digite o nome de usuário");

 criarUser();
function criarUser(){
          
    
    const creatingUser= axios.post('https://mock-api.driven.com.br/api/v6/uol/participants' , user);
    creatingUser.then(processResponseCreateUser);
    creatingUser.catch(processErrorCreateUser);
    carregarMensagem();
   
    

}


function carregarMensagem(){

            const  loadMessages = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
            loadMessages.then(createChat);
            loadMessages.catch(processErrorLoadMessages);
            chatContent.scrollIntoView(false);
}



function processResponseCreateUser(resposta){

            verifyStatus();          
             usuarioAutenticado=1;
            console.log("usuario cadastrado!");
            console.log (resposta.status);

}

function createChat(resposta){
           
            
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
                        <span class="span_time">(${hora})</span><span class="span_user"> ${nome_from}</span><span> para </span><span class="span_user"> ${nome_to} </span>: ${texto}
                        </div> 
        
                    `
                    
                } else {

                    chatContent.innerHTML += `
                    <div data-test = "message" id="${tipo+i}"class="${tipo}"> 
                    <span class="span_time">(${hora})</span><span class="span_user"> ${nome_from} </span> reservadamente para <span class="span_user"> ${nome_to} </span>: ${texto}
                    </div> 

                `
                    
                  
                }  
                
                if(resposta.data[i].type === "private_message"){

                        if(nome_from !== user.name || nome_to !== user.name){
                        
                         const divPrivada=document.getElementById(`private_message${i}`);
                                divPrivada.classList.add("hide");
                    
                        }  
                }
            }  
            
            chatContent.scrollIntoView(false);
}


function verifyStatus(){
            const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
            promise.then(statusResponse);
            promise.catch(processErrorStatus);
}


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
            chatContent.scrollIntoView(false);
}


  
setInterval(() => {
    verifyStatus();          
}, 5000);



setInterval(() => {
    carregarMensagem();  
    chatContent.scrollIntoView(false);
}, 3000); 


function processErrorLoadMessages(erro) {
    console.log("Status code: " + erro.response.status); // Ex: 404
    console.log("erro no loadMessages " + erro.response.data); // Ex: Not Found
}
function processErrorAutenticador(erro) {
    console.log("Status code: " + erro.response.status); // Ex: 404
    console.log("erro no autenticador " + erro.response.data); // Ex: Not Found

}
function processErrorCreateUser(erro) {
    console.log("Status code: " + erro.response.status); // Ex: 404
    console.log("nome de USUARIO JA EXISTE " + erro.response.data); // Ex: Not Found
    alert("o nome de usuario ja existe, tente um outro!");
    user.name ="";
    reloadPage();


}

function statusResponse(){
    console.log("usuario "+user.name+" online!");
}
function processErrorStatus(erro){
   
    console.log("Status code: " + erro.response.status); // Ex: 404
    console.log("erro! já existe um usuario online com esse nick " + erro.response.data); // Ex: Not Found
    reloadPage();
}

function processResponseSendMessage(){
    console.log("mensagem enviada com sucesso!");
}

function processErrorSendMessage(erro){
    console.log("Status code: " + erro.response.status); // Ex: 404
    console.log("erro no SendMessage " + erro.response.data); // Ex: Not Found

}


function reloadPage(){
    window.location.reload(true);
}


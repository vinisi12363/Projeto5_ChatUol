const user = new Object();
user.nome = prompt("Digite o seu nome de usuário");
     
console.log(user);

        const promise=axios.post('https://mock-api.driven.com.br/api/v6/uol/participants' , user.nome);
        promise.then (processResponse);
        promise.catch(processError);
        console.log("Enviou a requisição");

function processResponse(resposta){
        console.log("Voltou a resposta");
        console.log (resposta.status);
}

function processError(erro) {
        console.log("Status code: " + erro.response.status); // Ex: 404
        console.log("Mensagem de erro: " + erro.response.data); // Ex: Not Found
}


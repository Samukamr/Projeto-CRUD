

const openModal = () => document.querySelector('#modal')
.classList.add('active');  //ativar o modal

const closeModal = () => {
    clearFields();
    document.querySelector('#modal').classList.remove('active'); // remover modal
};


const tempClient = {
    nome: "Samuel",
    email: "samuel_rochasp@outlook.com",
    celular: "11946679615",
    cidade: "São Paulo"
};

// pegar ou enviar algo pro localStorage
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []; 
// getItem: ler o que tem no local.storage. / Transf em JSON e envia pra client
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient)); // stringify: tranformando em string
  // mandar pro local...  Key ^                                                value ^
 


// CRUD - create read update delete

const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index,1);
    setLocalStorage(dbClient);
};

const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client
    setLocalStorage(dbClient)
}

// Ler o client // READ
const readClient = () => getLocalStorage();


const createClient = (client) => { // setItem - para enviar os dados
    const dbClient = getLocalStorage();
    dbClient.push(client); // push: adciona mais "um client";
    setLocalStorage(dbClient);
}; 

const isValidFields = () => {
    return document.querySelector('#form').reportValidity();
};

// Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
};

const saveClient = () => {
    if(isValidFields()) {
        const client = {
            nome: document.querySelector('#nome').value,
            email: document.querySelector('#email').value,
            celular: document.querySelector('#celular').value,
            cidade: document.querySelector('#cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if(index == 'new') {
            createClient(client);
            updateTable();
            closeModal();
        } else {
           updateClient(index, client);
           updateTable();
           closeModal();
        }
       
    };
};

const creatRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
          <td>${client.nome}</td>
          <td>${client.email}</td>
          <td>${client.celular}</td>
          <td>${client.cidade}</td>
          <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
          </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow);
};

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row));
};


const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(creatRow)
}

const fillFilds = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
};
const editClient = (index) => {
    const client = readClient()[index];
    client.index = index;
    fillFilds(client);
    openModal();
};

const editDelete = (event) => {
    if(event.target.type == 'button') {

        const [action, index] = event.target.id.split('-');

       if (action == 'edit') {
            editClient(index);
       } else {
            const client = readClient()[index];
            const response = confirm (`Deseja realmente excluir o cliente ${client.nome}`);
            if (response)   {
            deleteClient(index);
            updateTable();
            }
       }
    }
};

updateTable();

// Eventos
document.querySelector('#cadastrarCliente')
    .addEventListener('click', openModal);

document.querySelector('#modalClose')
    .addEventListener('click', closeModal);

document.querySelector('#salvar')
    .addEventListener('click', saveClient);

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete);
import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

const back = document.getElementById('back');
const form = document.getElementById('formData');
form.addEventListener("submit", register);
back.addEventListener("click", goHome);

function register(event) {
    event.preventDefault();
    const myFormData = new FormData(event.target);
    const formDataObj = {};
    myFormData.forEach((value, key) => (formDataObj[key] = value));

    axios.post('/register/add', formDataObj).then(function (response) {
        alert('Cadastrado com sucesso!!');
        window.location.href = '/'
    })
    .catch(function (error) {
        alert(error.response.data)
    });
}

function goHome(){
    window.location.href = '/'
}

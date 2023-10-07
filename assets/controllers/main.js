import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

const form = document.getElementById('formData');
const registerBut = document.getElementById('regButtom');
form.addEventListener("submit", signIn);
registerBut.addEventListener("click", register);

function signIn(event) {
    event.preventDefault();
    const myFormData = new FormData(event.target);
    const formDataObj = {};
    myFormData.forEach((value, key) => (formDataObj[key] = value));

    if(formDataObj.email == '' || formDataObj.email == null || formDataObj.password == '' || formDataObj.password == null) {
        alert('Preencha todos os campos')
    } else {
        axios.post('/signin', formDataObj).then(function (response) {
            console.log('response ->' + response);
            sessionStorage.setItem("studentInfo", JSON.stringify(response.data.student));
            window.location.href = '/students'
        })
        .catch(function (error) {
            alert(error.response.data.message)
        });
    }
}

function register() {
    window.location.href = '/register'
}


import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

const allCourses = document.getElementById("allCourses");
const myCourses = document.getElementById("myCourses");
const deleteUser = document.getElementById("deleteUser");
const logout = document.getElementById("logout");
const back = document.getElementById("back");
const info = document.getElementById("info");
const home = document.getElementById("home");
let studentInfo = JSON.parse(sessionStorage.getItem("studentInfo"));

allCourses.addEventListener("click", getCourses);
myCourses.addEventListener("click", getMyCourses);
deleteUser.addEventListener("click", deleteUsers);
logout.addEventListener("click", doLogout);
info.addEventListener("click", getStudentInfo);
home.addEventListener("click", goHome);
back.addEventListener("click", doLogout);

window.onload = function(){
    let message = "Olá! seja bem vindo, " + studentInfo.name;

    document.getElementById('helloMessage').innerHTML = message;
    document.getElementById('name').innerHTML = studentInfo.name;
};

function goHome() {
    let x = document.getElementById("infopage");
    x.style.display = "none";

    let y = document.getElementById("homepage");
    y.style.display = "block";
}

function getStudentInfo(){
    axios.get('/getStudent/' + studentInfo.id).then(function(response) {
        let data = response.data
        let text = `<form id="formData">
        <label for="name">Nome completo</label>
        <input type="text" id="name" name="name" placeholder="Digite seu nome completo" value="`+data.name+`">
        <label for="email">E-mail</label>
        <input type="email" id="email" name="email" placeholder="Digite seu melhor e-mail" value="`+data.email+`" readonly>
        <label for="phone">Celular</label>
        <input type="phone" id="phone" name="phone" placeholder="XX XXXXX-XXXX" value="`+data.phone+`">
        <label for="password">Senha</label>
        <input type="password" id="password" name="password" placeholder="Digite uma senha">
        <label for="confirm">Confirme sua senha</label>
        <input type="password" id="confirm" name="confirm" placeholder="Repita a senha">
        <br><br>
        <div>
            <button id="saveBut" class="saveEdit" type="submit"> Salvar Alterações</button>
        </div>
        </form>`

        let x = document.getElementById("infopage");
        x.innerHTML = text;
        x.style.display = "block";

        let y = document.getElementById("homepage");
        y.style.display = "none";

        const form = document.getElementById("formData");
        form.addEventListener("submit", editInfo);

    })
}

function editInfo(event) {
    event.preventDefault();
    const myFormData = new FormData(event.target);
    const formDataObj = {};
    myFormData.forEach((value, key) => (formDataObj[key] = value));

    if(formDataObj.password == null || formDataObj.password == '' || formDataObj.confirm == null || formDataObj.confirm == '') {
        alert('Preencha os dois campos de senha!');
    }
    else if(formDataObj.password != formDataObj.confirm) {
        alert('As senhas não coincidem!');
    }
    else {
        axios.put('/updateStudent/' + studentInfo.id, formDataObj).then(function (response) {
    
            sessionStorage.setItem("studentInfo", JSON.stringify(response.data[1][0]));
            alert('Informações atualizadas com sucesso!');
            location.reload();
            
        }).catch(function(error) {
            alert(error);
        })
    }
}

function getCourses() {
    axios.get('/students/getCourses').then(function(response) {
        let data = response.data
        let text = `<div class="main-content">`
        for (let x in data) {
            text += `<button class="accordion">` + data[x].name + `</button>
            <div class="panel">
            <p>` + data[x].description + `</p><br>
            <button class="registerCourse"> Cadastrar em curso</button>
            <br><br>
            </div>`
        }
        text += `</div>`
        document.getElementById("demo").innerHTML = text;

        activateElements(data);
    })
    .catch(function(error) {
        alert(error);
    })
    .finally(function() {
    });
}

function getMyCourses() {
    axios.get('/students/getEnrollment/' + studentInfo.id).then(function(response) {
        let data = response.data
        console.log('data ->' + JSON.stringify(data))
        if(data === null || data.length === 0 || data === undefined) {
            let text = `<div class="main-content">
            <div class="info">
            <p>Você ainda não tem nenhum curso cadastrado no sistema</p>
            </div></div>`

            document.getElementById("demo").innerHTML = text;
        } else {
            let text = `<div class="main-content">`
            for (let x in data) {
                text += `<button class="accordion">` + data[x].Course.name + `</button>
                <div class="panel">
                <p>` + data[x].Course.description + `</p><br>
                <button class="deleteCourse"> Desistir do curso</button>
                <br><br>
                </div>`
            }
            text += `</div>`
            document.getElementById("demo").innerHTML = text;

            activateElements(data);
        }
    })
    .catch(function(error) {
        console.log(error);
    })
    .finally(function() {
    });
}

function deleteUsers() {
    axios.delete('/deleteStudents/' + studentInfo.id).then(function (response) {
        alert('Aluno deletado com sucesso!')
        window.location.href = '/'
    })
    .catch(function (error) {
        alert(error.response.data)
    });
}

function doLogout(){
    window.location.href = '/'
}

function activateElements(data) {
    const acc = document.getElementsByClassName("accordion")
    const reg = document.getElementsByClassName("registerCourse")
    const del = document.getElementsByClassName("deleteCourse")

    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");

            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

    for (var i = 0; i < reg.length; i++) {
        let index = i;
    
        reg[i].addEventListener("click", function() {
            console.log(data[index]);
            axios.post('/students/addEnrollment/' + studentInfo.id, data[index]).then(function (response) {
                alert('Curso cadastrado com sucesso!')
            })
            .catch(function (error) {
                console.log(JSON.stringify(error))
                alert(error.response.data)
            });
        });
    }

    for (var i = 0; i < del.length; i++) {
        let index = i;
        del[i].addEventListener("click", function() {
            console.log(data[index]);
            axios.post('/students/removeEnrollment', data[index] ).then(function (response) {
                alert('Curso deletado com sucesso!')
                location.reload();
            })
            .catch(function (error) {
                alert(error.response.data)
            });
        });
    }

}
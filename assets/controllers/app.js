import axios from 'https://cdn.jsdelivr.net/npm/axios@1.3.5/+esm';

class Chatbox{

    constructor() {
        this.args = {
            openButton: document.getElementById('chatbox__button'),
            chatBox: document.getElementById('chatbox__support'),
            sendButton: document.getElementById('send__button'),
        }

        this.state = false;
        this.atendente = false;
        this.messages = [];

        this.socket = io();
        this.ouvirMensagem = this.ouvirMensagem.bind(this);
    }
    
    display() {
        
        const {openButton,chatBox, sendButton} = this.args;

        openButton.addEventListener('click', this.toggleState(chatBox))
        sendButton.addEventListener('click', this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');

        node.addEventListener('keyup', ({key}) => {
            if(key==="Enter") {
                this.onSendButton(chatBox)
            }
        
        })

        this.supportSide(chatBox);
        this.ouvirMensagem(chatBox);
        // this.loadChat(chatBox);
    }

    toggleState(chatBox) {
        console.log('chatBox ->' + chatBox);
        this.state = !this.state;

        console.log('State ->'. state)
        if(this.state) {
            chatBox.classList.add('chatbox--active')
        } else {
            chatBox.classList.remove('chatbox--active')
        }
    }

    onSendButton(chatBox) {
        var textField = chatBox.querySelector('input');
        let text1 = textField.value
        const currentUser = JSON.parse(sessionStorage.getItem("studentInfo"));
        console.log('currentUser ->' + currentUser);
        console.log('currentUser.username ->' + currentUser.username);
        if(currentUser.username == 'atendente') {
            this.atendente = true;
        }

        if(text1 === ''){
            return;
        }

        console.log('this.atentente ->' + this.atendente);
        let msg1 = {name: "User", message: text1}
        this.messages.push(msg1);
        this.updateChatText(chatBox)

        this.sendMessageSocket(text1);

        if(this.atendente == false) {
            axios.post('/predict', {message: text1}).then(r => {
                let result = r.data.result
                // let msg2 = {name: "Escola", message: result};
                // this.messages.push(msg2)
                // this.updateChatText(chatBox)
                textField.value = ''
                console.log('result ->' + result);

                if(result.includes('atendente')) {
                    console.log('Atendente');
                    this.atendente = true;
                }

                this.sendPredictedMessageSocket(result);
                
                
            }).catch((error) => {
                console.error('Error -> ', error);
                console.error('Response status -> ', error.response.status);
                console.error('Response data -> ', error.response.data);
                this.updateChatText(chatBox)
                textField.value = ''
            });
        }
    }

    loadChat(chatBox) {
        console.log('loadChat');
        let user = JSON.parse(sessionStorage.getItem("studentInfo"));
        let friendId = sessionStorage.getItem("friendInfo");
        console.log(user.id + ' - ' + friendId);
        axios.get(`/chat?user_consumer=${user.id}&user_receiver=${friendId}`,).then(r => {
            console.log(r);

            r.data.rows.forEach(row => {
                if(row.user_consumer === user.id) {
                    let msg = {name: "User", message: row.message}
                    this.messages.push(msg);
                } else {
                    let msg = {name: "Escola", message: row.message}
                    this.messages.push(msg);
                }
            });
            this.updateChatText(chatBox)

        }).catch((error) => {
            console.log('errin')
            console.error('Error -> ', error);
        });
    }

    updateChatText(chatBox) {
        var html = '';

        this.messages.slice().reverse().forEach(function(item, number) {
            if(item.name === "Escola") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
        });

        const chatmessage = chatBox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }

    supportSide(chatBox){
        let studentInfo = JSON.parse(sessionStorage.getItem("studentInfo"));
        if(studentInfo.username == 'atendente') {
            let options = '';
            console.log('studentInfo.id ->' + studentInfo.id)
            axios.get('/friends/' + studentInfo.id).then(function(response) {
                let data = response.data
                let ids = []
                console.log('data ->' + JSON.stringify(data))
                for(let x in data) {
                    ids.push(data[x].friendId)
                }
    
                axios.get('/getStudents').then(function(response) {
                    let data = response.data
                    console.log('data ->' + JSON.stringify(data))
                    for(let x in data) {
                        if(!ids.includes(data[x].id)) {
                            options += `<a id="` + data[x].id + `" href="#">` + data[x].name + `</a>\n`
                        }
                    }
    
                    let text = `<div class="dropdown">
                    <button class="dropbtn">Selecione o aluno</button>
                    <div id="myDropdown" class="dropdown-content">` + options + `
                    </div>
                    </div>`
    
                    document.getElementById('header').innerHTML = text;
    
                    let links = document.querySelectorAll('#myDropdown a');
    
                    // Adiciona um evento de clique a cada link
                    links.forEach(function(link) {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                
                            chatbox.messages = [];
                            let studentId = event.target.id;
                            console.log('ID do aluno selecionado: ' + studentId);
                            sessionStorage.setItem("friendInfo", studentId);
            
                            chatbox.loadChat(chatBox);
                        });
                    });
    
                }
                ).catch(function(error) {
                    alert(error);
                });
    
    
            }).catch(function(error) {
                alert(error);
            })  
        } else {
            sessionStorage.setItem("friendInfo", 4);
            chatbox.loadChat(chatBox);
        }
    }

    ouvirMensagem(chatBox) {
        const socket = io();

        socket.on('RECEIVE_MESSAGE', (data) => {
            console.log(data)
            console.log('data.user_sender ->' + data.user_sender)
            console.log('sessionStorage.getItem("friendInfo") ->' + sessionStorage.getItem("friendInfo"))
            const currentUser = JSON.parse(sessionStorage.getItem("studentInfo"));
            if(Number(data.user_sender) === Number(sessionStorage.getItem("friendInfo")) || (Number(data.user_sender) === Number(currentUser.id) && data.prediction == true)) {
                console.log('entrou no if')
                let msg = { name: "Escola", message: data.message };
                this.messages.push(msg);
                this.updateChatText(chatBox);
            }
        });
    }

    sendMessageSocket = (message) => {
        console.log('sendMessageSocket');
        const socket = io('http://localhost:3333');
        let user = JSON.parse(sessionStorage.getItem("studentInfo"));
        let friendId = sessionStorage.getItem("friendInfo");
        console.log(user.id + ' - ' + friendId);
        socket.emit('SEND_MESSAGE', {
            user_sender: user.id,
            user_receptor: friendId,
            message: message
        });

    }

    sendPredictedMessageSocket = (message) => {
        const socket = io('http://localhost:3333');
        let user = JSON.parse(sessionStorage.getItem("studentInfo"));
        let friendId = sessionStorage.getItem("friendInfo");
        socket.emit('SEND_MESSAGE', {
            user_sender: friendId,
            user_receptor: user.id,
            message: message,
            prediction: true
        });
    }
}

const chatbox = new Chatbox();
chatbox.display();


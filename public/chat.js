var socket = io.connect('http://localhost:3000/')

var message = document.getElementById('message');
var handle =  document.getElementById('handle');
var btn = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');
var roomId = document.getElementById('roomId');

btn.addEventListener('click',() => {
    socket.emit('chat',{
        message:message.value,
        handle: handle.innerText,
        roomId: roomId.innerHTML
    })
})

message.addEventListener('keypress', () =>{
    socket.emit('typing'+handle.innerText)
})

socket.on('chat',(data) =>{ 
    output.innerHTML += '<p><strong>'+data.handle + ': </strong>'+ data.message +'</p>';
})

socket.on('typing', (data) =>{
    feedback.innerHTML = '<p><em>'+ data +'is typing.. </em></p>';
})

function fetchChat(id) {
    console.log(id);
    fetch("/chats/${id}")
        .then(data => {
            console.log(data);
            return data.json();
        })
        .then(json => {
            output.innerHTML = "";
            console.log(json);
            json.forEach(data => {
                console.log('call every time');
                console.log(data);

                output.innerHTML += '<p><strong>'+data.sender + ': </strong>'+ data.message +'</p>';

            });
        });
}
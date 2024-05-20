const loginCode = localStorage.getItem("login_code");
var socket = io();
if (loginCode) {
    socket.on('connect', () => {
        socket.on('client_count', (connectedCount) => {
            addStickyDiv(connectedCount);
        });
        socket.on('add_new_question', (data) => {
            showMessage(data.notice);
        })
        socket.emit('send_login_code', loginCode);
        socket.on('result_check_login', (data) => {
            if (data.success === false) {
                window.location.href = "/login";
            } else {
                console.log('Login successful!');
                load(data.data)
            }
        });
    });
}
else {
    window.location.href = "/login";
}

function load(data) {
    let hiUserTitle = document.getElementById('hi_user');
    hiUserTitle.textContent = 'Hi, ' + data.fullName;
}

function addStickyDiv(connectedCount) {
    var div = document.createElement('div');
    div.className = 'sticky-div';
    div.textContent = 'Traffic: ' + connectedCount;
    document.body.appendChild(div);
}

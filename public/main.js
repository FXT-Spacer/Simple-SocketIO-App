
document.getElementById("logout").addEventListener("click", function(event) {
    event.preventDefault(); 
    const data = JSON.stringify({
        login_code: localStorage.getItem("login_code")
    });

    fetch("/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
    .then(response => response.json())  
    .then(data => {
        console.log(data);
        if (data.success) {
            localStorage.removeItem("login_code");
            setTimeout(function() {
                window.location.href = "/login";
            }, 1000); 
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        alert(error);
    });
});


let buttonRegister1 = document.getElementById("register_1");

buttonRegister1.addEventListener("click", function(event) {
    let panel_2 = document.getElementById('panel_2');
    panel_2.style.display = "flex";
    let panel_1 = document.getElementById('panel_1');
    panel_1.style.display = "none";
});

let buttonLogin1 = document.getElementById("login_1");

buttonLogin1.addEventListener("click", function(event) {
    let panel_3 = document.getElementById('panel_3');
    panel_3.style.display = "flex";
    let panel_1 = document.getElementById('panel_1');
    panel_1.style.display = "none";
});

function showMessage(message) {
    var messageDiv = document.createElement('div');

    messageDiv.textContent = message;

    messageDiv.style.position = 'fixed'; 
    messageDiv.style.bottom = '15px';    
    messageDiv.style.right = '15px';    
    messageDiv.style.backgroundColor = 'black'; 
    messageDiv.style.color = 'white';   
    messageDiv.style.padding = '10px';  
    messageDiv.style.borderRadius = '5px'; 
    messageDiv.style.zIndex = '1000';   

    document.body.appendChild(messageDiv);

    setTimeout(function() {
        document.body.removeChild(messageDiv);
    }, 5000);
}


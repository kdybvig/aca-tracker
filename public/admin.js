const fetchUsers = () => {
    fetch('http://localhost:3333/clients', {
    headers : {
        "Content-Type" : "application/json"
    },
    method: "GET"})
    .then(response => response.json())
    .then(json => {
        const root = document.getElementById('root');
        root.innerHTML = '';
        json.forEach(user => {
            const userInfo = document.createElement("div");
            const userText = document.createTextNode(user.name + ' : ' + user.location["postcode"]);         // Create a text node
            userInfo.appendChild(userText);
            root.appendChild(userInfo);    
        })
        setTimeout(fetchUsers, 2000)
    })
};

fetchUsers();
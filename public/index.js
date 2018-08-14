const postLatLong = (id) => {
    navigator.geolocation.getCurrentPosition(pos => {
        const latLong = pos.coords;
        console.log(pos)
        const lat = latLong.latitude;
        const long = latLong.longitude;
        console.log(lat,long)
        fetch('/locations', {
        method: "POST", 
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({id: id, lat: lat, long: long})
        })
        .then(response => response.json())
        .then(json => {
            console.log(json);
            setTimeout(() => {
                console.log('myId', id)
                postLatLong(id)
            }, 2000)
        })
    })
}

const trackMe = () => {
    const name = document.getElementById("name").value;
    console.log(name)
    console.log(`I'm watching you ${name}`)
    fetch('/clients', {
        method: "POST", 
        headers : {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({name: name})
        })
        .then(response => response.json())
        .then(json => {
            const id = json.clientId;
            postLatLong(id);
        })
}
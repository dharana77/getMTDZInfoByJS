let data = "";
    
function get_image_link(url){
    fetch(url)
    .then(res => res.json())
    .then((out) => {
        data = out["image"];
        console.log('Data: ', data);
    }).catch(err => console.error(err));
    console.log(data);
    return data;
}
  

console.log(get_image_link("https://data.metatoydragonz.io/meta/1131.json"));


fetch('https://data.metatoydragonz.io/meta/1131.json')
.then((response) => response.json())
.then((data) => console.log(data["image"]));

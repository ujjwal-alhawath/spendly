const key = 'AIzaSyAQIVhs0tB4HHwInUt8ggaOUwxZaVnIJwc';
const LIST_URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
const fs = require('fs');

async function test() {
  const response = await fetch(LIST_URL, {
    method: "GET",
  });
  const data = await response.json();
  const models = data.models || [];
  fs.writeFileSync('models.json', JSON.stringify(models.map(m => m.name), null, 2));
  console.log("Written to models.json");
}
test();

const url = "http://localhost:3005/data";


function fetchData(options = {method: 'GET'}, id = '') {
  const path = url + id;
  const promise = fetch(path, options);
  return promise
  .then(resp => {
    if(resp.ok) {
       return resp.json();
    }
    return Promise.reject(resp)
  }).then(resp => {
    return resp;
  })
  .catch(err => console.log(err))
}


export function load() {
  return fetchData();
}
export function create(data) {
const options = {
   method: 'POST',
   body: JSON.stringify( data ),
   headers: { 'Content-Type': 'application/json'},
}
return fetchData(options)
}
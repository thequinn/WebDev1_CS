/*
1) Go to JSONPlaceholder -  a Fake Online REST API for Testing and Prototyping
2) Put https://jsonplaceholder.typicode.com/users into request() to get all users' data
3) Put https://jsonplaceholder.typicode.com/users/1 into request() to get only 1 user's data
*/


// Method-1: Not using Promises
/*
const request = require('request');

request('https://jsonplaceholder.typicode.com/users/1', (err, res, body) => {
  if (!err && res.statusCode == 200) {
    const data= JSON.parse(body);
    
    //console.log('body:', parsedBody);  
    console.log(`${data.name} lives in ${data.address.zipcode}`);
  }
});
*/


// Method-2: Using Promises 
const rp = require('request-promise');

rp('https://jsonplaceholder.typicode.com/users/1')
  .then((body) => {
    const parsedData = JSON.parse(body);
    console.log(`${parsedData.name} lives in zipcode ${parsedData.address.zipcode}`);
  })
  .catch((err) => {
    console.log("Error!", err);
  });



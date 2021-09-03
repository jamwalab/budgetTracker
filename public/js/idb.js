//variable to hold index db connection
let db;
//Establish connection to index db database
const request = indexedDB.open('track_budget', 1);

//On database change / version upgrade
request.onupgradeneeded = function(event) {
  //reference the database
  const db = event.target.result;
  //create an object store table with autoincrementing key for version upgrade / new database
  db.createObjectStore('budget_data', {autoIncrement: true});
};

//on successful connection
request.onsuccess = function(event) {
  //reference the database
  db = event.target.result;
  //check if app is online
  if (navigator.onLine) {
    uploadBudget();
  };
};

request.onerror = function(event) {
  //log error here
  console.log(event.target.errorCode);
};

//function to save record if there is no internet connection
function saveData(data) {

};

//function to upload data to the database
function uploadBudget(event) {
  //open a transaction
  const transaction = db.transaction(['budget_data'], 'readwrite');

  //access the object store
  
}
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
  // open a new transaction with the database with read and write permissions 
  const transaction =  db.transaction(['budget_data'], 'readwrite');

  //access the object store
  const transactionObjectStore = transaction.objectStore('budget_data');

  //add record to the table
  transactionObjectStore.add(data)
};

//function to upload data to the database
function uploadBudget(event) {
  //open a transaction
  const transaction = db.transaction(['budget_data'], 'readwrite');

  //access the object store
  const transactionObjectStore = transaction.objectStore('budget_data');

  //get all records from the table
  const getAll = transactionObjectStore.getAll();

  getAll.onsuccess = function() {
    //check if there is data in the getAll variable
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => {    
        return response.json();
      })
      .then(serverResponse => {
        //Check for error, and stop if any
        if (serverResponse.message) {
          throw new Error(serverResponse);
        }
        //open another transaction
        const transaction = db.transaction(['budget_data'], 'readwrite');
        //access the objectstore again
        const transactionObjectStore = transaction.objectStore('budget_data');
        //clear the table
        transactionObjectStore.clear();

        console.log('All transaction data has been successfully recorded');
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
}
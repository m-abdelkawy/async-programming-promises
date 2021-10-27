import setText, { appendText } from "./results.mjs";

/*
  There are 3 ways to queue up a list of promises
  all: will wait untill either all promises are fulfilled of the first one rejects
  allsettled: waits until all promises are settled, either fulfilled or rejected
  race: will only wait until the fastest promise is settled
 */

export function timeout() {
    //the Promise takes executor function as the only parameter to its constructor
    //promises are eager (not lazy), they started execution immediately
    //resolve: a function that is passed as a parameter to the executor that use to resolve state

    //then: is used to access the eventual result of a promise (non blocking)
    //to handle the "fulfilled" status

    //catch: to handle the error

    //we now have a promise that will call resolve that will set the state to "fulfilled"
    //and then calls our "then" function
    //to run: npm run dev => in the terminal
    const wait = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Timeout!");
        }, 1500);
    });

    wait.then(text => setText(text));
}

export function interval() {
    /*once a promise has been settled, its state is not updated
    That's because of the associated promise has already been resolved, either to a value, a rejection or another promise
    the resolve method does nothing

    attempting to settle again has no effect
    the function itself (inside the setInterval) continues to run, but the promise will not change*/
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => {
            console.log(`Interval! Time: ${counter++}`);
            resolve(`Interval! Time: ${counter}`);
        }, 1500);
    });

    wait.then(text => setText(text))
        .finally(() => appendText(` --Done ${counter} `));
}

export function clearIntervalChain() {
    //an example of using the finally block to clean up after a promise
    let counter = 0;
    let inteval;
    const wait = new Promise((resolve) => {
        interval = setInterval(() => {
            console.log(`Interval! Time: ${counter++}`);
            resolve(`Interval! Time: ${counter}`);
        }, 1500);
    });

    wait.then(text => setText(text))
        .finally(() => {
            appendText(` --Done ${counter} `);
            clearInterval(interval);
            console.log(interval)
        });
}

export function xhr() {
    let request = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/7");
        //the success function
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText)
            }
        }
        //the fail method - only called when there is a network error
        //all other calls goes to the onload method
        xhr.onerror = () => reject("Request Failed!");
        xhr.send();
    });

    request.then(result => setText(result))
        .catch(err => setText(err));
}

export function allPromises() {
    //01. axiom is built on promises, so each of the vars below is a promise

    //02. the all function will wait until either all promises are fulfilled or the first promise rejects
    //this can be useful in situations when you don't want to continue if any of your promises is rejected
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");

    Promise.all([categories, statuses, userTypes, addressTypes])
        .then(([cat, stat, type, address]) => {
            //the order will match the order we added them, not the order in which they were resolved
            setText("");

            appendText(JSON.stringify(cat.data));
            appendText(JSON.stringify(stat.data));
            appendText(JSON.stringify(type.data));

            //this one fails
            //the reject message appears before the last call to the api returns (see comment 02)
            appendText(JSON.stringify(address.data));
        })
        .catch(err => setText(err));
}

export function allSettled() {
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");

    Promise.allSettled([categories, statuses, userTypes, addressTypes])
        .then((values) => {
            //the order will match the order we added them, not the order in which they were resolved
            let result = values.map(v => {
                if (v.status === 'fulfilled') {
                    return `Fulfilled ${JSON.stringify(v.value.data[0])}   `;
                }
                return `Rejected ${v.reason.message}   `
            });

            setText(result);
        })
        .catch(reasons => setText(reasons));
}

export function race() {
    //from cmd: npm run secondary, to create another running instance of the API on another port "3001"
    //race stops when the first promise settles
    //if it settles with rejection, the catch block will run and we wom't get the data
    let users = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3001/users");

    Promise.race([users, backup])
        .then(users => setText(JSON.stringify(users.data)))
        .catch(reason => setText(reason));
}
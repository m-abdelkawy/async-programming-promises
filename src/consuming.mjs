import setText, { appendText, showWaiting, hideWaiting } from "./results.mjs";

export function get() {
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            setText(JSON.stringify(data))
        });
}

export function getCatch() {
    //then: if fulfilled
    //catch: if rejected
    axios.get("http://localhost:3000/orders/123")
        .then(result => {
            setText(JSON.stringify(result.data));
        })
        .catch(err => setText(err))
}

export function chain() {
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        })
        .then(({ data }) => setText(`City: ${data.city}`));
}

export function chainCatch() {
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        })
        .then(({ data }) => setText(`City: ${data.city}`))
        .catch(err => setText(err));

    //#region multiple catch
    /*axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
             axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);

             throw new Error("Error1!");
        })
        .catch(err=>{
            setText(err);
            throw new Error("Error2!");
            return {data: {}};
        })
        .then(({ data }) => setText(`City: ${data.my.city}`))
        .catch(err => setText(err));*/
    //#endregion
}

export function final() {
    showWaiting();
    axios.get("http://localhost:3000/orders/1")
        .then(({ data }) => {
            return axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);
        })
        .then(({ data }) => setText(`City: ${data.city}`))
        .catch(err => setText(err))
        .finally(()=>{
            setTimeout(() => {
                hideWaiting();
            }, 1500);
            appendText(" \n-- Completely Done")
        });
}
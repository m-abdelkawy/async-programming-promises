import setText, { appendText } from './results.mjs';

/*
  async: used to designate the function as asynchronous
         the method returns an implicit promise
         so whatever you return will be wrapped inside of a promise
         so if it returns an error, it will be wrapped in a rejected promise
  await: pauses the execution of an asynchronous function while it waits for the promise to be fulfilled
         can only be used inside an async function
         only blocks the current function
         It does not block the calling functions
*/

export async function get() {
    //axios.get returns a promise, we can use await on it
    const { data } = await axios.get("http://localhost:3000/orders/1");
    setText(JSON.stringify(data));
}

export async function getCatch() {
    try {
        const { data } = await axios.get("http://localhost:3000/orders/123");
        setText(JSON.stringify(data));
    } catch (error) {
        setText(error);
    }
}

export async function chain() {
    const { data } = await axios.get("http://localhost:3000/orders/1");
    const { data: address } = await axios.get(`http://localhost:3000/addresses/${data.shippingAddress}`);

    setText(`City: ${JSON.stringify(address.city)}`);
}

export async function concurrent() {
    const orderStatus = axios.get("http://localhost:3000/orderStatuses");
    const orders = axios.get("http://localhost:3000/orders");

    setText("");

    const { data: statuses } = await orderStatus;
    const { data: order } = await orders;
    console.log(statuses)

    appendText(JSON.stringify(statuses));
    appendText(JSON.stringify(order[0]))
}

export function parallel() {
    setText("");
    await Promise.all([
        (async () => {
            const { data } = await axios.get("http://localhost:3000/orderStatuses");
            appendText(JSON.stringify(data));
        })(),
        (async () => {
            const { data } = await axios.get("http://localhost:3000/orders");
            appendText(JSON.stringify(data[0]));
        })()]);
}
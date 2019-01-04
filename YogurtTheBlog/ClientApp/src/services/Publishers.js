import {authHeader} from "../helpers/auth";

const apiEndpoint = 'api/publishers/';

export const getPublishers = () => {
    return fetch(apiEndpoint, {
        headers: authHeader()
    }).then(async response => await response.json());
};

export const addPublisher = publisher => {
    return fetch(apiEndpoint, {
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        method: 'POST',
        body: JSON.stringify(publisher)
    }).then(async response => await response.json());
};

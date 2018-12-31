import {authHeader} from "../helpers/auth";

const apiEndpoint = 'api/posts/';

export const getPost = (postUrl) => {
    return fetch(`${apiEndpoint}${postUrl}`)
        .then(async response => await response.json());
};

export const getPagedPosts = (page, pageSize) => {
    return fetch(`${apiEndpoint}?page=${page}&pageSize=${pageSize || 15}`)
        .then(async response => await response.json())
};

export const newPost = post => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(post)
    };
    
    return fetch(apiEndpoint, requestOptions).then(async response => await response.json());
};

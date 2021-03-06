import {authHeader} from "../helpers/auth";

const apiEndpoint = 'api/posts/';

export const getPost = (postUrl) => {
    return fetch(`${apiEndpoint}${postUrl}`)
        .then(async response => await response.json());
};

export const getPagedPosts = (page, pageSize, tag) => {
    let url = `${apiEndpoint}?page=${page}&pageSize=${pageSize || 15}`;
    
    if (tag) {
        url += `&tag=${tag}`;
    }
    
    return fetch(url)
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

export const deletePost = postUrl => {
    return fetch(`${apiEndpoint}${postUrl}`, {
        method: 'DELETE',
        headers: authHeader()
    });
};

export const editPost = post => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(post)
    };

    return fetch(apiEndpoint, requestOptions).then(async response => await response.json());
};

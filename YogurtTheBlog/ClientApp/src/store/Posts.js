const requestPostsType = 'REQUEST_POSTS';
const receivePostsType = 'RECEIVE_POSTS';
const errorPostsType = 'ERROR_POSTS';
const requestSinglePostType = 'REQUEST_SINGLE_POST';
const receiveSinglePostType = 'RECEIVE_SINGLE_POST';
const errorReceivingPostType = 'ERROR_SINGLE_POST'; 

const initialState = {
    posts: [],
    page: 1,
    pagesCount: 1,
    isLoading: false,
    pageSize: 15,
    currentPost: null
};

export const actionCreators = {
    requestPosts: page => async (dispatch, getState) => {
        if (getState().isLoading) {
            return;
        }

        dispatch({type: requestPostsType, page});

        const url = `api/posts/?page=${page}&pageSize=${getState().pageSize}`;
        fetch(url)
            .then(async response => {
                const {pageNumber, pageSize, pagesCount, elements} = await response.json();
                dispatch({
                    type: receivePostsType,
                    posts: elements,
                    page: pageNumber,
                    pagesCount,
                    pageSize
                });
            })
            .catch(error => dispatch({
                type: errorPostsType,
                error: error
            }));
    },
    requestSinglePost: postUrl => async (dispatch, getState) => {
        if (getState().isLoading) {
            return;
        }
        
        dispatch({type: requestSinglePostType, postUrl});
        const url = `api/posts/${postUrl}`;
        fetch(url)
            .then(async response => {
                const post = await response.json();
                
                dispatch({
                    type: receiveSinglePostType, post
                })
            })
            .catch(async error => {
                dispatch({
                    type: errorReceivingPostType
                })
            })
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === requestPostsType) {
        return {
            ...state,
            page: action.page,
            isLoading: true
        };
    }

    if (action.type === receivePostsType) {
        return {
            ...state,
            posts: action.posts,
            page: action.page,
            isLoading: false
        };
    }

    if (action.type === errorPostsType || action.type === errorReceivingPostType) {
        // TODO: Handle error
        return {
            ...state,
            isLoading: false
        };
    }
    
    if (action.type === requestSinglePostType) {
        return {
            ...state,
            isLoading: true,
            currentPost: null
        };
    }
    
    if (action.type === receiveSinglePostType) {
        return {
            ...state,
            isLoading: false,
            currentPost: action.post
        }
    }

    return state;
};

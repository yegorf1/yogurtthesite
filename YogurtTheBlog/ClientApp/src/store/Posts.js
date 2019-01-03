import * as Posts from "../services/Posts";
import history from '../helpers/history';

const requestPostsType = 'REQUEST_POSTS';
const receivePostsType = 'RECEIVE_POSTS';
const errorPostsType = 'ERROR_POSTS';

const requestSinglePostType = 'REQUEST_SINGLE_POST';
const receiveSinglePostType = 'RECEIVE_SINGLE_POST';
const errorReceivingPostType = 'ERROR_SINGLE_POST';

const createNewPostType = 'CREATE_POST';
const postCreatedType   = 'POST_CREATED';
const postCreateFail    = 'FAIL_CREATE_POST';

const editPostType = 'EDIT_POST';
const postEditedType   = 'POST_EDITED';
const postEditFail    = 'FAIL_EDIT_POST';

const deletePostType = 'DELETE_POST';
const postDeleted    = 'POST_DELETED';
const postDeleteFail = 'ERROR_DELETE_POST';

const initialState = {
    posts: [],
    page: 1,
    pagesCount: 1,
    isLoading: false,
    pageSize: 15,
    currentPost: null
};

export const actionCreators = {
    requestPosts: (page, tag) => (dispatch, getState) => {
        if (getState().isLoading) {
            return;
        }

        dispatch({type: requestPostsType, page});

        Posts
            .getPagedPosts(page, getState().pageSize, tag)
            .then(response => {
                const {pageNumber, pageSize, pagesCount, elements} = response;
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
    requestSinglePost: postUrl => (dispatch, getState) => {
        if (getState().isLoading) {
            return;
        }
        
        dispatch({type: requestSinglePostType, postUrl});
        return Posts.getPost(postUrl)
            .then(post => {
                dispatch({
                    type: receiveSinglePostType, post
                });
                
                return post;
            })
            .catch(error => {
                dispatch({
                    type: errorReceivingPostType
                })
            })
    },
    createPost: post => (dispatch, getState) => {
        if (getState().isLoading) {
            return;
        }
        
        dispatch({type: createNewPostType});
        
        Posts
            .newPost(post)
            .then(resp => {
                dispatch({
                    type: postCreatedType
                });
                history.push('/p/' + post.constantUrl);
            })
            .catch(
                error => {
                    dispatch({
                        type: postCreateFail,
                        error: error
                    });
                    alert(error);
                }
            )
    },
    editPost: post => (dispatch, getState) => {
        if (getState().isLoading) {
            return;
        }
        
        dispatch({type: editPostType});
        
        Posts
            .editPost(post)
            .then(post => {
                dispatch({
                    type: postEditedType
                });
                history.push('/p/' + post.constantUrl);
                
                return post;
            })
            .catch(
                error => {
                    dispatch({
                        type: postEditFail,
                        error: error
                    });
                    alert(error);
                }
            )
    },
    deletePost: postUrl => (dispatch, getState) => {
        if (getState().isLoading) {
            return;
        }

        dispatch({type: deletePostType});

        Posts
            .deletePost(postUrl)
            .then(resp => {
                dispatch({
                    type: postCreatedType
                });
                history.push('/');
            })
            .catch(
                error => {
                    dispatch({
                        type: postCreateFail,
                        error: error
                    });
                    alert(error);
                }
            )
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
        alert(action.error);
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
    
    if ([createNewPostType, deletePostType, editPostType].includes(action.type)) {
        return {
            ...state,
            isLoading: true
        };
    }
    
    if ([postCreateFail, postCreatedType, postDeleted, postDeleteFail, postEditFail, postEditedType].includes(action.type)) {
        return {
            ...state,
            isLoading: false
        };
    }

    return state;
};

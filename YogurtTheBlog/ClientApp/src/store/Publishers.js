import * as Publishers from '../services/Publishers';

const GET_PUBLISHERS_REQUEST = 'GET_PUBLISHERS_REQUEST';
const GET_PUBLISHERS_SUCCESS = 'GET_PUBLISHERS_SUCCESS';
const GET_PUBLISHERS_FAILURE = 'GET_PUBLISHERS_FAILURE';

const ADD_PUBLISHER_REQUEST = 'ADD_PUBLISHER_REQUEST';
const ADD_PUBLISHER_SUCCESS = 'ADD_PUBLISHER_SUCCESS';
const ADD_PUBLISHER_FAILURE = 'ADD_PUBLISHER_FAILURE';

const initialState = {
    publishers: [],
    isLoading: false
};

export const actionCreators = {
    getPublishers: () => (dispatch, getState) => {
        if (getState().isLoading) {
            return;
        }

        dispatch({type: GET_PUBLISHERS_REQUEST});

        Publishers
            .getPublishers()
            .then(
                publishers => {
                    dispatch({
                        type: GET_PUBLISHERS_SUCCESS,
                        publishers
                    });
                },
                error => dispatch({
                    type: GET_PUBLISHERS_FAILURE,
                    error
                })
            );
    },
    addPublisher: (publisher) => (dispatch, getState) => {
        if (getState().isLoading) {
            return;
        }

        dispatch({type: ADD_PUBLISHER_REQUEST});

        return Publishers
            .addPublisher(publisher)
            .then(
                publishers => {
                    dispatch({
                        type: ADD_PUBLISHER_SUCCESS,
                        publishers
                    });
                },
                error => dispatch({
                    type: ADD_PUBLISHER_FAILURE,
                    error
                })
            );
    },
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === ADD_PUBLISHER_REQUEST) {
        return {
            ...state,
            isLoading: true,
        };
    }

    if (action.type === ADD_PUBLISHER_SUCCESS) {
        return {
            ...state,
            isLoading: false,
        };
    }

    if (action.type === ADD_PUBLISHER_FAILURE) {
        return {
            ...state,
            isLoading: false
        };
    }

    if (action.type === GET_PUBLISHERS_REQUEST) {
        return {
            ...state,
            isLoading: true,
            publishers: []
        };
    }

    if (action.type === GET_PUBLISHERS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            publishers: action.publishers
        };
    }

    if (action.type === GET_PUBLISHERS_FAILURE) {
        return {
            ...state,
            isLoading: false
        };
    }

    return state;
};

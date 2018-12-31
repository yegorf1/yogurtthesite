import * as Auth from '../services/Auth';
import history from '../helpers/history';

const REGISTER_REQUEST = 'AUTH_REGISTER_REQUEST';
const REGISTER_SUCCESS = 'AUTH_REGISTER_SUCCESS';
const REGISTER_FAILURE = 'AUTH_REGISTER_FAILURE';

const LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
const LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
const LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';


const LOGOUT = 'AUTH_LOGOUT';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user
    ? {
        isLogging: false,
        loggedIn: true,
        user
    }
    : {
        isLogging: false,
        loggedIn: false,
        user: null
    };

export const actionCreators = {
    login: (username, password) => async (dispatch, getState) => {
        function request(user) {
            return {type: LOGIN_REQUEST, user}
        }

        function success(user) {
            return {type: LOGIN_SUCCESS, user}
        }

        function failure(error) {
            return {type: LOGIN_FAILURE, error}
        }

        dispatch(request({username}));

        Auth
            .login(username, password)
            .then(
                user => {
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    // dispatch error
                }
            );
    },
    register: user => async (dispatch, getState) => {
        function request(user) { return { type: REGISTER_REQUEST, user } }
        function success(user) { return { type: REGISTER_SUCCESS, user } }
        function failure(error) { return { type: REGISTER_FAILURE, error } } 
        
        dispatch(request(user));
        
        Auth
            .register(user)
            .then(
                user => {
                    dispatch(success(user));
                    
                    history.push('/login');
                },
                error => {
                    dispatch(failure(error.toString()));
                }
            )
    },
    logout: () => async (dispatch, getState) => {
        Auth.logout();
        dispatch({
            type: LOGOUT
        });
    }
};

export const reducer = (state, action) => {
    state = state || initialState;

    if (action.type === LOGIN_REQUEST) {
        return {
            ...state,
            isLogging: true,
            loggedIn: false,
            user: action.user
        };
    }

    if (action.type === LOGIN_SUCCESS) {
        return {
            ...state,
            isLogging: false,
            loggedIn: true,
            user: action.user
        };
    }

    if (action.type === LOGIN_FAILURE || action.type === LOGOUT) {
        if (action.type === LOGIN_FAILURE) {
            alert(action.error);
        }
        return {
            isLogging: false,
            loggedIn: false,
            user: null
        };
    }
    
    // add registration handlers
    if (action.type === REGISTER_FAILURE) {
        alert(action.error);
    }
    
    return state;
};

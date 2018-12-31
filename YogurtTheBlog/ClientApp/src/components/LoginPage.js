import * as React from "react";
import {bindActionCreators} from "redux";
import {actionCreators} from "../store/Auth";
import {connect} from "react-redux";
import Link from "react-router-dom/es/Link";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.props.logout();

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {username, password} = this.state;
        if (username && password) {
            this.props.login(username, password);
        }
    }

    render() {
        const {username, password, submitted} = this.state;
        return (
            <div className="centered-content box small-form">
                <h2>Вход</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Логин</label>
                        <input type="text" className="form-control" name="username" value={username}
                               onChange={this.handleChange}/>
                        {
                            submitted && !username &&
                            <div className="help-block">Нужен логин</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Пароль</label>
                        <input type="password" className="form-control" name="password" value={password}
                               onChange={this.handleChange}/>
                        {
                            submitted && !password &&
                            <div className="help-block">Нужен пароль</div>
                        }
                    </div>
                    <div className="form-group">
                        <button>Вход</button>
                        <Link to="/register" className="float-right">Регистрация</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(
    state => state.auth,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(LoginPage);

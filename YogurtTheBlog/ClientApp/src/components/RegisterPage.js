import * as React from "react";
import {bindActionCreators} from "redux";
import {actionCreators} from "../store/Auth";
import {connect} from "react-redux";
import Link from "react-router-dom/es/Link";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: '',
                password: ''
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const {name, value} = event.target;
        const {user} = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({submitted: true});
        const {user} = this.state;
        if (user.username && user.password) {
            this.props.register(user);
        }
    }

    render() {
        const {user, submitted} = this.state;
        return (
            <div className="centered-content small-form">
                <h2>Регистрация</h2>
                <p>Ты уверен, что ты на той страничке?</p>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !user.username ? ' has-error' : '')}>
                        <label htmlFor="username">Логин</label>
                        <input type="text" className="form-control" name="username" value={user.username}
                               onChange={this.handleChange}/>
                        {
                            submitted && !user.username &&
                            <div className="help-block">Нужен логин</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !user.password ? ' has-error' : '')}>
                        <label htmlFor="password">Пароль</label>
                        <input type="password" className="form-control" name="password" value={user.password}
                               onChange={this.handleChange}/>
                        {
                            submitted && !user.password &&
                            <div className="help-block">Нужен пароль</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="primary">Регистрация</button>
                        <Link to="/login" className="float-right">Вход</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default connect(
    state => state.auth,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(RegisterPage);
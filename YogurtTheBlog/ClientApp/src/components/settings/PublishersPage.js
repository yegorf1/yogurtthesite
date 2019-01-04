import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../../store/Publishers";
import PublisherComponent from "./PublisherComponent";

class PublishersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            publisher: {
                name: '',
                publisherType: 'telegram',
                token: '',
                targetId: '',
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.getPublishers();
    }

    handleSubmit(e) {
        e.preventDefault();

        const {publisher} = this.state;

        if (publisher.name && publisher.token && publisher.targetId) {
            this.props.addPublisher(publisher)
                .then(setTimeout(this.props.getPublishers, 0.1));
        }
    }


    handleChange(event) {
        const {name, value} = event.target;
        const {publisher} = this.state;

        this.setState({
            publisher: {
                ...publisher,
                [name]: value
            }
        });
    }

    render() {
        const {publisher} = this.state;

        return <div id="publishers-page">
            <div className="small-form add-publisher">
                <form name="publisher" onSubmit={this.handleSubmit}>
                    <h1>Добавить издателя:</h1>
                    <div className="form-group">
                        <h2>Название:</h2>
                        <input type="text" name="name" value={publisher.name}
                               onChange={this.handleChange} placeholder="Название"/>
                    </div>
                    <div className="form-group">
                        <h2>Тип:</h2>
                        <div className="select">
                            <select name="publisherType" onChange={this.handleChange}>
                                <option value="telegram">Telegram</option>
                                <option value="vk">Вконтакте</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <h2>Токен:</h2>
                        <input type="text" name="token" value={publisher.token}
                               onChange={this.handleChange} placeholder="Токен"/>
                    </div>
                    <div className="form-group">
                        <h2>Идентификатор {(publisher.publisherType === 'telegram' ? 'чата' : 'группы')}:</h2>
                        <input type="text" name="targetId" value={publisher.targetId}
                               onChange={this.handleChange} placeholder="Идентификатор"/>
                    </div>

                    <div className="submit-controls">
                        <button className="primary">Добавить</button>
                    </div>
                </form>
            </div>
            <div id="publishers-list">
                {
                    !this.props.isLoading && this.props.publishers.map(publisher =>
                        <PublisherComponent publisher={publisher} key={publisher.name}/>
                    )
                }
                {
                    this.props.isLoading && <h1>Загрузка</h1>
                }
            </div>
        </div>
    }
}

export default connect(
    state => state.publishers,
    dispatcher => bindActionCreators(actionCreators, dispatcher)
)(PublishersPage);
import * as React from "react";

export default class PublisherComponent extends React.Component {
    render() {
        const {name, publisherType, token, targetId} = this.props.publisher;

        return (
            <div className="publisher">
                <h3>{name}</h3>
                <div className="publisher-details">
                    <div><strong>Тип:</strong> {publisherType}</div>
                    <div><strong>Токен:</strong> {token}</div>
                    <div><strong>Идентификатор:</strong> {targetId}</div>
                </div>
            </div>
        )
    }
}
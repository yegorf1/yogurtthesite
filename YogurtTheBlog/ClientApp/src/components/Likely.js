/**
 * Copied from https://github.com/koluch/react-ilyabirman-likely
 * 
 * License: MIT
 * Author: koluch
 * 
 * Modified by me
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import likely from 'ilyabirman-likely';

const {string, node, oneOf} = PropTypes;

export const Item = ({type, children, ...rest}) => <div {...rest} className={`${type}`}>{children}</div>;
Item.propTypes = {
    children: node,
    type: oneOf([
        'facebook',
        'twitter',
        'gplus',
        'vkontakte',
        'pinterest',
        'odnoklassniki',
        'telegram',
        'linkedin',
    ]).isRequired,
};

export const Facebook = (props) => <Item type={'facebook'}>{props.children}</Item>;

Facebook.propTypes = {
    children: node,
};

export const Twitter = ({children, via}) => <Item type={'twitter'} data-via={via}>{children}</Item>;
Twitter.propTypes = {
    children: node,
    via: string,
};

export const Gplus = ({children}) => <Item type={'gplus'}>{children}</Item>;
Gplus.propTypes = {
    children: node,
};

export const Vkontakte = ({children}) => <Item type={'vkontakte'}>{children}</Item>;
Vkontakte.propTypes = {
    children: node,
};

export const Pinterest = ({children, media}) => <Item type={'pinterest'} data-media={media}>{children}</Item>;
Pinterest.propTypes = {
    media: string,
    children: node,
};

export const Odnoklassniki = ({children}) => <Item type={'odnoklassniki'}>{children}</Item>;
Odnoklassniki.propTypes = {
    children: node,
};

export const Telegram = ({children, text}) => <Item type={'telegram'} data-text={text}>{children}</Item>;
Telegram.propTypes = {
    text: string,
    children: node,
};

export const Linkedin = ({children}) => <Item type={'linkedin'}>{children}</Item>;
Linkedin.propTypes = {
    children: node,
};


export default class Likely extends Component {
    componentDidMount() {
        likely.initiate(this.rootEl)
    }

    componentDidUpdate() {
        this.rootEl['likely'] = null;
        likely.initiate(this.rootEl, {forceUpdate: true})
    }

    render() {
        const {skin, size, dataUrl} = this.props;
        const className = 'likely'
            + (skin !== 'default' ? ` likely-${skin}` : '')
            + (size !== 'default' ? ` likely-${size}` : '');

        return (
            <div className={className} data-url={dataUrl || window.location.href} ref={(el) => { this.rootEl = el }}>
                {this.props.children}
            </div>
        )
    }
}

Likely.defaultProps = {
    skin: 'default',
    size: 'default',
};

Likely.propTypes = {
    skin: oneOf([
        'default',
        'light',
    ]),
    size: oneOf([
        'small',
        'default',
        'big',
    ]),
    dataUrl: string,
    children: node,
};

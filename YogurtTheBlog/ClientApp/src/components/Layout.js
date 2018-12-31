import React from 'react';
import Header from './Header';

export default props => (
  <div>
    <Header />
    <div className="content">
      {props.children}
    </div>
  </div>
);

import React from 'react';
import { Container } from 'reactstrap';
import Header from './Header';

export default props => (
  <div>
    <Header />
    <Container>
      {props.children}
    </Container>
  </div>
);

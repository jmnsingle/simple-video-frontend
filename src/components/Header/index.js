import React from 'react';

import logo from '../../assets/logo.jpg';

import { Container } from './styles';

export default function Header() {
  return (
    <Container>
      <img src={logo} alt="Triângulo Sul Sistemas"/>
      <h1>Triângulo Sul Tecnologia</h1>
    </Container>
  );
}

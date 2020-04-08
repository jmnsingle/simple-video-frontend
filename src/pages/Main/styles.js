import styled from 'styled-components';
import logo from '../../assets/logo.jpg';

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  /* background-image: url(${logo}); */
  /* background-repeat: repeat; */
  background-color: rgba(255, 255, 255, 0.1);

  .btn-container {
    background: #708dfa;
    height: 100px;
    display: flex;
    align-items: center;
    /* justify-content: space-around; */

    button{
      height: 40px;
      margin: 10px;
      border-radius: 4px;
      border: 2px solid #ddd;
      background: transparent;
      padding: 10px;  
      font-size: 18px;
      font-weight: bold;
      color: #fff;

    }

    .desc {
      margin: 0 0 2px 10px;
      font-size: 18px;
      font-weight: bold;
      color: #fafafa;
      text-align: center;
    }
  }

`;

export const Row = styled.div`
  display: flex;
  width: 100%;
`;

export const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;
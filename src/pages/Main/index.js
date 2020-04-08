import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";

import Header from '../../components/Header';

import { Container, Row, Video } from './styles';

function App() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect("https://simple-video-chat-with-soket.herokuapp.com/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    })

    socket.current.on("hey", (data) => {
     setReceivingCall(true);
     setCaller(data.from);
     setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', data => {
      socket.current.emit('callUser', {userToCall: id, signalData: data, from: yourID});

      peer.on('stream', stream => {
        if (partnerVideo.current) {
          partnerVideo.current.srcObject = stream;
        }
      });

      socket.current.on('callAccepted', signal => {
        setCallAccepted(true);
        peer.signal(signal);
      });

    });
  }

  function acceptCall() {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on('signal', data => {
      socket.current.emit('acceptCall', {signal: data, to: caller});
    });

    peer.on('stream', stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <Video playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div className>
        {/* <h1>Alguém está te ligando!</h1> */}
        <p className='desc'>Atenter</p>
        <button onClick={acceptCall}>{caller}</button>
      </div>
    )
  }
  return (
    <Container>
      <Header />

      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
      <h1>Usuários conectados</h1>
      <div className="btn-container">
        {Object.keys(users).map(key => {
          if (key === yourID) {
            return  <p style={{fontSize: 18, color: '#fff', textAlign: 'center', marginTop: 20, marginBottom: 20}}>Os usuários conectados apareceram aqui.</p>;
          }
          return (
            <div>
              <p className='desc'>Ligar para</p> 
              <button onClick={() => callPeer(key)}>{key}</button>
            </div>
          );
        })}
      </div>
      <br/>
      <h1>Ligação recebida</h1>
      <div className="btn-container">
        {incomingCall ? incomingCall : <p style={{fontSize: 18, color: '#fff', textAlign: 'center', marginTop: 20, marginBottom: 20}}>A chamada recebida aparecerá aqui.</p>}
      </div>
    </Container>
  );
}

export default App;

"use client"
import { useState, useEffect } from 'react'
import { Device } from '@twilio/voice-sdk';

enum Codec {
  Opus = "opus",
  PCMU = "pcmu"
}

export default function Home() {
  const [token, setToken] = useState('');
  const [callInProgress, setCallInProgress] = useState(false);

  useEffect(() => {
    const initializeDevice = async () => {
      const response = await fetch('/api/token', { method: 'GET' });
      const data = await response.json();
      setToken(data.token);

    };

    initializeDevice();
  }, []);

  const startCall = () => {
    if (!token) return;

    setCallInProgress(true);

    const params = {
      To: 'voice_assistant', // Arbitrary parameter to identify the call
    };

    const newDevice = new Device(token, {
      logLevel: 1,
      codecPreferences: ["opus", "pcmu"] as Codec[],
    });

    newDevice.on('ready', () => {
      console.log('Twilio.Device Ready!');
    });

    newDevice.on('error', (error) => {
      console.error('Twilio.Device Error:', error);
    });


    newDevice.connect({
      params: params,
    });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {!callInProgress ? (
        <button onClick={startCall}>Start</button>
      ) : (
        <p>Call in progress...</p>
      )}
    </div>
  );
}

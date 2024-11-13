"use client"
import { useState, useEffect } from 'react'
import { Device } from '@twilio/voice-sdk';
import axios from 'axios';

enum Codec {
  Opus = "opus",
  PCMU = "pcmu"
}

export default function Home() {
  const [token, setToken] = useState('');
  const [callInProgress, setCallInProgress] = useState(false);

  useEffect(() => {
    const initializeDevice = async () => {

      axios(process.env.NEXT_PUBLIC_API_URL + '/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true,
        data: {
          identity: 'user'
        }
      }).then((response) => {
        setToken(response.data.token);
      }).catch((err) => {
        console.log("err", err)
      })

    };

    initializeDevice();
  }, []);

  const startCall = () => {
    console.log('startCall');
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
    <div className='w-screen h-screen flex flex-col items-center justify-center bg-white/80'>
      <div className=' flex flex-col items-center bg-gray-100 p-8 rounded-xl w-4/12'>
        <button className=' cursor-pointer text-white bg-green-600 px-4 py-2 rounded-xl mb-2' onClick={startCall}>Start</button>
        {
          callInProgress ? <p className=' text-black'>Call in Progress</p> : <p className=' text-black'>No Call</p>
        }

        {
          token && <p className=' text-green-500 mt-4'>Ready</p>
        }
      </div>
    </div>
  );
}

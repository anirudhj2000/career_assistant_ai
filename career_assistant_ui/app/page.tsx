'use client';

import { useState, useEffect, useRef } from 'react';
import { Device } from '@twilio/voice-sdk';
import axios from 'axios';

// Define Codec Preferences
enum Codec {
  Opus = "opus",
  PCMU = "pcmu"
}


// LiveAudioVisualizer
// Use the getUserMedia API to capture audio from the user's microphone


export default function Home() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [callInProgress, setCallInProgress] = useState(false);
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<any>(null);
  const [websocketMessage, setWebsocketMessage] = useState<Array<string>>([]);
  const ws = useRef<WebSocket | null>(null);


  const generateToken = async (newUser: boolean, id?: string) => {
    try {

      let obj: any = {
        identity: 'user',
        newUser: newUser
      }

      if (!newUser) {
        obj = {

          id: id,
          ...obj
        }
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
        obj,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setToken(response.data.token);
      localStorage.setItem('userdata', JSON.stringify(response.data));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching token:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const data = localStorage.getItem('userdata');
    if (!data) {
      generateToken(true)
    }
    else {
      const userdata = JSON.parse(data);
      if (userdata.token) {
        generateToken(false, userdata.id)
      }
      else {
        setLoading(false);
      }
    }
  }, [])

  useEffect(() => {
    // Replace 'ws://localhost:5050' with your actual WebSocket server URL
    ws.current = new WebSocket(`wss://${process.env.NEXT_PUBLIC_HOST_URL}/ui`);

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      console.log('Received message from server:',);
      console.log("data response", event);


      let data = JSON.parse(event.data);

      setWebsocketMessage((prev) => [data.message, ...prev]);

    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (token) {
      // Initialize Twilio Device
      const device = new Device(token, {
        logLevel: 1,
        codecPreferences: [Codec.Opus, Codec.PCMU],
      });

      deviceRef.current = device;
    }
  }, [token])

  // Start Call Function
  const startCall = async () => {
    if (!deviceRef.current) {
      console.error("Twilio Device is not initialized.");
      return;
    }

    const device = deviceRef.current;

    setCallInProgress(true);

    const params = {
      To: 'voice_assistant', // Identifier for the call
    };

    try {
      const call = device.connect({
        params: params,
      });
      callRef.current = call;

      (await call).on('accept', () => {
        console.log('Call accepted');
      });

      (await call).on('disconnect', () => {
        console.log('Call disconnected');
        setCallInProgress(false);
        callRef.current = null;
      });

      (await call).on('error', (error: any) => {
        console.error('Call Error:', error);
        setCallInProgress(false);
        callRef.current = null;
      });

    } catch (error) {
      console.error("Error initiating call:", error);
      setCallInProgress(false);
    }
  };

  // End Call Function
  const endCall = () => {
    const device = deviceRef.current;
    if (device) {
      device.disconnectAll();
      setCallInProgress(false);
      callRef.current = null;
      console.log('All calls disconnected');
    }
  };

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center bg-white/80'>
      <div className='flex flex-col items-center bg-gray-100 p-8 rounded-xl w-4/12 mt-[10vh] shadow-lg'>
        {loading ? (
          <p className='text-gray-700 mb-4'>Loading...</p>
        ) : (
          <>
            <button
              className={`cursor-pointer text-white px-4 py-2 rounded-xl mb-2 ${callInProgress ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              onClick={startCall}
              disabled={callInProgress || !token}
            >
              Start Call
            </button>

            {callInProgress && (
              <button
                className='cursor-pointer text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl mb-2'
                onClick={endCall}
              >
                Disconnect
              </button>
            )}

            <p className='text-black mb-4'>
              {callInProgress ? 'Call in Progress' : 'No Call'}
            </p>

            {token && (
              <p className='text-green-500 mt-2'>Ready</p>
            )}
          </>
        )}
      </div>

      {
        websocketMessage.length > 0 ?
          <div className='flex flex-col items-center bg-gray-100 p-4 max-h-[40vh] overflow-y-auto rounded-xl w-8/12 shadow-lg mt-[5vh]'>
            <h2 className='text-xl text-black font-bold'>Websocket Messages</h2>
            {websocketMessage.map((message: any, index) => (
              <div className='flex flex-col items-start gap-x-4 p-2 w-full border-[1px] rounded-lg mb-4'>
                <div className=' w-full flex flex-row justify-between items-center'>
                  <p className='text-black'>{message.stage}</p>
                  <p className='text-black max-w-1/2'>{message.sub_stage}</p>
                </div>
                <div className=' w-full flex flex-row justify-between mt-1 items-center'>
                  <p className='text-black text-sm'>{message.description}</p>
                </div>
              </div>
            ))}
          </div> : null
      }
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { Device } from '@twilio/voice-sdk';
import axios from 'axios';

// Define Codec Preferences
enum Codec {
  Opus = "opus",
  PCMU = "pcmu"
}


export default function Home() {
  const [token, setToken] = useState('');
  const [callInProgress, setCallInProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<any>(null);



  // Fetch Token on Component Mount
  useEffect(() => {
    const initializeDevice = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/token`,
          { identity: 'user' },
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
        setToken(response.data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeDevice();
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
      <div className='flex flex-col items-center bg-gray-100 p-8 rounded-xl w-4/12 shadow-lg'>
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
    </div>
  );
}

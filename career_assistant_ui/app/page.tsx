"use client";

import { useState, useEffect, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import axios from "axios";
import { useStore } from "@/utils/store";
import { ChartSpline } from "lucide-react";
import ViewActiveLogs from "@/components/viewActiveLogs";
// import { jobsDummy } from '@/utils/consts';

// Define Codec Preferences
enum Codec {
  Opus = "opus",
  PCMU = "pcmu",
}

// LiveAudioVisualizer
// Use the getUserMedia API to capture audio from the user's microphone

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [callInProgress, setCallInProgress] = useState(false);
  const deviceRef = useRef<Device | null>(null);
  const callRef = useRef<any>(null);
  const { setShowJobsModal, setViewActiveLog, viewActiveLog } = useStore();
  const [websocketMessage, setWebsocketMessage] = useState<Array<any>>([]);
  const ws = useRef<WebSocket | null>(null);

  const generateToken = async (newUser: boolean, id?: string) => {
    try {
      let obj: any = {
        identity: "user",
        newUser: newUser,
      };

      if (!newUser) {
        obj = {
          id: id,
          ...obj,
        };
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
        obj,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setToken(response.data.token);
      localStorage.setItem("userdata", JSON.stringify(response.data));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching token:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("userdata");
    if (!data) {
      generateToken(true);
    } else {
      const userdata = JSON.parse(data);
      if (userdata.token) {
        generateToken(false, userdata.id);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(`wss://${process.env.NEXT_PUBLIC_HOST_URL}/ui`);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      console.log("Received message from server:");
      const data = JSON.parse(event.data);

      if (data.message.stage == "job_showcase") {
        setShowJobsModal({ show: true, message: data.message.jobs });
        // setShowJobsModal({ show: true, message: JSON.stringify(jobsDummy) });
      }

      setWebsocketMessage((prev) => [data.message, ...prev]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
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
  }, [token]);

  // Start Call Function
  const startCall = async () => {
    if (!deviceRef.current) {
      console.error("Twilio Device is not initialized.");
      return;
    }

    const device = deviceRef.current;

    setCallInProgress(true);

    const params = {
      To: "voice_assistant", // Identifier for the call
    };

    try {
      const call = device.connect({
        params: params,
      });
      callRef.current = call;

      (await call).on("accept", () => {
        console.log("Call accepted");
      });

      (await call).on("disconnect", () => {
        console.log("Call disconnected");
        setCallInProgress(false);
        callRef.current = null;
      });

      (await call).on("error", (error: any) => {
        console.error("Call Error:", error);
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
      console.log("All calls disconnected");
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-white/85">
      <h1 className="text-4xl font-bold text-black ">AI Career Assistant</h1>
      <p className="text-black text-center w-9/12 mt-4 ">
        Welcome to the AI Career Assistant. Click the button below to start a
        call.
      </p>

      <p className="text-black font-bold text-center w-9/12 mt-4 ">{'Note : Please wait for 5-10 secs after the initial message from twilio about the free account (it is not an error , I am using an free account) for the assistant to start speaking'}</p>

      <div className="flex flex-col items-center bg-gray-100 p-8 mt-[2.5vh] rounded-xl w-10/12 lg:w-4/12 lg:mt-[5vh] shadow-lg">
        {loading ? (
          <p className="text-gray-700 mb-4">Loading...</p>
        ) : (
          <>
            <button
              className={`cursor-pointer w-1/2 text-white px-4 py-2 rounded-xl mb-2 ${callInProgress
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                }`}
              onClick={startCall}
              disabled={callInProgress || !token}
            >
              Start Call
            </button>

            {callInProgress && (
              <button
                className="cursor-pointer w-1/2 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl mb-2"
                onClick={endCall}
              >
                Disconnect
              </button>
            )}

            <p className="text-black mb-4">
              {callInProgress ? "Call in Progress" : "No Call"}
            </p>

            {token && <p className="text-green-500 mt-2">Ready</p>}

            {callInProgress ? (
              <button onClick={() => {
                setViewActiveLog({ ...viewActiveLog, show: true });
              }}

                className="flex flex-row mt-4 gap-x-2 bg-black shadow-md w-1/3 justify-center py-1 rounded-md items-center">
                <ChartSpline size={14} className=" text-base text-white" />
                <p className="text-sm text-white">View Logs</p>
              </button>
            ) : null}
          </>
        )}
      </div>

      <ViewActiveLogs logs={websocketMessage} />
    </div>
  );
}

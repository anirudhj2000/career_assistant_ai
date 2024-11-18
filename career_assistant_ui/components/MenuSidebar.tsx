"use client";
import React, { useState, useEffect } from "react";
import { useStore } from "@/utils/store";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import axios from "axios";
import { X } from "lucide-react";
import Spinner from "./Spinnner";


export default function MenuSidebar() {
    const [loading, setLoading] = useState(true);
    const [show, setter] = useState(false);
    const { showMenu, setShowMenu, setViewTranscript } = useStore();
    const [transcripts, setTranscripts] = useState([]);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        console.log("sidebar", showMenu);

        setter(showMenu.show);
    }, [showMenu.show]);

    const getUserTranscripts = async () => {

        const data = localStorage.getItem('userdata');
        if (!data) {
            return;
        }

        const userData = JSON.parse(data)
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/transcripts/${userData.id}`, {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: false,
                }
            );
            console.log(response.data);
            setTranscripts(response.data || []);
        } catch (err) {
            console.error("Error fetching transcripts:", err);
        }
    };

    const getJobsSuggestiobs = async () => {
        setLoading(true);
        const data = localStorage.getItem('userdata');
        if (!data) {
            return;
        }

        const userData = JSON.parse(data)
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${userData.id}`, {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: false,
                }
            );
            console.log(response.data);
            setJobs(response.data || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setLoading(false);
        }
    }

    useEffect(() => {
        getJobsSuggestiobs()
        getUserTranscripts();
    }, [showMenu.show]);

    const className =
        "bg-[#ffffff] w-[80vw] lg:w-[20vw] shadow-xl transition-[margin-left] ease-in-out duration-500 absolute h-screen top-0 bottom-0 left-0 z-50";
    // Append class based on state of sidebar visiblity
    const appendClass = show ? " ml-[0]" : " -ml-[80vw] lg:-ml-[25vw] ";

    // Clickable menu items


    // Overlay to prevent clicks in background, also serves as our close button
    const ModalOverlay = () => (
        <div
            className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
            onClick={() => {
                setShowMenu({
                    show: false,
                });
                setter((oldVal) => !oldVal);
            }}
            style={{ zIndex: 100 }}
        />
    );

    return (
        <>
            <div style={{ zIndex: 1220 }} className={`${className}${appendClass}`}>
                <div className=" flex flex-row justify-between gap-x-4 items-center px-4 mt-4">

                    <p className=" text-[#392E26] text-xl">Menu</p>
                    <a
                        onClick={() => {
                            setShowMenu({
                                ...showMenu,
                                show: false,
                            });
                        }}
                    >
                        <X size={16} className=" text-[#392E26] text-3xl" />
                    </a>
                </div>
                <div className=" flex flex-col w-full items-start px-4 mt-4">
                    <Accordion className=" w-full" type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Call Transcriptions</AccordionTrigger>
                            <AccordionContent>
                                {
                                    transcripts.length > 0 ? (
                                        <div className="flex flex-col w-full">
                                            {
                                                transcripts.map((transcript: any, index) => (
                                                    <div key={index} className="flex flex-col w-full border-[1px] border-[#c7c7c7] rounded-lg p-4 mb-4">
                                                        <p className="text-black text-sm font-semibold">Call Transcript {transcript.id}</p>
                                                        <a onClick={() => {
                                                            setViewTranscript({
                                                                show: true,
                                                                message: transcript.transcript
                                                            });
                                                            setShowMenu({
                                                                show: false,
                                                            });
                                                            setter((oldVal) => !oldVal);
                                                        }} className=" cursor-pointer text-sm underline">View Transcript</a>
                                                    </div>
                                                ))
                                            }
                                        </div>) :

                                        <p>No transcripts available</p>
                                }
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Accordion className=" w-full" type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Job Suggestions</AccordionTrigger>

                            <AccordionContent>
                                {
                                    jobs.length > 0 ? (
                                        <div className="flex flex-col w-full max-h-[50vh] overflow-y-scroll">
                                            {
                                                jobs.map((job: any, index) => (
                                                    <div key={index} className="flex flex-col w-full border-[1px] border-[#c7c7c7] rounded-lg p-4 mb-4">
                                                        <p className="text-black text-sm font-semibold">{job.title}</p>
                                                        <p className="text-black text-sm font-semibold">{job.company}</p>
                                                        <a href={job.link} target="_blank" className=" text-sm underline">View Transcript</a>
                                                    </div>
                                                ))
                                            }
                                        </div>) :
                                        loading ?
                                            <div className="w-full flex-row items-center justify-center"> <Spinner
                                                loading={loading}
                                                height={30}
                                                width={5}
                                                color="#000000"
                                            />
                                            </div> :
                                            <p>No Job Suggestions available</p>
                                }
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
            {show ? <ModalOverlay /> : <></>}
        </>
    );
}

"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/utils/store";
// import { jobsDummy } from "@/utils/consts";


const ViewTranscript = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { viewTranscript, setViewTranscript } = useStore();
    const [messages, setMessages] = useState<Array<string>>([]);

    useEffect(() => {
        if (viewTranscript.show) setIsOpen(viewTranscript.show);

        if (viewTranscript.message) {
            const messagesList = JSON.stringify(viewTranscript.message).split("\\n");
            setMessages(messagesList);
        }


    }, [viewTranscript.show]);

    const handleModalClose = () => {
        setViewTranscript({ show: false, message: "" });

        setIsOpen(false);
    };



    return (
        <div
            className={`${isOpen ? "fixed" : "hidden"
                } z-50 inset-0 flex items-center justify-center bg-black/30`}
        >
            <div className="bg-white w-11/12 lg:w-8/12 max-h-[70vh] animate-slideUp overflow-y-scroll py-6 roun px-8 flex flex-col ">
                <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full justify-end ">
                        <a
                            onClick={() => {
                                handleModalClose();
                            }}
                            className="cursor-pointer"
                        >
                            <X className="text-black/60 text-4xl" />
                        </a>
                    </div>

                </div>
                <div className="flex flex-col w-full  overflow-y-scroll">
                    <h3 className=" text-2xl font-semibold">Transcript</h3>
                    {
                        messages.map((message, index) => (
                            <div key={index} className="flex flex-col w-full  rounded-lg p-2 mb-2">
                                <p className="text-black text-sm">{message} </p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default ViewTranscript;

"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useStore } from "@/utils/store";
// import { jobsDummy } from "@/utils/consts";

interface ActiveLogsInterface {
    logs: Array<any>
}

const ViewActiveLogs = ({ logs }: ActiveLogsInterface) => {
    const [isOpen, setIsOpen] = useState(false);
    const { viewActiveLog, setViewActiveLog } = useStore();

    useEffect(() => {
        if (viewActiveLog.show) setIsOpen(viewActiveLog.show);
    }, [viewActiveLog.show]);



    const handleModalClose = () => {
        setViewActiveLog({ show: false, message: "" });
        setIsOpen(false);
    };



    return (
        <div
            style={{ zIndex: 120 }}
            className={`${isOpen ? "fixed" : "hidden"
                } z-50 inset-0 flex items-center justify-center bg-black/30`}
        >
            <div className="bg-white w-11/12 lg:w-7/12 max-h-[70vh] animate-slideUp overflow-y-scroll py-6 roun px-8 flex flex-col ">
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
                    <h2 className='text-xl text-black font-bold'>Active Coversation Status</h2>
                    {
                        logs.length > 0 ?
                            <div className='flex flex-col items-center p-4 max-h-[60vh] overflow-y-auto rounded-xl w-full shadow-lg mt-[5vh]'>
                                {logs.map((message: any, index) => (
                                    <div key={index} className='flex flex-col items-start gap-x-4 p-2 w-full border-[1px] rounded-lg mb-4'>
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
            </div>
        </div>
    );
};

export default ViewActiveLogs;

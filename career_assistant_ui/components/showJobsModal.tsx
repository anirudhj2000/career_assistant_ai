"use client";
import React, { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { useStore } from "@/utils/store";
// import { jobsDummy } from "@/utils/consts";

interface JobsInterface {
    title: string;
    company: string;
    location: string;
    link: string;
}

const ShowJobsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { showJobsModal, setShowJobsModal } = useStore();
    const [jobs, setJobs] = useState<Array<JobsInterface>>([]);

    useEffect(() => {
        if (showJobsModal.show) setIsOpen(showJobsModal.show);

        if (showJobsModal.message) {
            const jobsList = JSON.parse(showJobsModal.message);
            setJobs(jobsList);
        }
    }, [showJobsModal.show]);

    const handleModalClose = () => {
        setShowJobsModal({ show: false, message: "" });
        setJobs([]);
        setIsOpen(false);
    };



    return (
        <div
            className={`${isOpen ? "fixed" : "hidden"
                } z-50 inset-0 flex items-center justify-center bg-black/30`}
        >
            <div className="bg-white w-8/12 max-h-[70vh] animate-slideUp overflow-y-scroll py-6 roun px-8 flex flex-col ">
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
                <div className="flex flex-col w-full max-h-[60vh] overflow-y-scroll">
                    <h1 className="text-2xl font-bold text-black mb-4">Jobs</h1>
                    {jobs.map((job, index) => (
                        <div
                            key={index}
                            className="flex flex-row w-full justify-between p-4 border-[1px] rounded-lg shadow-sm mb-4"
                        >
                            <div className=" w-full flex flex-col justify-center items-start">
                                <p className="text-black">{job.title}</p>
                                <p className="text-black font-semibold text-lg">{job.company}</p>
                            </div>
                            <div className=" w-full flex flex-col justify-center mt-1 items-end">
                                <div className=" flex flex-row gap-x-1 items-center">
                                    <MapPin size={18} className=" text-gray-600 text-xs" />
                                    <p className="text-black text-md">{job.location}</p>
                                </div>
                                <a
                                    href={job.link}
                                    target="_blank"
                                    className="text-white bg-blue-600 px-8 mt-2 rounded-md shadow-lg  "
                                >
                                    Visit Job
                                </a>
                            </div>


                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShowJobsModal;

"use client";
import React, { useState, useEffect } from "react";
import { useStore } from "@/utils/store";

interface MenuItemInterface {
    name: string;
    href: string;
}

const links = [
    {
        title: "Github",
        link: "https://github.com/anirudhj2000/career_assistant_ai"
    },
    {
        title: "Documentation",
        link: "https://brick-fiber-d3c.notion.site/Career-Assistant-AI-1396789c971f80f79d27d8bf3e0f4953",
    },
    {
        title: "Resume",
        link: "https://drive.google.com/file/d/1wTAVAM-dMagglShjSVtY3Xtiz2GNT4Lj/view?usp=drive_link",
    }
]

export default function Sidebar() {
    const [show, setter] = useState(false);
    const { setShow, sidebar } = useStore();

    useEffect(() => {
        console.log("sidebar", sidebar);
        setter(sidebar.show);
    }, [sidebar.show]);

    // Define our base class
    const className =
        "bg-[#f6f6f7] w-[80vw] md:hidden transition-[margin-right] ease-in-out duration-500 fixed md:static top-0 bottom-0 right-0 z-50";
    // Append class based on state of sidebar visiblity
    const appendClass = show ? " mr-[0]" : " mr-[-80vw] md:mr-0";

    // Clickable menu items
    const MenuItem = ({ name, href }: MenuItemInterface) => {
        // Highlight menu item based on currently displayed route


        return (
            <a
                href={href}
                target="_blank"
                className={`flex flex-row items-baseline gap-1 [&>*]:my-auto text-md pl-6 py-3 border-b-[1px] border-b-black/10`}
            >
                <div className="text-black text-xl ">{name}</div>
            </a>
        );
    };

    // Overlay to prevent clicks in background, also serves as our close button
    const ModalOverlay = () => (
        <div
            className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
            onClick={() => {
                setShow({
                    show: false,
                });
            }}
            style={{ zIndex: 100 }}
        />
    );

    return (
        <>
            <div style={{ zIndex: 120 }} className={`${className}${appendClass}`}>
                <div className="text-md px-2 mt-[20px] -mb-2 border-b-2 border-secondaryPurple">
                    <p className=" text-black text-lg pl-2">Menu</p>
                </div>
                <div className="flex flex-col mt-2">
                    {links.map((item, index) => {
                        return <MenuItem key={index} name={item.title} href={item.link} />;
                    })}
                </div>
            </div>
            {show ? <ModalOverlay /> : <></>}
        </>
    );
}

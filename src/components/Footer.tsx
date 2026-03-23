import React from 'react'
import { BsFillTelephoneFill } from "react-icons/bs";
import { SiGmail } from "react-icons/si";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white p-10" style={{ padding: "2rem" }}>
            <div className='flex flex-col sm:justify-between sm:flex-row gap-10 md:gap-50 mb-6'>
                <div className="">
                    <h2 className="text-xl font-bold">Emergency Assistant</h2>
                    <p className="text-gray-400">Your Offline assistant for critical situations 24/7</p>
                </div>
                <div className="container ">
                    <a href="#about" className="text-gray-400 text-white hover:cursor-pointer">About</a>
                    <div className="flex flex-col gap-2">
                        <span>Contact us</span>
                        <a href="mailto:techverse26@gmail.com" className="text-gray-400 hover:text-white flex items-center"><SiGmail className="mr-2" />&nbsp; Gmail</a>
                        <a href="mailto:techverse26@gmail.com" className="text-gray-400 hover:text-white flex items-center">techverse26@gmail.com</a>
                    </div>
                </div>
            </div>
            <span className="text-gray-400 text-md hover:text-white">© 2026 Emergency Assistant. All rights reserved.</span>
        </footer>
    )
}

export default Footer
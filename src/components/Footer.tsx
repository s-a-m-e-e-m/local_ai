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
                    <div className="grid gap-2">
                        <span>Contact us</span>
                        <ul className='flex flex-col sm:flex-row gap-6'>
                            <li><a href="mailto:codeverse@gmail.com" className="text-gray-400 hover:text-white flex items-center"><SiGmail className="mr-2" />&nbsp; Gmail</a></li>
                            <li><a href="tel:+910000000000" className="text-gray-400 hover:text-white flex items-center"><BsFillTelephoneFill className="mr-2" />&nbsp;  Mobile</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <span className="text-gray-400 text-md hover:text-white">© 2026 Emergency Assistant. All rights reserved.</span>
        </footer>
    )
}

export default Footer
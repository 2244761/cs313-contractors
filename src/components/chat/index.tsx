import { useState } from "react";

import { BsChatRightDotsFill } from "react-icons/bs";
import { BsXCircle } from "react-icons/bs";
import { BsFillSendFill } from "react-icons/bs";

import logo from "../../assets/images/samcis-logo.png";


export default function ChatBox() {
    const [isOpen, setIsOpen]= useState(false);
    const [messages, setMessages] = useState([
        { 
            sender: "admin", 
            text: "You are currently chatting with the CSR Admin.", 
            time: new Date().toLocaleString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit", 
            })
        },
    ]);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if(!input.trim()) return;
        const newMessage = {
            sender:"user",
            text:input,   // 
            time: new Date().toLocaleTimeString("en-US", {
                month:"long",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }

            )
        };
        setMessages([...messages, newMessage]);
        setInput("");
    };

    return (
        <>
        <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 bg-[var(--primary)] text-[var(--primary-white)] p-3 rounded-full shadow-lg [var(--dark-primary)] z-50">
            <BsChatRightDotsFill size={25} />
        </button>

        {isOpen && (
            <div className="fixed bottom-20 right-6 w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 " style={{ width: "360px", height: "450px" }}>
                <div className="p-3  flex justify-between items-center space-x-2 bg-[var(--primary)] text[var(--primary-white)]">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="SAMCIS Logo" className="w-8 h-6" />
                        <span className="font-semibold text-2xl text-[var(--primary-white)]">CSR Admin</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-[var(--primary-white)]">
                        <BsXCircle size={22} />
                    </button>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-3 max-h-80">
                    {messages.map((msg, index) => (
                        <div key={index}
                            className={`flex flex-col ${
                                msg.sender === "user" ? "items-end" : "items-start"
                            }`}>
                            <div className={`px-4 py-2 rounded-2xl text-sm ${
                                    msg.sender === "user"
                                        ? "bg-[#4E80C3] text-[var(--primary-white)]  rounded-br-none"
                                        : "bg-[var(--primary-white)] text-[var(--dark-secondary)]  rounded-bl-none"
                                }`}>
                                {msg.text}
                            </div>

                            <span className={`text-[10px] text-[var(--ui-border)] mt-1 ${
                                msg.sender === "user" ? "text-right pr-2" : "text-left pl-2"
                            }`}>
                                {msg.time.replace(",", " |")}
                            </span>
                        </div>
                    ))
                    }
                </div>

                <div className="border-t border-[var(--ui-border)] text-sm p-2  flex items-center">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder="Send message..."
                        className="flex-1 px-3 py-2 text-sm border border-[var(--ui-border)] bg-[var(--primary-white)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                    <button
                        onClick={handleSend}
                        className="ml-2 px-3 py-2 bg-[var(--primary)] text-[var(--primary-white)] text-sm rounded-lg"
                    >
                        <BsFillSendFill size={20} />
                    </button>
                </div>
            </div>
        )}
        </>
    );
}
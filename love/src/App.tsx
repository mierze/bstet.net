"use client";
import React, { useRef, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"


function App() {

    const [messages, setMessages] = useState<string[]>([]);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Connect to WebSocket server
        ws.current = new WebSocket("ws://localhost:3000");

        ws.current.onopen = () => {
            console.log("Connected to WebSocket server");
            ws.current?.send("Hello from client");
        };

        ws.current.onmessage = (event) => {
            console.log("Received:", event.data);
            setMessages((prev) => [...prev, event.data]);
        };

        ws.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.current.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    const [goal, setGoal] = React.useState(350)

    function onClick(adjustment: number) {
        setGoal(Math.max(200, Math.min(400, goal + adjustment)))
    }

    const [count, setCount] = useState(0)

    return (
        <>
            <Drawer>
                <DrawerTrigger><Button>Retrieve Reservation</Button></DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <h1 className='text-3xl'>KAITLYN AND BRETT</h1>
            <h1 className='bg-purple-800 text-shadow-amber-500'>KAITLYN AND BRETT</h1>
            <h2 className='text-3xl'>california dreaming</h2>
            <p className="read-the-docs margin">
                Clickaa on the Vite and React logos to learn more
            </p>
            <ul>
                {messages.map((msg, i) => (
                    <li key={i}>{msg}</li>
                ))}
            </ul>
        </>
    )
}

export default App

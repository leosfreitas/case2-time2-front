import React from 'react';
import { CaretDoubleDown } from "@phosphor-icons/react";
import { Header } from "../../components/header";
import { Video } from '../../components/video';

export const About = () => {
    return (
        <>
        <Header />
            <div className="relative h-screen" id="home">
                <Video></Video>


                <div className="relative z-1 text-white text-center pt-[40vh]">
                    <h1 className="text-5xl font-bold">TELECONNECT</h1>
                    <p className="text-lg mt-4">Conectando pessoas através da tecnologia</p>
                </div>

                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
                    <CaretDoubleDown size={32} color="white" />
                </div>
            </div>
        </>
    );
};
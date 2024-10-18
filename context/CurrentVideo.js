import { createContext, useState } from "react";

const CurrentVideo = createContext();

const CurrentVideoProvider = ({children}) => {
    const [currentVideo, setCurrentVideo] = useState({});

    return (
        <CurrentVideo.Provider value={{currentVideo, setCurrentVideo}} >
           {children}
        </CurrentVideo.Provider>
    );
};

export {CurrentVideo, CurrentVideoProvider}
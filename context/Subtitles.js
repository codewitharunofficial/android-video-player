import { createContext, useState } from "react";

const CurrentSubtitles = createContext();

const SubtitleProvider = ({children}) => {
    const [currentSubtitle, setCurrentSubtitles] = useState(null);

    return (
        <CurrentSubtitles.Provider value={{currentSubtitle, setCurrentSubtitles}} >
           {children}
        </CurrentSubtitles.Provider>
    );
};

export {CurrentSubtitles, SubtitleProvider}
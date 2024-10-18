import { createContext, useState } from "react";

const PlayerScreenContext = createContext();

const PlayerScreenProvider = ({children}) => {

    const [playVideo, setPlayVideo] = useState(false);

    return (
      <PlayerScreenContext.Provider value={{playVideo, setPlayVideo}} >
         {children}
      </PlayerScreenContext.Provider>
    )
}

export {PlayerScreenContext, PlayerScreenProvider}
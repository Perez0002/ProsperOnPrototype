import React from "react";
import Popup from "reactjs-popup";

interface PopupComponentProps {
  trigger: React.ReactNode;
  pageComponent: React.ReactNode;
}

const PopupComponent: React.FC<PopupComponentProps> = ({ trigger, pageComponent }) => (
  <Popup 
    trigger={trigger} 
    modal
  >
    {(close: () => void) => (
      <div className="modal w-screen h-screen flex justify-center items-center">
      <div className="absolute top-0 left-0 w-screen h-screen bg-black opacity-50 z-0"></div>
      <div className="content border-2 border-black bg-white mx-4 p-8 rounded w-full md:w-1/2 lg:w-1/3 z-10">
        {pageComponent}
        <footer className="sticky bottom-0 h-16 grid justify-items-end items-center">
          <button
            className="bg-black hover:bg-gray-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => close()}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
    )}
  </Popup>
);

export default PopupComponent;

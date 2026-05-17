import React from "react";

export default function FooterSmall(props) {
  return (
    <>
      <footer
        className={
          (props.absolute
            ? "absolute w-full bottom-0 bg-gray-800"
            : "relative") + " pb-6 pt-6"
        }
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="text-sm text-white font-semibold py-1 text-center">
              Copyright  © {new Date().getFullYear()} Hexalyte
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
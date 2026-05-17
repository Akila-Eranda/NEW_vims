import React, { useState } from "react";

function TableEditDeleteMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div >
        <button onClick={() => setMenuOpen((o) => !o)} className="p-1" >
          {" "}
          <i className="fa fa-ellipsis-v"></i>{" "}
        </button>

        {menuOpen ? (
          <ul className="absolute z-40 py-1 px-3">
            <li className="hover:bg-blue-200">Delete</li>
            <li>Edit</li>
          </ul>
        ) : null}
      </div>
    </>
  );
}

export default TableEditDeleteMenu;

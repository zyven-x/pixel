import { useState, useEffect, useRef } from "react";
import { FiLogOut } from "react-icons/fi";
import { CgUserlane } from "react-icons/cg";
import { FaUserCircle, FaMagic } from "react-icons/fa";

export default function Profile({
  name = "Pixel User",
  email = "you@example.com",
  avatar,
  onEditUsername,
  onEditAvatar,
  onSignOut,
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(name);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setUsername(name);
  }, [name]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setEditing(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleUsernameChange = async (e) => {
    if (e.type === "blur" || e.key === "Enter") {
      setEditing(false);
      if (username.trim() && username !== name) {
        await onEditUsername(username.trim());
      } else {
        setUsername(name);
      }
    }
  };

  return (
    <div className="relative">
      {/* profile icon on top of nav */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 mr-4 cursor-pointer flex items-center rounded-full overflow-hidden border border-gray-300 shadow-sm hover:shadow-md gap-2"
      >
        {avatar ? (
          <img src={avatar} alt="User" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <FaUserCircle className="text-gray-800 hover:text-gray-600 w-9 h-9" />
          </div>
        )}
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-3 min-w-64 max-w-[90vw] bg-white shadow-xl rounded-2xl z-50 overflow-hidden border border-gray-200"
        >
          <div className="flex items-center bg-gray-200 m-2 rounded-xl ">
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUserCircle className="text-xl text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-[160px] max-w-full">
                <span className="font-semibold text-black text-sm">{name}</span>
                <span className="text-xs text-gray-600 break-all">{email}</span>
              </div>
            </div>
          </div>

          {editing ? (
            <input
              ref={inputRef}
              className="w-full px-4 py-3 text-sm border-b border-gray-300 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={handleUsernameChange}
              onKeyDown={handleUsernameChange}
            />
          ) : (
            // change username
            <button
              onClick={() => setEditing(true)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <FaMagic className="text-gray-600" />
              <span className="text-black">Edit Username</span>
            </button>
          )}

          {/* change avatar */}
          <button
            onClick={onEditAvatar}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <CgUserlane className="text-gray-600" />
            <span className="text-black">Set Avatar</span>
          </button>

{/* signout button */}
          <button
            onClick={onSignOut}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2 text-red-600"
          >
            <FiLogOut />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

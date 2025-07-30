import React from "react";
import {
  IoMailOutline,
  IoKeyOutline,
  IoEyeOffOutline,
  IoEyeOutline,
  IoInformationCircle,
  IoAddCircleOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { CiGlobe } from "react-icons/ci";
import { BiSolidEditAlt, BiSolidEdit } from "react-icons/bi";
import PasswordContent from "./PasswordContent";

export default function VaultViewer({
  selectedEntry,
  showPassword,
  setShowPassword,
  showMoreInfo,
  setShowMoreInfo,
  handleEditVault,
  handleDelete,
  masterKey,
}) {
  if (!selectedEntry) return null;

  return (
    <div className="max-w space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{selectedEntry.site}</h2>
        <div className="flex gap-2">
          <button className="btn-icon" onClick={handleEditVault}>
            <BiSolidEdit className="w-5 h-5 " />
          </button>
          <button className="btn-icon" onClick={handleDelete}>
            <IoTrashOutline className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* mail */}
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 ml-2 flex items-center gap-2">
          <span className="text-black/60">
            <IoMailOutline className="w-5 h-5" />
          </span>
          <div className="ml-4">
            <div className="text-sm text-black/60">Email</div>
            <div className="text-black/80 font-medium">
              {selectedEntry.email}
            </div>
          </div>
        </div>

        <div className="border-t border-black/60" />

        <div className="p-4 ml-2 flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-black/60">
              <IoKeyOutline className="w-5 h-5" />
            </span>
            <div className="ml-4">
              <div className="text-sm text-black/60">Password</div>
              <div className="text-black/80 tracking-widest font-medium">
                {showPassword ? (
                  <PasswordContent
                    password={selectedEntry.password}
                    iv={selectedEntry.iv}
                    masterKey={masterKey}
                  />
                ) : (
                  "••••••••"
                )}
              </div>
            </div>
          </div>
          <button
            className="text-black/60 hover:opacity-50 mr-4"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <IoEyeOffOutline className="w-5 h-5" />
            ) : (
              <IoEyeOutline className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="bg-gray-200 p-4 mt-4 rounded-lg flex items-center gap-2">
        <span className="text-black/60 ml-2">
          <CiGlobe className="w-5 h-5" />
        </span>
        <div className="ml-4">
          <div className="text-sm text-black/60">Website</div>
          <a
            href={selectedEntry.url}
            target="_blank"
            className="text-blue-600 hover:underline break-all"
          >
            {selectedEntry.url}
          </a>
        </div>
      </div>

      {/* more info */}
      <div className="bg-gray-200 p-4 mt-4 rounded-lg">
        <div className="flex item-center gap-2 ">
          <span className="text-black/60 ml-2">
            <IoInformationCircle className="w-5 h-5" />
          </span>
          <div
            className="text-sm ml-4 flex item-center text-black/60 font-semibold mb-2 cursor-pointer"
            onClick={() => setShowMoreInfo(!showMoreInfo)}
          >
            More Info {showMoreInfo ? "▲" : "▼"}
          </div>
        </div>

        {showMoreInfo && (
          <>
            <div className="mb-2 mt-4">
              <div className="flex items-center gap-2 ml-2">
                <span className="text-black/60">
                  <BiSolidEditAlt className="w-5 h-5" />
                </span>
                <span className="text-sm text-gray-700 ml-2">
                  Last modified
                </span>
              </div>
              <div className="text-xs text-gray-500 ml-11 mt-1">
                {new Date(selectedEntry.updated).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>
            </div>

            <div className="mb-2">
              <div className="flex items-center gap-2 ml-2">
                <span className="text-black/60">
                  <IoAddCircleOutline className="w-5 h-5" />
                </span>
                <span className="text-sm text-gray-700 ml-2">Created</span>
              </div>
              <div className="text-xs text-gray-500 ml-11 mt-1">
                {new Date(selectedEntry.created).toLocaleString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

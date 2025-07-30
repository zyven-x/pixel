import { useEffect, useState } from "react";
import { decrypt } from "../utils/crypto";

export default function NoteContent({ content, iv, masterKey }) {
  const [text, setText] = useState("");

  useEffect(() => {
    decrypt(content, masterKey, iv).then(setText);
  }, []);

  return <>{text}</>;
}

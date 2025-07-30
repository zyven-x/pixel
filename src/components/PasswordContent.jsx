import { useEffect, useState } from "react";
import { decrypt } from "../utils/crypto";

export default function PasswordContent({ password, iv, masterKey }) {
  const [text, setText] = useState("");

  useEffect(() => {
    decrypt(password, masterKey, iv).then(setText);
  }, []);

  return <>{text}</>;
}

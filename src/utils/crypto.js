//Encryption by fileName

const enc = new TextEncoder();
const dec = new TextDecoder();

export async function encrypt(text, password) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(password);
  const encoded = enc.encode(text);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  return {
    data: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decrypt(encrypted, password, ivBase64) {
  const key = await deriveKey(password);

  const iv = Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0));
  const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));

  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return dec.decode(decrypted);
}

async function deriveKey(password) {
  const salt = enc.encode("pixel-salt");
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

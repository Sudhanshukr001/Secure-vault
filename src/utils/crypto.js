const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return window.btoa(binary);
};

const base64ToArrayBuffer = (base64) => {
  const binary_string = window.atob(base64);
  const bytes = new Uint8Array(binary_string.length);
  for (let i = 0; i < binary_string.length; i++) bytes[i] = binary_string.charCodeAt(i);
  return bytes.buffer;
};

const getPasswordKey = (password) => window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);

const deriveKey = async (passwordKey, salt, keyUsage) => window.crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
  passwordKey, { name: "AES-GCM", length: 256 }, false, keyUsage
);

// --- NEW FUNCTION: IMAGE TO KEY STRING ---
export const imageToPassword = async (imageFile) => {
  // We read the raw file buffer. This ensures that if the file is exactly the same, 
  // the key will be exactly the same.
  const buffer = await imageFile.arrayBuffer();
  
  // We hash the image data to SHA-256 to get a consistent fixed-length string
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  
  // Convert hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex; // This hex string acts as our "password"
};

export const encryptFile = async (file, password) => {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);
    const encryptedContent = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, aesKey, await file.arrayBuffer());
    
    const packageData = {
      salt: arrayBufferToBase64(salt),
      iv: arrayBufferToBase64(iv),
      data: arrayBufferToBase64(encryptedContent),
      fileName: file.name,
      mimeType: file.type
    };
    return new Blob([JSON.stringify(packageData)], { type: "application/json" });
  } catch (error) { console.error(error); throw new Error("Encryption failed"); }
};

export const decryptFile = async (encryptedBlob, password) => {
  try {
    const textData = await encryptedBlob.text();
    const packageData = JSON.parse(textData);
    const salt = base64ToArrayBuffer(packageData.salt);
    const iv = base64ToArrayBuffer(packageData.iv);
    const encryptedData = base64ToArrayBuffer(packageData.data);
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);
    const decryptedContent = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, aesKey, encryptedData);
    return { data: new Blob([decryptedContent], { type: packageData.mimeType }), fileName: packageData.fileName };
  } catch (error) { console.error(error); throw new Error("Incorrect password or corrupted file"); }
};
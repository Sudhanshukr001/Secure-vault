import React, { useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  Unlock,
  File,
  CheckCircle,
  Download,
  X,
  ShieldAlert,
  Image as ImageIcon,
  Key,
  Eye,
  EyeOff,
  FileSearch,
  RotateCcw,
} from 'lucide-react';
import { decryptFile, imageToPassword } from '../utils/crypto';
import { formatBytes, formatDateTime } from '../utils/format';

const FileSummary = ({ file, tone = 'primary', onRemove }) => {
  const tones = {
    primary: 'bg-primary/15 text-primary',
    secondary: 'bg-secondary/20 text-violet-300',
    yellow: 'bg-yellow-400/15 text-yellow-400',
    success: 'bg-success/15 text-success',
  };

  return (
    <div className="flex items-center gap-3 text-left">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <File className="w-6 h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-white truncate">{file.name}</p>
        <p className="text-xs text-slate-500">{formatBytes(file.size)} - {file.type || 'Unknown type'}</p>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors" aria-label="Remove file">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const Decrypt = () => {
  const [file, setFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useImageKey, setUseImageKey] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedData, setDecryptedData] = useState(null);
  const [decryptedAt, setDecryptedAt] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [keyDragActive, setKeyDragActive] = useState(false);

  const canDecrypt = file && (useImageKey ? keyFile : password) && !isDecrypting;

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      setDecryptedData(null);
      setError('');
    }
  }, []);

  const handleKeyDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setKeyDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleKeyDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setKeyDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setKeyFile(e.dataTransfer.files[0]);
      setError('');
    }
  }, []);

  const handleDecrypt = async () => {
    if (!canDecrypt) return;

    setIsDecrypting(true);
    setError('');

    try {
      const finalPassword = useImageKey ? await imageToPassword(keyFile) : password;
      const result = await decryptFile(file, finalPassword);
      setDecryptedData(result);
      setDecryptedAt(new Date());
    } catch (err) {
      console.error(err);
      setError('Decryption failed. Check that the file, password, or image key match the original encryption.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const downloadFile = () => {
    if (!decryptedData) return;
    const url = window.URL.createObjectURL(decryptedData.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = decryptedData.fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setKeyFile(null);
    setPassword('');
    setDecryptedData(null);
    setDecryptedAt(null);
    setError('');
  };

  return (
    <div className="py-10 lg:py-14">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <aside className="space-y-6 lg:sticky lg:top-32">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-secondary bg-secondary/15 border border-secondary/25 rounded-full px-3 py-1 mb-5">
              <FileSearch className="w-3.5 h-3.5" />
              Recovery workspace
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Restore secured files.</h1>
            <p className="text-slate-400 leading-relaxed max-w-xl">
              Open `.secure` packages with the same password or image key used during encryption.
            </p>
          </div>

          <div className="glass-panel rounded-xl border border-white/5 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Selected method</span>
              <span className="text-sm font-semibold text-white">{useImageKey ? 'Image key' : 'Password'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Package status</span>
              <span className={`text-sm font-semibold ${file ? 'text-success' : 'text-slate-500'}`}>{file ? 'Loaded' : 'Waiting'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Output</span>
              <span className={`text-sm font-semibold ${decryptedData ? 'text-success' : 'text-slate-500'}`}>{decryptedData ? 'Ready' : 'Locked'}</span>
            </div>
          </div>
        </aside>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Unlock package</h2>
              <p className="text-sm text-slate-500">Load the encrypted file and matching key.</p>
            </div>
            <Unlock className="w-6 h-6 text-secondary" />
          </div>

          <div className="p-6 md:p-8 bg-dark-900/70">
            <AnimatePresence mode="wait">
              {!decryptedData && (
                <Motion.div key="unlock" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-6">
                  <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`relative border border-dashed rounded-xl p-5 transition-all duration-300 ${dragActive ? 'border-secondary bg-secondary/10 scale-[1.01]' : file ? 'border-primary/40 bg-primary/5' : 'border-dark-border hover:border-slate-500 bg-dark-800/60'}`}>
                    <input type="file" id="file-upload-decrypt" accept=".secure,application/json" className="hidden" onChange={(e) => { setFile(e.target.files?.[0] || null); setDecryptedData(null); setError(''); }} />
                    {file ? (
                      <FileSummary file={file} tone="primary" onRemove={() => setFile(null)} />
                    ) : (
                      <label htmlFor="file-upload-decrypt" className="cursor-pointer flex min-h-32 flex-col items-center justify-center text-center">
                        <UploadCloud className={`w-11 h-11 mb-3 ${dragActive ? 'text-secondary' : 'text-slate-400'}`} />
                        <span className="text-white font-medium">Drop encrypted file or browse</span>
                        <span className="text-xs text-slate-500 mt-1">Expected extension: .secure</span>
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-2 bg-dark-800 p-1 rounded-xl border border-dark-border">
                    <button onClick={() => setUseImageKey(false)} className={`py-2.5 text-sm font-medium rounded-lg transition-all ${!useImageKey ? 'bg-white/10 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Password</button>
                    <button onClick={() => setUseImageKey(true)} className={`py-2.5 text-sm font-medium rounded-lg transition-all ${useImageKey ? 'bg-white/10 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Image key</button>
                  </div>

                  {useImageKey ? (
                    <div onDragEnter={handleKeyDrag} onDragLeave={handleKeyDrag} onDragOver={handleKeyDrag} onDrop={handleKeyDrop} className={`relative border border-dashed rounded-xl p-5 transition-all duration-300 ${keyDragActive ? 'border-yellow-400 bg-yellow-400/10 scale-[1.01]' : keyFile ? 'border-yellow-400/40 bg-yellow-400/5' : 'border-dark-border hover:border-yellow-400/50 bg-dark-800/60'}`}>
                      <input type="file" id="key-upload-decrypt" accept="image/*" className="hidden" onChange={(e) => { setKeyFile(e.target.files?.[0] || null); setError(''); }} />
                      {keyFile ? (
                        <FileSummary file={keyFile} tone="yellow" onRemove={() => setKeyFile(null)} />
                      ) : (
                        <label htmlFor="key-upload-decrypt" className="cursor-pointer flex min-h-28 flex-col items-center justify-center text-center">
                          <ImageIcon className={`w-9 h-9 mb-3 ${keyDragActive ? 'text-yellow-400' : 'text-slate-400'}`} />
                          <span className="text-white font-medium">Select matching key image</span>
                          <span className="text-xs text-slate-500 mt-1">Any byte change creates a different key.</span>
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="relative group">
                      <Key className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-secondary transition-colors" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter decryption password" className="w-full bg-dark-800 border border-dark-border rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all placeholder:text-slate-600" />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 p-1 text-slate-500 hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  )}

                  <button onClick={handleDecrypt} disabled={!canDecrypt} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${canDecrypt ? 'bg-secondary text-white hover:shadow-[0_0_24px_rgba(112,0,255,0.35)]' : 'bg-slate-700/70 text-slate-400 cursor-not-allowed'}`}>
                    {isDecrypting ? <><RotateCcw className="w-5 h-5 animate-spin" /> Unlocking...</> : <><Unlock className="w-5 h-5" /> Unlock file</>}
                  </button>

                  {error && (
                    <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 text-error bg-error/10 p-4 rounded-xl text-sm border border-error/20">
                      <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Access denied</p>
                        <p>{error}</p>
                      </div>
                    </Motion.div>
                  )}
                </Motion.div>
              )}

              {decryptedData && (
                <Motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-2">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-success/15 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-9 h-9 text-success" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Original file restored</h2>
                      <p className="text-slate-400 text-sm">{decryptedAt ? formatDateTime(decryptedAt) : 'Ready now'}</p>
                    </div>
                  </div>

                  <div className="bg-dark-800/80 border border-dark-border rounded-xl p-4 mb-6">
                    <FileSummary file={new File([decryptedData.data], decryptedData.fileName, { type: decryptedData.data.type })} tone="success" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <button onClick={downloadFile} className="py-4 bg-primary text-dark-900 font-bold rounded-xl hover:shadow-[0_0_22px_rgba(0,240,255,0.32)] transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Download original
                    </button>
                    <button onClick={reset} className="py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                      Decrypt another
                    </button>
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decrypt;

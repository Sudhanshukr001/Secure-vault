import React, { useMemo, useState, useCallback } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  Lock,
  File,
  CheckCircle,
  Download,
  X,
  AlertCircle,
  Image as ImageIcon,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  FileLock2,
  Sparkles,
} from 'lucide-react';
import { encryptFile, imageToPassword } from '../utils/crypto';
import { formatBytes, formatDateTime } from '../utils/format';

const evaluatePassword = (value) => {
  const checks = [
    value.length >= 12,
    /[A-Z]/.test(value) && /[a-z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['Weak', 'Basic', 'Good', 'Strong', 'Excellent'];

  return {
    score,
    label: value ? labels[score] : 'Waiting',
    checks,
  };
};

const accentStyles = {
  primary: 'bg-primary/15 text-primary',
  success: 'bg-success/15 text-success',
  yellow: 'bg-yellow-400/15 text-yellow-400',
};

const FileSummary = ({ file, accent = 'primary', onRemove }) => (
  <div className="flex items-center gap-3 text-left">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${accentStyles[accent]}`}>
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

const Encrypt = () => {
  const [file, setFile] = useState(null);
  const [keyFile, setKeyFile] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useImageKey, setUseImageKey] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedBlob, setEncryptedBlob] = useState(null);
  const [encryptedAt, setEncryptedAt] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [keyDragActive, setKeyDragActive] = useState(false);

  const strength = useMemo(() => evaluatePassword(password), [password]);
  const passwordsMatch = password && password === confirmPassword;
  const canEncrypt = file && (useImageKey ? keyFile : password && confirmPassword && passwordsMatch) && !isEncrypting;

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
      setEncryptedBlob(null);
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

  const handleEncrypt = async () => {
    if (!canEncrypt) return;

    setIsEncrypting(true);
    setError('');

    try {
      const finalPassword = useImageKey ? await imageToPassword(keyFile) : password;
      const resultBlob = await encryptFile(file, finalPassword);
      setEncryptedBlob(resultBlob);
      setEncryptedAt(new Date());
    } catch (err) {
      console.error('Encryption Failed:', err);
      setError('Encryption failed. Please try again with a valid file and key.');
    } finally {
      setIsEncrypting(false);
    }
  };

  const downloadFile = () => {
    if (!encryptedBlob) return;
    const url = window.URL.createObjectURL(encryptedBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name}.secure`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setKeyFile(null);
    setPassword('');
    setConfirmPassword('');
    setEncryptedBlob(null);
    setEncryptedAt(null);
    setError('');
  };

  return (
    <div className="py-10 lg:py-14">
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <aside className="space-y-6 lg:sticky lg:top-32">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-5">
              <FileLock2 className="w-3.5 h-3.5" />
              Encrypt workspace
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">Protect any local file.</h1>
            <p className="text-slate-400 leading-relaxed max-w-xl">
              Package documents, images, archives, and exports into a portable `.secure` file using browser-native cryptography.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {[
              ['Algorithm', 'AES-256-GCM'],
              ['Key setup', useImageKey ? 'Image hash' : 'Password PBKDF2'],
              ['Storage', 'Local only'],
            ].map(([label, value]) => (
              <div key={label} className="glass-panel rounded-xl p-4 border border-white/5">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">New encrypted package</h2>
              <p className="text-sm text-slate-500">Choose a file and a key method.</p>
            </div>
            <ShieldCheck className="w-6 h-6 text-success" />
          </div>

          <div className="p-6 md:p-8 bg-dark-900/70">
            <AnimatePresence mode="wait">
              {!encryptedBlob && (
                <Motion.div key="upload" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="space-y-6">
                  <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`relative border border-dashed rounded-xl p-5 transition-all duration-300 ${dragActive ? 'border-primary bg-primary/10 scale-[1.01]' : file ? 'border-success/40 bg-success/5' : 'border-dark-border hover:border-slate-500 bg-dark-800/60'}`}>
                    <input type="file" id="file-upload" className="hidden" onChange={(e) => { setFile(e.target.files?.[0] || null); setEncryptedBlob(null); setError(''); }} />
                    {file ? (
                      <FileSummary file={file} accent="success" onRemove={() => setFile(null)} />
                    ) : (
                      <label htmlFor="file-upload" className="cursor-pointer flex min-h-32 flex-col items-center justify-center text-center">
                        <UploadCloud className={`w-11 h-11 mb-3 ${dragActive ? 'text-primary' : 'text-slate-400'}`} />
                        <span className="text-white font-medium">Drop a file or browse</span>
                        <span className="text-xs text-slate-500 mt-1">No file leaves this browser.</span>
                      </label>
                    )}
                  </div>

                  <div className="grid grid-cols-2 bg-dark-800 p-1 rounded-xl border border-dark-border">
                    <button onClick={() => setUseImageKey(false)} className={`py-2.5 text-sm font-medium rounded-lg transition-all ${!useImageKey ? 'bg-white/10 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Password</button>
                    <button onClick={() => setUseImageKey(true)} className={`py-2.5 text-sm font-medium rounded-lg transition-all ${useImageKey ? 'bg-white/10 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}>Image key</button>
                  </div>

                  {useImageKey ? (
                    <div onDragEnter={handleKeyDrag} onDragLeave={handleKeyDrag} onDragOver={handleKeyDrag} onDrop={handleKeyDrop} className={`relative border border-dashed rounded-xl p-5 transition-all duration-300 ${keyDragActive ? 'border-yellow-400 bg-yellow-400/10 scale-[1.01]' : keyFile ? 'border-yellow-400/40 bg-yellow-400/5' : 'border-dark-border hover:border-yellow-400/50 bg-dark-800/60'}`}>
                      <input type="file" id="key-upload" accept="image/*" className="hidden" onChange={(e) => { setKeyFile(e.target.files?.[0] || null); setError(''); }} />
                      {keyFile ? (
                        <FileSummary file={keyFile} accent="yellow" onRemove={() => setKeyFile(null)} />
                      ) : (
                        <label htmlFor="key-upload" className="cursor-pointer flex min-h-28 flex-col items-center justify-center text-center">
                          <ImageIcon className={`w-9 h-9 mb-3 ${keyDragActive ? 'text-yellow-400' : 'text-slate-400'}`} />
                          <span className="text-white font-medium">Select key image</span>
                          <span className="text-xs text-slate-500 mt-1">The exact same image is required to decrypt.</span>
                        </label>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create password" className="w-full bg-dark-800 border border-dark-border rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600" />
                        <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-3 p-1 text-slate-500 hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>

                      <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className={`w-full bg-dark-800 border rounded-xl py-3 px-4 text-white focus:outline-none transition-all placeholder:text-slate-600 ${confirmPassword && !passwordsMatch ? 'border-error focus:border-error' : 'border-dark-border focus:border-primary focus:ring-1 focus:ring-primary'}`} />

                      <div className="rounded-xl bg-dark-800/70 border border-dark-border p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-slate-400">Password strength</span>
                          <span className={`text-sm font-semibold ${strength.score >= 3 ? 'text-success' : password ? 'text-yellow-400' : 'text-slate-500'}`}>{strength.label}</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {[0, 1, 2, 3].map((bar) => (
                            <div key={bar} className={`h-1.5 rounded-full ${strength.score > bar ? 'bg-primary' : 'bg-white/10'}`} />
                          ))}
                        </div>
                        {confirmPassword && !passwordsMatch && <p className="text-xs text-error mt-3">Passwords do not match.</p>}
                      </div>
                    </div>
                  )}

                  <button onClick={handleEncrypt} disabled={!canEncrypt} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${canEncrypt ? 'bg-primary text-dark-900 hover:bg-primary-hover hover:shadow-[0_0_24px_rgba(0,240,255,0.35)]' : 'bg-slate-700/70 text-slate-400 cursor-not-allowed'}`}>
                    {isEncrypting ? <><Sparkles className="w-5 h-5 animate-pulse" /> Encrypting...</> : <><Lock className="w-5 h-5" /> Secure file</>}
                  </button>

                  {error && (
                    <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-error bg-error/10 border border-error/20 p-4 rounded-xl text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{error}</span>
                    </Motion.div>
                  )}
                </Motion.div>
              )}

              {encryptedBlob && (
                <Motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-2">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-success/15 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="w-9 h-9 text-success" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">Encrypted package ready</h2>
                      <p className="text-slate-400 text-sm">{encryptedAt ? formatDateTime(encryptedAt) : 'Ready now'}</p>
                    </div>
                  </div>

                  <div className="bg-dark-800/80 border border-dark-border rounded-xl p-4 mb-6">
                    <FileSummary file={new File([encryptedBlob], `${file.name}.secure`, { type: encryptedBlob.type })} accent="primary" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <button onClick={downloadFile} className="py-4 bg-success text-dark-900 font-bold rounded-xl hover:shadow-[0_0_22px_rgba(0,255,157,0.32)] transition-all flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Download file
                    </button>
                    <button onClick={reset} className="py-4 bg-white/5 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                      Encrypt another
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

export default Encrypt;

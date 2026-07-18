import { useState, useRef, useEffect } from 'react';
import { X, Plus, Image, Loader2, Camera, Zap } from 'lucide-react';
import { addFood } from '../../utils/storage.js';

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bytes = atob(parts[1]);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

export default function AddFoodModal({ onClose, onAdd, dateKey }) {
  const [mode, setMode] = useState('picker');
  const [photo, setPhoto] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanItems, setScanItems] = useState(null);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [camStream, setCamStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const galleryRef = useRef(null);
  const camInputRef = useRef(null);

  const handleScan = async (file) => {
    setScanning(true);
    setScanError('');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      let data;
      try {
        const res = await fetch('/api/scan-food', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });
        data = await res.json();
      } catch {
        setScanError('Network error. Try again.');
        setScanning(false);
        return;
      }
      if (!data.ok) {
        setScanError(data.error || 'Scan failed');
        setScanning(false);
      } else if (data.items) {
        setScanItems(data.items.map(item => ({ ...item, qty: item.quantity || 1 })));
        setScanning(false);
      } else {
        setScanItems([{
          food_name: data.food_name || 'Unknown',
          quantity: 1, unit: 'serving',
          calories: data.calories || 0,
          protein_g: data.protein || 0,
          carbs_g: data.carbs || 0,
          fat_g: data.fat || 0,
          qty: 1,
        }]);
        setScanning(false);
      }
    };
    reader.onerror = () => { setScanError('Failed to read file'); setScanning(false); };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1080 }, height: { ideal: 1920 } } });
      setCamStream(stream);
      setMode('camera');
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch {
      camInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (camStream) { camStream.getTracks().forEach(t => t.stop()); setCamStream(null); }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 1080;
    canvas.height = video.videoHeight || 1920;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const blob = dataUrlToBlob(dataUrl);
    stopCamera();
    setPhoto(URL.createObjectURL(blob));
    const file = new File([blob], 'food.jpg', { type: 'image/jpeg' });
    handleScan(file);
  };

  const handleGalleryPick = () => galleryRef.current?.click();

  const updateQty = (idx, delta) => {
    setScanItems(prev => prev.map((item, i) => i === idx ? { ...item, qty: Math.max(0.25, item.qty + delta) } : item));
  };

  const getItemCals = (item) => Math.round((item.calories / item.quantity) * item.qty);
  const getItemProtein = (item) => Math.round((item.protein_g / item.quantity) * item.qty);
  const getItemCarbs = (item) => Math.round((item.carbs_g / item.quantity) * item.qty);
  const getItemFat = (item) => Math.round((item.fat_g / item.quantity) * item.qty);

  const totalCals = scanItems ? scanItems.reduce((s, i) => s + getItemCals(i), 0) : 0;
  const totalProtein = scanItems ? scanItems.reduce((s, i) => s + getItemProtein(i), 0) : 0;
  const totalCarbs = scanItems ? scanItems.reduce((s, i) => s + getItemCarbs(i), 0) : 0;
  const totalFat = scanItems ? scanItems.reduce((s, i) => s + getItemFat(i), 0) : 0;

  const handleAddAll = () => {
    scanItems.forEach(item => {
      addFood(dateKey, {
        name: item.food_name,
        calories: getItemCals(item),
        protein: getItemProtein(item),
        carbs: getItemCarbs(item),
        fat: getItemFat(item),
      });
    });
    onClose();
  };

  const reset = () => { setPhoto(null); setScanItems(null); setName(''); setCalories(''); setProtein(''); setCarbs(''); setFat(''); setScanError(''); setMode('picker'); };

  const canSubmit = name.trim() && calories && Number(calories) > 0;
  const inputClass = "w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 text-sm outline-none focus:border-white/20 transition-colors placeholder:text-white/20";

  if (mode === 'camera' && camStream) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-black">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <button onClick={() => { stopCamera(); reset(); onClose(); }} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <X size={18} className="text-white" />
          </button>
          <span className="text-white text-sm font-semibold">Scan Food</span>
          <div className="w-9" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center justify-center gap-10 pb-12 pt-4">
          <button onClick={handleGalleryPick} className="flex flex-col items-center gap-1.5">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Image size={20} className="text-white" />
            </div>
            <span className="text-white/70 text-[10px] font-medium">Gallery</span>
          </button>
          <button onClick={capturePhoto} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform">
            <div className="w-14 h-14 rounded-full bg-white" />
          </button>
          <div className="w-12" />
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  if (scanning) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
        <Loader2 size={40} className="text-white animate-spin mb-4" />
        <p className="text-white font-semibold text-base">Scanning your food...</p>
        <p className="text-white/60 text-sm mt-1">Using AI to identify nutrition</p>
      </div>
    );
  }

  if (scanError && !scanItems) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80">
        <Camera size={40} className="text-white/50 mb-4" />
        <p className="text-red-400 font-medium mb-1">Scan failed</p>
        <p className="text-white/60 text-sm mb-4 max-w-xs text-center">{scanError}</p>
        <button onClick={reset} className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm">Try Again</button>
        <button onClick={onClose} className="text-white/60 text-sm mt-3">Cancel</button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1c1c1e] rounded-t-[32px] animate-fadeIn max-w-md mx-auto border-t border-white/[0.06]" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <h2 className="text-white/90 font-semibold text-lg">
            {scanItems ? 'Adjust Quantities' : photo ? 'Scan Result' : 'Add Food'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
            <X size={16} className="text-white/50" />
          </button>
        </div>

        {photo && (
          <div className="px-6 pb-2">
            <img src={photo} alt="Food" className="w-full h-36 object-cover rounded-2xl" />
            <button onClick={reset} className="text-xs text-accent font-medium mt-1">Retake photo</button>
          </div>
        )}

        {scanItems && (
          <div className="px-6 pb-4 space-y-3">
            {scanItems.map((item, idx) => (
              <div key={idx} className="bg-black/40 border border-white/[0.06] rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold text-white/80">{item.food_name}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">
                      {getItemCals(item)} cal · P {getItemProtein(item)}g · C {getItemCarbs(item)}g · F {getItemFat(item)}g
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/30">{item.unit}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(idx, -0.5)} className="w-7 h-7 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center text-lg font-medium text-white/50 leading-none hover:bg-white/10 transition-colors">–</button>
                    <span className="text-sm font-semibold text-white/80 min-w-[40px] text-center">{item.qty}</span>
                    <button onClick={() => updateQty(idx, 0.5)} className="w-7 h-7 rounded-full bg-white/5 border border-white/[0.06] flex items-center justify-center text-lg font-medium text-white/50 leading-none hover:bg-white/10 transition-colors">+</button>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-white/10 backdrop-blur-xl border border-white/[0.06] rounded-2xl p-3.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-white/80">Total</span>
              <span className="text-sm font-bold text-white/90">{totalCals} cal · P {totalProtein}g · C {totalCarbs}g · F {totalFat}g</span>
            </div>

            <div className="flex gap-2">
              <button onClick={reset} className="flex-1 py-3 rounded-2xl border border-white/[0.08] text-white/50 font-semibold text-sm hover:bg-white/5 transition-colors">Retake</button>
              <button onClick={handleAddAll} className="flex-[2] py-3 rounded-2xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-1.5 hover:bg-white/90 transition-colors">
                <Plus size={16} />
                Add All ({totalCals} cal)
              </button>
            </div>
          </div>
        )}

        {!photo && !scanItems && (
          <div className="px-6 pb-8 space-y-6">
            {/* Center camera button */}
            <input ref={camInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) { setPhoto(URL.createObjectURL(f)); handleScan(f); }}} />
            <div className="flex justify-center pt-2">
              <button onClick={startCamera} className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 active:scale-95 transition-all shadow-lg shadow-white/10">
                <Camera size={32} />
              </button>
            </div>
            
            {/* Bottom bar with Gallery and AI */}
            <div className="flex items-center gap-3">
              <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files[0]; if (f) { setPhoto(URL.createObjectURL(f)); handleScan(f); }}} />
              <button onClick={handleGalleryPick} className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/[0.06] text-white/60 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <Image size={18} /> Gallery
              </button>
              
              <button className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/[0.06] text-white/60 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                <Zap size={18} /> Type AI
              </button>
            </div>
            
            <div className="flex items-center gap-3 px-1 pb-1 pt-2">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-white/30 font-medium">or enter manually</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
          </div>
        )}

        {!scanItems && (
          <>
            <div className="flex items-center gap-3 px-6 pb-1 pt-2">
              <div className="flex-1 h-px bg-white/[0.06]" />
              <span className="text-xs text-white/30 font-medium">or enter manually</span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); if (!canSubmit) return; onAdd({ name: name.trim(), calories: Number(calories), protein: Number(protein) || 0, carbs: Number(carbs) || 0, fat: Number(fat) || 0 }); }} className="px-6 pb-8 pt-2 space-y-3.5">
              <input className={inputClass} placeholder="Food name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className={inputClass} type="number" placeholder="Calories" value={calories} onChange={(e) => setCalories(e.target.value)} />
              <div className="grid grid-cols-3 gap-2.5">
                <input className={inputClass} type="number" placeholder="Protein" value={protein} onChange={(e) => setProtein(e.target.value)} />
                <input className={inputClass} type="number" placeholder="Carbs" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
                <input className={inputClass} type="number" placeholder="Fat" value={fat} onChange={(e) => setFat(e.target.value)} />
              </div>
              <button type="submit" disabled={!canSubmit} className={`w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${canSubmit ? 'bg-white text-black' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}>
                <Plus size={18} /> Add Entry
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}

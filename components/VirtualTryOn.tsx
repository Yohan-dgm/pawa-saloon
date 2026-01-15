import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Sparkles, RefreshCw, X, Share2, Info, AlertCircle } from 'lucide-react';
import { geminiService } from '../geminiService';
import { Hairstyle, AnalysisResult } from '../types';
import toast from 'react-hot-toast';

const VirtualTryOn: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lookbook, setLookbook] = useState<string[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const [recommendations, setRecommendations] = useState<Hairstyle[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        setImage(base64);
        setResult(null);
        setRecommendations([]);
        setAnalysisResult(null);
        handleRecommend(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecommend = async (base64Image: string) => {
    setIsAnalyzing(true);
    try {
      const rawBase64 = base64Image.split(',')[1];
      const res = await geminiService.analyzeFaceImage(rawBase64);
      
      if (!res.faceDetected) {
        window.alert("Error: No face detected. Please upload a clear portrait showing your face.");
        setImage(null);
        return;
      }

      setAnalysisResult(res);
      setRecommendations(res.recommendations || []);
      toast.success("The Oracle has found your perfect matches!");
    } catch (err) {
      console.error("Recommendation failed:", err);
      toast.error("The Oracle is momentarily clouded. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerTransformation = async (selectedStyle: Hairstyle) => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setLoadingStep(0);

    const steps = [
      "Analyzing facial geometry...",
      "Identifying hair boundaries...",
      "Sculpting neural aesthetic...",
      "Applying studio lighting...",
      "Finalizing manifestation..."
    ];

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);

    try {
      // Use the imagePrompt for the generation and pass the original image as reference
      const generated = await geminiService.generateHairstylePreview(selectedStyle.imagePrompt, image);
      if (generated) {
        setResult(generated);
        setLookbook(prev => [generated, ...prev].slice(0, 4));
        toast.success(`Manifested: ${selectedStyle.name}`);
      } else {
        throw new Error("No image generated");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("The Oracle is currently in deep meditation. Please try again.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-light tracking-[0.2em] text-atelier-charcoal uppercase leading-tight">
            AI <span className="font-bold text-atelier-clay italic">hairstyle recommendation </span>
          </h2>
          <p className="text-atelier-taupe text-[9px] font-bold uppercase tracking-[0.4em]">
            Neural gender-aware styling & aesthetic visualization
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-atelier-sand shadow-sm">
          <Info className="w-3.5 h-3.5 text-atelier-clay" />
          <p className="text-[8px] font-bold text-atelier-taupe uppercase tracking-widest">
            {isAnalyzing ? "Oracle is analyzing..." : "Front-facing portraits yield truest results"}
          </p>
        </div>
      </div>

      {/* Recommendations - Full Width Top */}
      <AnimatePresence>
        {image && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-4"
          >
            {analysisResult && (
              <div className="flex items-center gap-4 bg-white/50 px-6 py-3 rounded-3xl border border-atelier-sand/50 shadow-sm overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 text-[9px] font-black text-atelier-clay uppercase tracking-[0.3em] shrink-0 border-r border-atelier-sand pr-4">
                  <Sparkles className="w-3 h-3" />
                  {analysisResult.gender?.toUpperCase()} {analysisResult.faceShape}
                </div>
                <div className="flex gap-2 shrink-0">
                  {analysisResult.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="px-2 py-0.5 bg-atelier-cream rounded-full text-[7px] font-bold text-atelier-taupe uppercase tracking-widest border border-atelier-sand">
                      {f}
                    </span>
                  ))}
                </div>
                <span className="text-[9px] font-bold text-atelier-charcoal uppercase tracking-widest ml-auto shrink-0">{analysisResult.skinTone} Tone</span>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-[9px] font-black text-atelier-clay uppercase tracking-[0.4em] px-2 flex items-center justify-between">
                <span>Recommended Rituals</span>
              </p>
              
              <div className="relative min-h-[60px]">
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {recommendations.map(hair => (
                      <motion.button
                        key={hair.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => triggerTransformation(hair)}
                        className="text-left bg-white p-3 rounded-2xl border border-atelier-sand shadow-sm hover:border-atelier-clay hover:shadow-md transition-all group relative overflow-hidden"
                        disabled={loading}
                      >
                        <div className="relative z-10">
                          <h4 className="text-[9px] font-bold text-atelier-charcoal uppercase tracking-widest group-hover:text-atelier-clay truncate">{hair.name}</h4>
                          <div className="flex items-center gap-1.5 text-[7px] font-bold text-atelier-clay uppercase tracking-widest opacity-60 mt-1">
                            <Sparkles className="w-2 h-2" /> Select
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="w-full bg-white/30 backdrop-blur-sm rounded-[30px] border border-atelier-sand/50 p-6 flex flex-col items-center justify-center space-y-3 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-atelier-sand/10 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    <div className="relative flex items-center gap-4">
                      <div className="relative">
                        <RefreshCw className="w-6 h-6 text-atelier-clay animate-spin" />
                        <div className="absolute inset-0 blur-md bg-atelier-clay/20 animate-pulse rounded-full" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-atelier-charcoal uppercase tracking-[0.3em] ">Consulting the Oracle</p>
                        <p className="text-[7px] text-atelier-taupe font-bold uppercase tracking-widest">Identifying your unique aesthetic...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-items-center h-auto">
        {/* Left column: Source Image */}
        <div className="space-y-4 w-full max-w-xl">
          <div className="relative aspect-square md:aspect-[4/5] bg-white rounded-[40px] border border-atelier-sand shadow-sm overflow-hidden group max-h-[650px] w-full flex items-center justify-center mx-auto">
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover animate-in fade-in duration-700" alt="Source" />
                
                {/* Scanning Animation */}
                {(isAnalyzing || loading) && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-1 bg-atelier-clay/60 shadow-[0_0_15px_rgba(176,141,121,0.8)] animate-scan relative z-20" />
                    <div className="absolute inset-0 bg-atelier-clay/5 animate-pulse" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => { setImage(null); setResult(null); setRecommendations([]); setAnalysisResult(null); }}
                    className="bg-white/90 p-4 rounded-full hover:bg-white hover:scale-110 transition-all shadow-2xl"
                  >
                    <X className="w-5 h-5 text-atelier-clay" />
                  </button>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-atelier-nude rounded-full flex items-center justify-center shadow-sm border border-atelier-sand">
                  <Camera className="w-8 h-8 text-atelier-clay" />
                </div>
                <div className="space-y-2">
                  <p className="text-base font-light text-atelier-charcoal uppercase tracking-widest">Initiate Visualization</p>
                  <p className="text-[9px] text-atelier-taupe font-bold uppercase tracking-[0.2em] max-w-[160px] mx-auto leading-relaxed">
                    Upload your essence for transformation
                  </p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-atelier-charcoal text-white px-8 py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-atelier-clay transition-all shadow-xl flex items-center gap-3"
                >
                  <Upload className="w-4 h-4" /> Select Portrait
                </button>
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            )}
          </div>
        </div>

        {/* Right column: Target Result */}
        <div className="space-y-4 w-full max-w-xl">
          <div className="relative aspect-square md:aspect-[4/5] bg-atelier-charcoal rounded-[40px] overflow-hidden shadow-2xl flex items-center justify-center border-4 border-atelier-nude max-h-[650px] w-full mx-auto">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            
            {result ? (
              <motion.img 
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                src={result} 
                className="w-full h-full object-cover relative z-10" 
                alt="Transformation"
              />
            ) : (
              <div className="text-center space-y-4 p-8 relative z-10">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                  <Sparkles className="w-8 h-8 text-atelier-clay" />
                </div>
                <div className="space-y-1">
                  <p className="text-atelier-sand/40 text-[9px] font-bold uppercase tracking-[0.5em]">Neural Canvas</p>
                  <p className="text-atelier-sand/20 text-[8px] font-medium uppercase tracking-widest max-w-[150px] mx-auto">
                    Transformations will materialize here
                  </p>
                </div>
              </div>
            )}
            
            <AnimatePresence>
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-atelier-charcoal/90 backdrop-blur-md z-20 flex flex-col items-center justify-center text-white space-y-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 border-2 border-atelier-clay/30 rounded-full animate-ping absolute inset-0" />
                    <div className="w-20 h-20 border-t-2 border-atelier-clay rounded-full animate-spin" />
                  </div>
                  <div className="text-center space-y-1.5 px-6">
                    <p className="text-lg font-light tracking-[0.3em] uppercase">Sculpting</p>
                    <p className="text-[8px] text-atelier-clay font-bold uppercase tracking-[0.4em] animate-pulse">
                      {[
                        "Analyzing facial geometry...",
                        "Identifying hair boundaries...",
                        "Sculpting neural aesthetic...",
                        "Applying studio lighting...",
                        "Finalizing manifestation..."
                      ][loadingStep]}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {result && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <button 
                  onClick={() => setResult(null)}
                  className="flex-1 bg-white border border-atelier-sand py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest text-atelier-charcoal hover:bg-atelier-cream transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
                <button 
                  className="flex-1 bg-atelier-charcoal text-white py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-atelier-clay transition-all flex items-center justify-center gap-2 shadow-lg"
                  onClick={() => alert('Ritual saved to your private lookbook.')}
                >
                  <Share2 className="w-3.5 h-3.5" /> Archive
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compact Lookbook & Wisdom */}
      <div className="flex flex-col lg:flex-row gap-6">
        {lookbook.length > 0 && (
          <div className="flex-1 bg-white rounded-[32px] p-6 border border-atelier-sand shadow-sm flex items-center gap-6 overflow-hidden">
            <h4 className="text-[9px] font-black text-atelier-clay uppercase tracking-[0.3em] shrink-0 rotate-180 [writing-mode:vertical-lr]">Lookbook</h4>
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {lookbook.map((img, idx) => (
                <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-atelier-sand cursor-pointer hover:border-atelier-clay shrink-0" onClick={() => setResult(img)}>
                  <img src={img} className="w-full h-full object-cover" alt={`Look ${idx}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* <div className="flex-1 bg-atelier-nude/30 rounded-[32px] p-6 border border-atelier-sand/50 flex flex-col justify-center">
          <h4 className="text-[9px] font-black text-atelier-clay uppercase tracking-[0.3em] mb-2">Oracle Wisdom</h4>
          <p className="text-[10px] text-atelier-taupe leading-relaxed italic">
            "The Oracle predicts, but your essence is destiny."
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default VirtualTryOn;

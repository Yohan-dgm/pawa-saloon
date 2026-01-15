import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, FileText, Scale } from 'lucide-react';

export type PolicyType = 'privacy' | 'legal' | 'terms';

interface PolicyModalsProps {
  type: PolicyType;
  onClose: () => void;
}

const PolicyModals: React.FC<PolicyModalsProps> = ({ type, onClose }) => {
  const content = {
    privacy: {
      title: 'Privacy Policy',
      icon: <Shield className="w-12 h-12 text-atelier-clay" />,
      text: (
        <div className="space-y-6 text-atelier-taupe text-sm leading-relaxed">
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Introduction</h4>
            <p>At PAWA ATELIER, we value your privacy. This policy explains how we collect, use, and protect your personal information when you use our sanctuary services.</p>
          </section>
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Data Collection</h4>
            <p>We collect information such as your name, contact details, and appointment history to provide a personalized experience. Your hairstyle preferences and AI styling data are encrypted and stored securely.</p>
          </section>
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Service Usage</h4>
            <p>Information collected is used solely for service improvement, appointment management, and providing the neural styling recommendations you request.</p>
          </section>
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Your Rights</h4>
            <p>You have the right to request access to your data, correction of inaccuracies, or deletion of your profile at any time.</p>
          </section>
        </div>
      )
    },
    legal: {
      title: 'Legal Notice',
      icon: <Scale className="w-12 h-12 text-atelier-clay" />,
      text: (
        <div className="space-y-6 text-atelier-taupe text-sm leading-relaxed">
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Ownership</h4>
            <p>PAWA ATELIER is a registered trademark. All content on this platform, including designs, text, and neural style algorithms, is the exclusive property of PAWA ATELIER LUXURY.</p>
          </section>
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Compliance</h4>
            <p>Our operations comply with local regulations and industry standards for salon management and data protection.</p>
          </section>
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Disclaimer</h4>
            <p>While our AI styling tools provide high-precision recommendations, the final physical implementation is subject to artist consultation and individual hair characteristics.</p>
          </section>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      icon: <FileText className="w-12 h-12 text-atelier-clay" />,
      text: (
        <div className="space-y-6 text-atelier-taupe text-sm leading-relaxed">
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Appointments</h4>
            <p>Please arrive 10 minutes prior to your scheduled ritual. Late arrivals may result in shortened service time or rescheduling.</p>
          </section>
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Cancellations</h4>
            <p>We require at least 24 hours notice for cancellations or modifications. Failure to do so may incur a fee of 50% of the scheduled ritual value.</p>
          </section>
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Payments</h4>
            <p>We accept major credit cards and cash. All prices are inclusive of applicable taxes, including SSCL where mandatory.</p>
          </section>
          <section>
            <h4 className="font-bold text-atelier-charcoal uppercase tracking-widest mb-2">Children & Guests</h4>
            <p>To maintain our sanctuary's tranquility, we request that you attend your appointment alone unless otherwise agreed during consultation.</p>
          </section>
        </div>
      )
    }
  };

  const current = content[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-atelier-charcoal/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="bg-white rounded-[50px] shadow-2xl max-w-2xl w-full p-12 md:p-16 border border-atelier-sand relative overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 -z-10 rotate-12">
          {current.icon}
        </div>

        <div className="flex justify-between items-start mb-10 shrink-0">
          <div>
            <h2 className="text-3xl font-light tracking-[0.2em] text-atelier-charcoal uppercase leading-tight">
              PAWA <span className="font-bold text-atelier-clay">{current.title}</span>
            </h2>
            <p className="text-[10px] text-atelier-taupe font-bold uppercase tracking-[0.3em] mt-2">The guidelines of our sanctuary</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-atelier-cream rounded-full transition-colors border border-atelier-sand shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          {current.text}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-atelier-charcoal text-white rounded-3xl font-bold uppercase tracking-[0.4em] text-[10px] shadow-xl hover:bg-atelier-clay transition-all mt-10 shrink-0"
        >
          I Understand
        </button>
      </motion.div>
    </div>
  );
};

export default PolicyModals;

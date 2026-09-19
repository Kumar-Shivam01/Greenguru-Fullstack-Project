import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Sparkles,
  ScanLine,
  ScanEye,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Droplets,
  Sun,
  Thermometer,
  Wind,
  PawPrint,
  FlaskConical,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Check,
  Plus,
  Clock,
  Activity,
  Layers,
  HelpCircle,
  Menu,
  X,
  Compass,
  ArrowUpRight,
  Heart,
  RefreshCw
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sick-tulsi');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [wateredCards, setWateredCards] = useState({});
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Demo Sandbox Plant Cases
  const demoCases = {
    'Swiss-Cheese-Plant': {
      id: 'Swiss-Cheese-Plant',
      name: 'Monstera Deliciosa',
      subtitle: 'Swiss Cheese Plant • Indoor Foliage',
      badge: 'Thriving & Healthy',
      badgeType: 'healthy',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      headline: 'Optimal Cellular Turgor',
      description: 'Zero foliar necrotic lesions detected. Fenestrations are balanced, stomata respiration active, and leaf surface free of pathogen spores.',
      confidence: 99,
      hotspotLabel: 'Healthy Fenestration Tissue',
      hotspotX: '48%',
      hotspotY: '38%',
      image: '/swiss-cheese-plant.jpg',
      actions: [
        'Maintain indirect morning sunlight (4-6 hrs)',
        'Bi-weekly foliar misting to preserve 65% humidity',
        'Next scheduled hydration in 5 days'
      ],
      tags: ['No Pathogens', 'High Vigor', 'Balanced NPK']
    },
    'dehydrated-aloe': {
      id: 'dehydrated-aloe',
      name: 'Aloe Barbadensis',
      subtitle: 'Medicinal Aloe • Succulent Specimen',
      badge: 'Hydration Deficit',
      badgeType: 'warning',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      headline: 'Cellular Desiccation Warning',
      description: 'Parenchyma gel tissue thinning with concave curl on lower leaf margin. Cellular dehydration detected prior to visible chlorophyll breakdown.',
      confidence: 94,
      hotspotLabel: 'Foliar Marginal Thinning',
      hotspotX: '35%',
      hotspotY: '52%',
      image: '/aloe.png',
      actions: [
        'Deep-soak bottom irrigation with filtered water',
        'Shield from intense afternoon solar radiation for 48h',
        'Verify root aerator substrate porosity'
      ],
      tags: ['Moisture < 15%', 'Parenchyma Stress', 'Remediable']
    },
    'sick-tulsi': {
      id: 'sick-tulsi',
      name: 'Ocimum Sanctum (Tulsi)',
      subtitle: 'Holy Basil • Aromatic Herb',
      badge: 'Pathogen Detected',
      badgeType: 'danger',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      headline: 'Aphid Infestation & Honeydew',
      description: 'Aphids colonizing the abaxial petiole nodes, extracting phloem sap and depositing sticky secretions that invite sooty foliar molds.',
      confidence: 92,
      hotspotLabel: 'Aphid Colony Cluster',
      hotspotX: '62%',
      hotspotY: '45%',
      image: '/tulsi.jpg',
      actions: [
        'Isolate plant immediately to prevent cross-colony spread',
        'Mechanical foliar rinse with dilute organic neem emulsion',
        'Prune heavily infested terminal shoots'
      ],
      tags: ['Pest Colony', 'Foliar Curling', 'Priority Action']
    }
  };

  // Mock Garden Showcase Plants
  const gardenPlants = [
    {
      id: 'p1',
      nickname: 'Verdant Queen',
      species: 'Monstera Deliciosa',
      status: 'Healthy',
      statusColor: 'emerald',
      confidence: 98,
      waterDueInDays: 4,
      location: 'Living Room'
    },
    {
      id: 'p2',
      nickname: 'Guardian Spike',
      species: 'Sansevieria Trifasciata',
      status: 'Healthy',
      statusColor: 'emerald',
      confidence: 96,
      waterDueInDays: 12,
      location: 'Home Office'
    },
    {
      id: 'p3',
      nickname: 'Zen Sanctuary',
      species: 'Ficus Lyrata (Fiddle Leaf)',
      status: 'Needs Care',
      statusColor: 'amber',
      confidence: 91,
      waterDueInDays: 0,
      location: 'Balcony Solarium'
    },
    {
      id: 'p4',
      nickname: 'Sacred Bloom',
      species: 'Ocimum Tenuiflorum',
      status: 'Sick',
      statusColor: 'rose',
      confidence: 93,
      waterDueInDays: 1,
      location: 'Kitchen Terrace'
    }
  ];

  const handleWaterClick = (id) => {
    setWateredCards((prev) => ({
      ...prev,
      [id]: true
    }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#080F0A] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      {/* Radial Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-600/15 via-emerald-900/5 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-[600px] h-[600px] bg-emerald-700/10 blur-[160px] pointer-events-none -z-10" />

      {/* ── 1. Floating Glass Navbar ───────────────────────── */}
      <nav className="fixed top-5 inset-x-0 z-50 max-w-6xl mx-auto px-4">
        <div className="bg-[#121E16]/80 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#080F0A] rounded-[10px] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-emerald-400 fill-emerald-400/20 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white">
                Green<span className="text-emerald-400">Guru</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ✦ AI
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">
              How it Works
            </a>
            <a href="#care" className="hover:text-emerald-400 transition-colors">
              Plant Care
            </a>
            <a href="#garden" className="hover:text-emerald-400 transition-colors">
              Garden Hub
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-4 py-2 rounded-full transition-colors hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-[#080F0A] bg-gradient-to-r from-emerald-400 to-[#A7F3D0] hover:brightness-110 px-5 py-2 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(34,197,94,0.3)] flex items-center gap-1.5"
            >
              Get Started
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-2 bg-[#121E16]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4"
            >
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-emerald-400 py-1"
              >
                Features
              </a>
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-emerald-400 py-1"
              >
                How it Works
              </a>
              <a
                href="#care"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-emerald-400 py-1"
              >
                Plant Care
              </a>
              <a
                href="#garden"
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-emerald-400 py-1"
              >
                Garden Hub
              </a>
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="text-center py-2 text-slate-300 hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-center py-2.5 font-semibold text-[#080F0A] bg-emerald-400 rounded-xl"
                >
                  Get Started ↗
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── 2. Hero Section ─────────────────────────────────── */}
      <section className="pt-36 pb-20 md:pt-44 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            {/* AI Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_0_20px_rgba(34,197,94,0.15)] mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI-Powered Botanical Health Intelligence</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white"
            >
              Instant{' '}
              <span className="text-emerald-400 inline-flex items-center gap-1">
                ✦
              </span>{' '}
              Plant Health Check.
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl"
            >
              Proprietary computer vision models diagnose foliar pathogens, severe pest infestations,
              and hydration stress in under 2 seconds. Receive clinical botanical care plans to revive your collection.
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#A7F3D0] text-[#080F0A] hover:bg-[#86efac] font-bold text-base transition-all duration-300 shadow-[0_0_30px_rgba(167,243,208,0.3)] flex items-center justify-center gap-2.5 group hover:scale-[1.02]"
              >
                <ScanLine className="w-5 h-5 text-[#080F0A] group-hover:rotate-90 transition-transform duration-300" />
                Scan your plants
              </Link>

              {/* Video Preview Card */}
              <button
                onClick={() => setVideoModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[rgba(18,30,22,0.65)] hover:bg-[rgba(26,44,32,0.8)] border border-white/10 backdrop-blur-xl flex items-center gap-3.5 text-left transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400 ml-0.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                    See How it Works
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> 3m 32s walkthrough
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 w-full max-w-lg"
            >
              <div>
                <div className="text-2xl font-black text-white">99.4%</div>
                <div className="text-xs text-slate-400 mt-1">Diagnostic Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400">1.2s</div>
                <div className="text-xs text-slate-400 mt-1">Vision Inference</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">150k+</div>
                <div className="text-xs text-slate-400 mt-1">Plants Healed</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: AR Viewfinder & Foliage Scanner */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative w-full max-w-lg rounded-3xl overflow-hidden border border-white/15 bg-[rgba(18,30,22,0.65)] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-2 group"
            >
              {/* Inner Image Viewport */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#0A140E]">
                {/* User uploaded foliage image */}
                <img
                  src="/hero-plant.jpg"
                  alt="Living Room Foliage Scanner"
                  className="w-full h-full object-cover brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />

                {/* Cyber Grid Texture Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,197,94,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* AR Viewfinder Corner Brackets */}
                <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
                <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

                {/* Animated Vertical Laser Scanning Beam */}
                <motion.div
                  animate={{
                    y: ['0%', '300%', '0%']
                  }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-emerald-400/0 via-emerald-400/30 to-emerald-400/0 border-b border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] pointer-events-none z-10"
                />

                {/* Scanner Target Reticle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-16 h-16 rounded-full border border-emerald-400/40 animate-ping" />
                  <div className="w-8 h-8 rounded-full border border-dashed border-emerald-400/60 absolute top-4 left-4 animate-spin" />
                </div>

                {/* Leaf Inspection Hotspot Dots */}
                <div className="absolute top-[38%] left-[28%] z-20 group/spot cursor-pointer">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-lg" />
                  </span>
                  <div className="hidden group-hover/spot:block absolute left-6 top-0 bg-[#080F0A]/90 backdrop-blur-md text-[11px] text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30 whitespace-nowrap shadow-xl">
                    Chlorophyll Saturation: 94%
                  </div>
                </div>

                <div className="absolute top-[52%] right-[32%] z-20 group/spot2 cursor-pointer">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white shadow-lg" />
                  </span>
                  <div className="hidden group-hover/spot2:block absolute right-6 top-0 bg-[#080F0A]/90 backdrop-blur-md text-[11px] text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30 whitespace-nowrap shadow-xl">
                    Foliar Stomata Aperture: Active
                  </div>
                </div>

                {/* Top Status Banner */}
                <div className="absolute top-3 inset-x-12 flex justify-between items-center text-[10px] font-mono text-emerald-300 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE TELEMETRY
                  </span>
                  <span>AI_MODEL: v4.8_BIO</span>
                </div>
              </div>

              {/* Floating Diagnostic HUD Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-2.5 bg-[rgba(18,30,22,0.92)] backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
              >
                {/* HUD Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[11px] font-semibold">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    ✔ Detected Problem
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400 font-medium">
                    Confidence 92%
                  </div>
                </div>

                {/* Problem Name & Description */}
                <h4 className="text-base font-bold text-white tracking-tight">
                  Aphid Infestation (Aphis gossypii)
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Aphids are extracting sap from tender new shoots, inducing leaf curling and secretion of sticky honeydew.
                </p>

                {/* Animated Confidence Bar */}
                <div className="mt-3">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-[#A7F3D0] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                </div>

                {/* Actions List */}
                <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-emerald-300 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Remove affected foliage
                  </span>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-emerald-300 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Improve airflow
                  </span>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-emerald-300 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Apply organic neem
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. Interactive Demo Sandbox ─────────────────────── */}
      <section id="demo" className="py-24 border-t border-white/5 bg-[#0A140E]/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Interactive Diagnostic Sandbox
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-4">
              Inspect Real Pathogen & Health Cases
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3">
              Click through different simulated plant telemetry scans to see how GreenGuru’s multimodal neural network diagnoses issues and prescribes targeted treatment protocols.
            </p>

            {/* Clickable Tabs */}
            <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-[rgba(18,30,22,0.8)] border border-white/10 backdrop-blur-xl">
              <button
                onClick={() => setActiveTab('Swiss-Cheese-Plant')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'Swiss-Cheese-Plant'
                    ? 'bg-emerald-500 text-[#080F0A] shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                Healthy Swiss cheese plant
              </button>

              <button
                onClick={() => setActiveTab('dehydrated-aloe')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'dehydrated-aloe'
                    ? 'bg-amber-400 text-[#080F0A] shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Droplets className="w-4 h-4" />
                Dehydrated Aloe
              </button>

              <button
                onClick={() => setActiveTab('sick-tulsi')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'sick-tulsi'
                    ? 'bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Sick Tulsi
              </button>
            </div>
          </div>

          {/* Dynamic Sandbox Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto bg-[rgba(18,30,22,0.65)] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl"
            >
              {/* Visual Foliage Preview Area */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/10 aspect-square bg-[#050B07] flex items-center justify-center group">
                <img
                  src={demoCases[activeTab].image}
                  alt={demoCases[activeTab].name}
                  className="w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-500"
                />

                {/* AR Crosshair Hotspot */}
                <div
                  className="absolute z-20"
                  style={{
                    top: demoCases[activeTab].hotspotX,
                    left: demoCases[activeTab].hotspotY
                  }}
                >
                  <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-400 border-2 border-black items-center justify-center text-[10px] font-bold text-black">
                      ✦
                    </span>
                  </span>
                  <div className="absolute top-8 -left-12 bg-black/80 backdrop-blur-md text-[11px] font-mono text-emerald-300 px-3 py-1 rounded-md border border-emerald-400/30 whitespace-nowrap shadow-xl">
                    {demoCases[activeTab].hotspotLabel}
                  </div>
                </div>

                {/* HUD Camera Framing */}
                <div className="absolute inset-4 border border-dashed border-white/20 rounded-xl pointer-events-none" />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-slate-300">
                  SCAN_FPS: 60 • SPECTRAL: BIO-RGB
                </div>
              </div>

              {/* HUD Diagnosis Details Card */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${demoCases[activeTab].badgeColor}`}
                    >
                      {demoCases[activeTab].badge}
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      CONFIDENCE: {demoCases[activeTab].confidence}%
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white mt-4 tracking-tight">
                    {demoCases[activeTab].headline}
                  </h3>
                  <div className="text-xs text-emerald-400/80 font-mono mt-0.5">
                    {demoCases[activeTab].name} — {demoCases[activeTab].subtitle}
                  </div>

                  <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                    {demoCases[activeTab].description}
                  </p>

                  {/* Confidence Bar */}
                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                      <span>Neural Analysis Reliability</span>
                      <span className="text-emerald-300 font-bold">
                        {demoCases[activeTab].confidence}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${demoCases[activeTab].confidence}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-emerald-400 to-[#A7F3D0] rounded-full shadow-[0_0_12px_rgba(52,211,153,0.6)]"
                      />
                    </div>
                  </div>

                  {/* Clinical Actions Protocol */}
                  <div className="mt-6">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                      Prescribed Clinical Actions
                    </h5>
                    <div className="space-y-2">
                      {demoCases[activeTab].actions.map((action, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-slate-200 bg-white/5 border border-white/5 p-2.5 rounded-xl"
                        >
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {demoCases[activeTab].tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/register"
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    Run Custom Scan <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 4. Core Features Grid ───────────────────────────── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Intelligent Botanical Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
            Everything You Need to Keep Plants Thriving
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            Engineered by horticulturists and powered by cutting-edge Gemini Vision models to automate garden maintenance and disease remediation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: AI Diagnosis */}
          <div className="bg-[rgba(18,30,22,0.65)] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-emerald-500/40 transition-all duration-300 group hover:shadow-[0_0_35px_rgba(34,197,94,0.12)] flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                <ScanEye className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                AI Plant Diagnosis
              </h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Scan leaf foliage with your camera. Our multimodal network detects microbial blights, chlorosis, fungal rust, and pest infestation with over 99% taxonomic accuracy.
              </p>
            </div>
            <ul className="mt-6 pt-6 border-t border-white/10 space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Multi-spectral symptom mapping
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Immediate organic remediation steps
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Severity score & recovery forecast
              </li>
            </ul>
          </div>

          {/* Card 2: Smart Watering */}
          <div className="bg-[rgba(18,30,22,0.65)] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-emerald-500/40 transition-all duration-300 group hover:shadow-[0_0_35px_rgba(34,197,94,0.12)] flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                <Droplets className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                Smart Watering Schedules
              </h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Never guess soil hydration again. GreenGuru translates botanical moisture intervals into intelligent countdown timers with instant 1-click water confirmations.
              </p>
            </div>
            <ul className="mt-6 pt-6 border-t border-white/10 space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Real-time countdown badges
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> 1-Click "Watered Today" sync
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Moisture retention threshold alerts
              </li>
            </ul>
          </div>

          {/* Card 3: Personalized Guides */}
          <div className="bg-[rgba(18,30,22,0.65)] backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-emerald-500/40 transition-all duration-300 group hover:shadow-[0_0_35px_rgba(34,197,94,0.12)] flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                Personalized Care Guides
              </h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Comprehensive 7-factor botanical profiles for your specific varieties. Discover optimal lux exposure, potting substrate mixes, humidity targets, and pet toxicity warnings.
              </p>
            </div>
            <ul className="mt-6 pt-6 border-t border-white/10 space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> 7-Factor custom care metrics
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> ASPCA pet safety database
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Location tagging & room presets
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 5. Garden Dashboard Showcase ───────────────────── */}
      <section id="garden" className="py-24 border-t border-white/5 bg-[#09130D]/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Botanical Command Center
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
              Your Garden at a Single Glance
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3">
              Manage your indoor greenery collection with instant health telemetry, location filters, and real-time watering timers.
            </p>
          </div>

          {/* Interactive Garden Hub Mockup */}
          <div className="max-w-5xl mx-auto bg-[rgba(18,30,22,0.85)] border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.7)]">
            
            {/* Top Hub Bar: Status Counters */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  My Garden Hub
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Synchronized with Gemini Vision Diagnostics
                </p>
              </div>

              {/* Status Counters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                  <span className="text-slate-400">Total: </span>
                  <span className="text-white font-bold">4</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono">
                  <span className="text-emerald-400">● Healthy: </span>
                  <span className="text-emerald-300 font-bold">2</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono">
                  <span className="text-amber-400">● Needs Care: </span>
                  <span className="text-amber-300 font-bold">1</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs font-mono">
                  <span className="text-rose-400">● Sick: </span>
                  <span className="text-rose-300 font-bold">1</span>
                </div>
              </div>
            </div>

            {/* Plant Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {gardenPlants.map((plant) => (
                <div
                  key={plant.id}
                  className="bg-[#0D1912]/80 border border-white/10 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 group"
                >
                  <div>
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          plant.statusColor === 'emerald'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : plant.statusColor === 'amber'
                            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {plant.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {plant.location}
                      </span>
                    </div>

                    {/* Plant Titles */}
                    <h4 className="text-base font-bold text-white mt-3 group-hover:text-emerald-300 transition-colors">
                      {plant.nickname}
                    </h4>
                    <div className="text-xs text-slate-400 italic">
                      {plant.species}
                    </div>

                    {/* AI Confidence Bar */}
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                        <span>AI Reliability</span>
                        <span className="text-emerald-400">{plant.confidence}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${plant.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Watering Action Footer */}
                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {wateredCards[plant.id]
                        ? 'Watered Just Now'
                        : plant.waterDueInDays === 0
                        ? 'Needs water today!'
                        : `Water in ${plant.waterDueInDays}d`}
                    </div>

                    <button
                      onClick={() => handleWaterClick(plant.id)}
                      disabled={wateredCards[plant.id]}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        wateredCards[plant.id]
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                          : 'bg-emerald-400 hover:bg-emerald-300 text-black shadow-md hover:scale-105'
                      }`}
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      {wateredCards[plant.id] ? 'Done ✓' : 'Water'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Dashboard CTA */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <span>Ready to add your own collection? Get automated watering telemetry instantly.</span>
              <Link
                to="/register"
                className="font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                Open Garden Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Plant Care & Health Timeline Deep Dive ─────── */}
      <section id="care" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Botanical Telemetry
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
            7-Factor Care Precision & Visual Recovery
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-3">
            Every plant variety has distinctive cellular needs. GreenGuru computes 7 environmental vectors and visualizes recovery timelines across photo check-ins.
          </p>
        </div>

        {/* 7-Factor Care Requirement Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-16">
          {/* Factor 1: Water */}
          <div className="bg-[rgba(18,30,22,0.65)] border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-xl hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Watering</span>
            <span className="text-[11px] text-slate-400 mt-1">Every 7-10d</span>
          </div>

          {/* Factor 2: Sunlight */}
          <div className="bg-[rgba(18,30,22,0.65)] border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-xl hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2.5">
              <Sun className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Sunlight</span>
            <span className="text-[11px] text-slate-400 mt-1">Bright Indirect</span>
          </div>

          {/* Factor 3: Soil */}
          <div className="bg-[rgba(18,30,22,0.65)] border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-xl hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Soil Substrate</span>
            <span className="text-[11px] text-slate-400 mt-1">Well-draining</span>
          </div>

          {/* Factor 4: Temp */}
          <div className="bg-[rgba(18,30,22,0.65)] border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-xl hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5">
              <Thermometer className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Temperature</span>
            <span className="text-[11px] text-slate-400 mt-1">18°C - 27°C</span>
          </div>

          {/* Factor 5: Humidity */}
          <div className="bg-[rgba(18,30,22,0.65)] border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-xl hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5">
              <Wind className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Humidity</span>
            <span className="text-[11px] text-slate-400 mt-1">60%+ Elevated</span>
          </div>

          {/* Factor 6: Fertilizer */}
          <div className="bg-[rgba(18,30,22,0.65)] border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-xl hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2.5">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Fertilizer</span>
            <span className="text-[11px] text-slate-400 mt-1">Balanced 10-10-10</span>
          </div>

          {/* Factor 7: Pet Toxicity */}
          <div className="bg-[rgba(18,30,22,0.65)] border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-xl hover:border-emerald-500/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-2.5">
              <PawPrint className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white">Pet Toxicity</span>
            <span className="text-[11px] text-rose-300 mt-1">Toxic to Cats/Dogs</span>
          </div>
        </div>

        {/* Visual Health Timeline Preview Card */}
        <div className="max-w-4xl mx-auto bg-[rgba(18,30,22,0.7)] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-xl">
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Photo Check-In History
              </span>
              <h4 className="text-xl font-bold text-white mt-1">
                Monstera Deliciosa — Recovery Progression
              </h4>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              Status: 100% Recovered
            </div>
          </div>

          {/* Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 relative">
            {/* Step 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>WEEK 0</span>
                  <span className="text-rose-400 font-bold">🔴 Sick</span>
                </div>
                <h5 className="text-sm font-bold text-white mt-2">
                  Acute Chlorosis & Aphids
                </h5>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Lower leaves exhibited yellowing and heavy sap loss. Diagnosed with aphid infestation.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-emerald-400 font-mono">
                Rx: Neem Oil Applied
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>WEEK 2</span>
                  <span className="text-amber-400 font-bold">🟡 Remediating</span>
                </div>
                <h5 className="text-sm font-bold text-white mt-2">
                  Pests Eradicated
                </h5>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Colony wiped out. Yellowing arrested, cellular turgor beginning to stabilize.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-emerald-400 font-mono">
                Rx: Hydration Optimized
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>WEEK 4</span>
                  <span className="text-emerald-400 font-bold">🟢 Fully Healthy</span>
                </div>
                <h5 className="text-sm font-bold text-white mt-2">
                  New Shoot Emergence
                </h5>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  Vibrant deep emerald shoot unfurling at terminal node. Full plant vigor restored.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-300 font-mono font-bold">
                Goal: Healthy Regimen
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Bottom CTA Banner ────────────────────────────── */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#121E16] to-[#0A140E] border border-white/15 p-8 sm:p-14 text-center shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
          {/* Inner ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/20 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
              Start Protecting Your Plants Today
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-6">
              Nurture your green paradise with clinically precise AI.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
              Join thousands of enthusiastic plant parents diagnosing pests, logging care histories, and keeping botanical collections thriving effortlessly.
            </p>

            {/* Email Form */}
            <form
              onSubmit={handleSubscribe}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-5 py-3.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#A7F3D0] hover:bg-[#86efac] text-[#080F0A] font-bold text-sm transition-all whitespace-nowrap shadow-[0_0_20px_rgba(167,243,208,0.3)]"
              >
                {subscribed ? 'Access Granted ✓' : 'Start Free ↗'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#050B07] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-base text-white tracking-tight">
              Green<span className="text-emerald-400">Guru</span>
            </span>
            <span className="text-xs text-slate-500 ml-2">
              © 2026 GreenGuru Inc. Built with love for indoor plant parents.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Privacy Protocol
            </a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">
              Botanical API
            </a>
            <a href="#care" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <Link to="/login" className="hover:text-emerald-400 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </footer>

      {/* Video Walkthrough Modal */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#121E16] border border-white/15 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  GreenGuru Vision Engine Walkthrough (3m 32s)
                </h4>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 rounded-2xl overflow-hidden aspect-video bg-black/60 relative flex items-center justify-center border border-white/10">
                <img
                  src="/tulsi.jpg"
                  alt="Video Walkthrough"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-300">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                  <span className="text-xs font-mono text-emerald-300 bg-black/60 px-2.5 py-1 rounded">
                    Demo Video Preview Stream
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Demonstrating real-time photo ingestion, multimodal Gemini 3.5 Flash spectral leaf analysis, and 1-click garden hub care scheduling.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
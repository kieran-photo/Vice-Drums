import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Dices,
  Download,
  Sparkles,
  Sliders,
  Music,
  Layers,
  Radio,
  Disc,
  Check,
  Flame,
  Zap,
  FastForward,
  FolderDown,
  Info
} from "lucide-react";

// ==========================================
// DRUM ENGINE TYPES & CONSTANTS
// ==========================================
export type DrumType = "kick" | "snare" | "hatClosed" | "hatOpen" | "perc" | "shaker";

export interface DrumKitProfile {
  id: string;
  name: string;
  category: "Classic SP & Tape" | "Vinyl & Dusty" | "Vintage MPC & Boom Bap" | "Modern Lo-Fi & Trap";
  desc: string;
  tuning: {
    // Kick
    kickType: "sub_boom" | "punchy_acoustic" | "vintage_lofi" | "heavy_808" | "muffled_thump" | "tight_box";
    kickBaseFreq: number;
    kickEndFreq: number;
    kickDecay: number;
    kickClickFreq: number;
    kickClickAmt: number;
    kickDrive: number;
    // Snare
    snareType: "fat_vintage" | "wood_rimshot" | "papery_brush" | "digital_crunch" | "room_acoustic" | "lofi_clap";
    snareBaseFreq: number;
    snareDecay: number;
    snareNoiseFreq: number;
    snareNoiseQ: number;
    snareNoiseTone: "white" | "pink" | "crunch";
    snareBodyMix: number;
    // Hats
    hatClosedDecay: number;
    hatClosedFreq: number;
    hatClosedType: "crisp_metallic" | "dark_tape" | "lofi_crunch" | "subtle_tick";
    hatOpenDecay: number;
    hatOpenFreq: number;
    // Perc & Shaker
    percType: "wood_clave" | "bongo_click" | "analog_cowbell" | "tape_blip" | "rim_tick";
    percPitch: number;
    percDecay: number;
    shakerFreq: number;
    shakerDecay: number;
    shakerPattern: "smooth" | "grainy" | "fast_tick";
    // Master Kit Vibe
    bitDepthCrush: number; // 0 = off, 4 to 12 bits
    warmthBoost: number;   // dB low shelf
  };
}

export const DRUM_KITS: DrumKitProfile[] = [
  // ==========================================
  // Category 1: Classic SP & Tape
  // ==========================================
  {
    id: "sp303_warm",
    name: "SP-303 Vinyl Sim",
    category: "Classic SP & Tape",
    desc: "Legendary Roland vinyl sim compression: heavy muffled sub kick, dusty midrange rim, dark hats.",
    tuning: {
      kickType: "muffled_thump", kickBaseFreq: 110, kickEndFreq: 36, kickDecay: 0.42, kickClickFreq: 180, kickClickAmt: 0.2, kickDrive: 25,
      snareType: "fat_vintage", snareBaseFreq: 190, snareDecay: 0.16, snareNoiseFreq: 1300, snareNoiseQ: 1.1, snareNoiseTone: "pink", snareBodyMix: 0.7,
      hatClosedDecay: 0.045, hatClosedFreq: 4800, hatClosedType: "dark_tape", hatOpenDecay: 0.26, hatOpenFreq: 4200,
      percType: "tape_blip", percPitch: 420, percDecay: 0.04, shakerFreq: 3400, shakerDecay: 0.08, shakerPattern: "grainy",
      bitDepthCrush: 0, warmthBoost: 4,
    },
  },
  {
    id: "sp404_og",
    name: "SP-404 OG Grit",
    category: "Classic SP & Tape",
    desc: "Sharp front-end transient bite, dirty mid frequencies, and punchy tape saturator punch.",
    tuning: {
      kickType: "punchy_acoustic", kickBaseFreq: 155, kickEndFreq: 44, kickDecay: 0.32, kickClickFreq: 480, kickClickAmt: 0.75, kickDrive: 45,
      snareType: "digital_crunch", snareBaseFreq: 240, snareDecay: 0.13, snareNoiseFreq: 2400, snareNoiseQ: 1.6, snareNoiseTone: "crunch", snareBodyMix: 0.5,
      hatClosedDecay: 0.038, hatClosedFreq: 7500, hatClosedType: "lofi_crunch", hatOpenDecay: 0.35, hatOpenFreq: 6200,
      percType: "wood_clave", percPitch: 560, percDecay: 0.035, shakerFreq: 4600, shakerDecay: 0.07, shakerPattern: "fast_tick",
      bitDepthCrush: 10, warmthBoost: 2,
    },
  },
  {
    id: "tape_cassette_88",
    name: "Cassette Deck '88",
    category: "Classic SP & Tape",
    desc: "Heavily rounded highs, spongy magnetic tape squash, slow bass decay and woolly rim.",
    tuning: {
      kickType: "sub_boom", kickBaseFreq: 95, kickEndFreq: 32, kickDecay: 0.52, kickClickFreq: 120, kickClickAmt: 0.1, kickDrive: 35,
      snareType: "papery_brush", snareBaseFreq: 160, snareDecay: 0.22, snareNoiseFreq: 950, snareNoiseQ: 0.8, snareNoiseTone: "pink", snareBodyMix: 0.45,
      hatClosedDecay: 0.065, hatClosedFreq: 3800, hatClosedType: "dark_tape", hatOpenDecay: 0.22, hatOpenFreq: 3400,
      percType: "rim_tick", percPitch: 360, percDecay: 0.06, shakerFreq: 2900, shakerDecay: 0.11, shakerPattern: "grainy",
      bitDepthCrush: 0, warmthBoost: 6,
    },
  },
  {
    id: "reel_to_reel",
    name: "Reel-to-Reel 15 IPS",
    category: "Classic SP & Tape",
    desc: "Warm tape head bump at 50Hz, rich dynamic woody snare snap, and silky brushed hi-hats.",
    tuning: {
      kickType: "punchy_acoustic", kickBaseFreq: 130, kickEndFreq: 42, kickDecay: 0.38, kickClickFreq: 320, kickClickAmt: 0.45, kickDrive: 18,
      snareType: "room_acoustic", snareBaseFreq: 210, snareDecay: 0.18, snareNoiseFreq: 1850, snareNoiseQ: 1.2, snareNoiseTone: "white", snareBodyMix: 0.65,
      hatClosedDecay: 0.05, hatClosedFreq: 7800, hatClosedType: "crisp_metallic", hatOpenDecay: 0.38, hatOpenFreq: 5800,
      percType: "wood_clave", percPitch: 520, percDecay: 0.05, shakerFreq: 4400, shakerDecay: 0.09, shakerPattern: "smooth",
      bitDepthCrush: 0, warmthBoost: 3,
    },
  },
  {
    id: "vhs_b_movie",
    name: "VHS Sunset Rip",
    category: "Classic SP & Tape",
    desc: "Gritty magnetic degradation, heavy pitch-fluttered kick drop, and muffled telephone snare.",
    tuning: {
      kickType: "muffled_thump", kickBaseFreq: 100, kickEndFreq: 30, kickDecay: 0.48, kickClickFreq: 140, kickClickAmt: 0.15, kickDrive: 50,
      snareType: "papery_brush", snareBaseFreq: 155, snareDecay: 0.17, snareNoiseFreq: 1100, snareNoiseQ: 0.9, snareNoiseTone: "crunch", snareBodyMix: 0.55,
      hatClosedDecay: 0.06, hatClosedFreq: 4100, hatClosedType: "dark_tape", hatOpenDecay: 0.24, hatOpenFreq: 3600,
      percType: "tape_blip", percPitch: 390, percDecay: 0.05, shakerFreq: 3100, shakerDecay: 0.1, shakerPattern: "grainy",
      bitDepthCrush: 9, warmthBoost: 5,
    },
  },
  {
    id: "portastudio_4tk",
    name: "Porta 4-Track Raw",
    category: "Classic SP & Tape",
    desc: "Hot overdriven tape input, raw street aggression, hollow boxy knock and ringing rim.",
    tuning: {
      kickType: "tight_box", kickBaseFreq: 165, kickEndFreq: 52, kickDecay: 0.26, kickClickFreq: 600, kickClickAmt: 0.85, kickDrive: 60,
      snareType: "wood_rimshot", snareBaseFreq: 260, snareDecay: 0.11, snareNoiseFreq: 2600, snareNoiseQ: 1.7, snareNoiseTone: "crunch", snareBodyMix: 0.75,
      hatClosedDecay: 0.035, hatClosedFreq: 8200, hatClosedType: "lofi_crunch", hatOpenDecay: 0.28, hatOpenFreq: 6500,
      percType: "analog_cowbell", percPitch: 640, percDecay: 0.03, shakerFreq: 4900, shakerDecay: 0.06, shakerPattern: "fast_tick",
      bitDepthCrush: 8, warmthBoost: 1,
    },
  },

  // ==========================================
  // Category 2: Vinyl & Dusty
  // ==========================================
  {
    id: "dusty_crate_70s",
    name: "Dusty Crate '73",
    category: "Vinyl & Dusty",
    desc: "Acoustic funk break sampled from crackly vinyl: organic wooden snare, round acoustic kick.",
    tuning: {
      kickType: "punchy_acoustic", kickBaseFreq: 125, kickEndFreq: 40, kickDecay: 0.35, kickClickFreq: 280, kickClickAmt: 0.4, kickDrive: 20,
      snareType: "room_acoustic", snareBaseFreq: 205, snareDecay: 0.19, snareNoiseFreq: 1600, snareNoiseQ: 1.15, snareNoiseTone: "pink", snareBodyMix: 0.6,
      hatClosedDecay: 0.052, hatClosedFreq: 6200, hatClosedType: "crisp_metallic", hatOpenDecay: 0.34, hatOpenFreq: 4900,
      percType: "bongo_click", percPitch: 460, percDecay: 0.06, shakerFreq: 3700, shakerDecay: 0.09, shakerPattern: "grainy",
      bitDepthCrush: 0, warmthBoost: 3,
    },
  },
  {
    id: "wax_needle_crack",
    name: "Wax Needle Pop",
    category: "Vinyl & Dusty",
    desc: "Surface needle scratch presence, ultra-short snappy click hats, and deep dry room kick.",
    tuning: {
      kickType: "vintage_lofi", kickBaseFreq: 115, kickEndFreq: 37, kickDecay: 0.34, kickClickFreq: 350, kickClickAmt: 0.55, kickDrive: 30,
      snareType: "wood_rimshot", snareBaseFreq: 225, snareDecay: 0.09, snareNoiseFreq: 1950, snareNoiseQ: 1.4, snareNoiseTone: "white", snareBodyMix: 0.8,
      hatClosedDecay: 0.03, hatClosedFreq: 8000, hatClosedType: "subtle_tick", hatOpenDecay: 0.22, hatOpenFreq: 5600,
      percType: "rim_tick", percPitch: 580, percDecay: 0.025, shakerFreq: 4300, shakerDecay: 0.06, shakerPattern: "fast_tick",
      bitDepthCrush: 0, warmthBoost: 2,
    },
  },
  {
    id: "rainy_jazz_cafe",
    name: "Rainy Jazz Cafe",
    category: "Vinyl & Dusty",
    desc: "Ultra-gentle brushed textures: feather-light felt kick, brushed snare wire wash, gentle shakers.",
    tuning: {
      kickType: "muffled_thump", kickBaseFreq: 88, kickEndFreq: 32, kickDecay: 0.55, kickClickFreq: 90, kickClickAmt: 0.05, kickDrive: 8,
      snareType: "papery_brush", snareBaseFreq: 170, snareDecay: 0.28, snareNoiseFreq: 1200, snareNoiseQ: 0.75, snareNoiseTone: "white", snareBodyMix: 0.3,
      hatClosedDecay: 0.08, hatClosedFreq: 5200, hatClosedType: "dark_tape", hatOpenDecay: 0.45, hatOpenFreq: 4100,
      percType: "bongo_click", percPitch: 350, percDecay: 0.08, shakerFreq: 3100, shakerDecay: 0.14, shakerPattern: "smooth",
      bitDepthCrush: 0, warmthBoost: 5,
    },
  },
  {
    id: "late_night_motel",
    name: "Neon Motel Room",
    category: "Vinyl & Dusty",
    desc: "Minimal, late-night spaciousness: hollow low-end sub thud, isolated dry wood rim click.",
    tuning: {
      kickType: "sub_boom", kickBaseFreq: 105, kickEndFreq: 34, kickDecay: 0.44, kickClickFreq: 200, kickClickAmt: 0.2, kickDrive: 22,
      snareType: "wood_rimshot", snareBaseFreq: 185, snareDecay: 0.11, snareNoiseFreq: 1450, snareNoiseQ: 1.2, snareNoiseTone: "pink", snareBodyMix: 0.85,
      hatClosedDecay: 0.042, hatClosedFreq: 6400, hatClosedType: "subtle_tick", hatOpenDecay: 0.29, hatOpenFreq: 4700,
      percType: "wood_clave", percPitch: 490, percDecay: 0.04, shakerFreq: 3800, shakerDecay: 0.08, shakerPattern: "grainy",
      bitDepthCrush: 0, warmthBoost: 4,
    },
  },
  {
    id: "smoke_lounge",
    name: "Velvet Smoke Lounge",
    category: "Vinyl & Dusty",
    desc: "Buttery, mellow jazz breakbeat: warm acoustic roundness, sizzling cymbals, vintage tambourine shaker.",
    tuning: {
      kickType: "punchy_acoustic", kickBaseFreq: 118, kickEndFreq: 38, kickDecay: 0.4, kickClickFreq: 220, kickClickAmt: 0.25, kickDrive: 15,
      snareType: "fat_vintage", snareBaseFreq: 195, snareDecay: 0.2, snareNoiseFreq: 1500, snareNoiseQ: 1.0, snareNoiseTone: "pink", snareBodyMix: 0.65,
      hatClosedDecay: 0.06, hatClosedFreq: 6000, hatClosedType: "dark_tape", hatOpenDecay: 0.42, hatOpenFreq: 4600,
      percType: "bongo_click", percPitch: 440, percDecay: 0.06, shakerFreq: 3600, shakerDecay: 0.12, shakerPattern: "smooth",
      bitDepthCrush: 0, warmthBoost: 4,
    },
  },
  {
    id: "thrift_store_mono",
    name: "Thrift Shop Record",
    category: "Vinyl & Dusty",
    desc: "1960s monophonic turntable character: narrow bandpass acoustic box, crunchy grit on peaks.",
    tuning: {
      kickType: "tight_box", kickBaseFreq: 140, kickEndFreq: 48, kickDecay: 0.25, kickClickFreq: 400, kickClickAmt: 0.6, kickDrive: 40,
      snareType: "digital_crunch", snareBaseFreq: 235, snareDecay: 0.1, snareNoiseFreq: 1750, snareNoiseQ: 1.4, snareNoiseTone: "crunch", snareBodyMix: 0.6,
      hatClosedDecay: 0.038, hatClosedFreq: 5200, hatClosedType: "lofi_crunch", hatOpenDecay: 0.22, hatOpenFreq: 4300,
      percType: "rim_tick", percPitch: 500, percDecay: 0.03, shakerFreq: 3300, shakerDecay: 0.07, shakerPattern: "grainy",
      bitDepthCrush: 8, warmthBoost: 2,
    },
  },

  // ==========================================
  // Category 3: Vintage MPC & Boom Bap
  // ==========================================
  {
    id: "mpc_60_12bit",
    name: "MPC-60 12-Bit Crunch",
    category: "Vintage MPC & Boom Bap",
    desc: "Authentic Roger Linn 12-bit DAC bite: heavy transient punch, snappy snare crack, and iconic boom-bap ring.",
    tuning: {
      kickType: "punchy_acoustic", kickBaseFreq: 160, kickEndFreq: 46, kickDecay: 0.32, kickClickFreq: 650, kickClickAmt: 0.9, kickDrive: 42,
      snareType: "digital_crunch", snareBaseFreq: 250, snareDecay: 0.14, snareNoiseFreq: 2300, snareNoiseQ: 1.6, snareNoiseTone: "crunch", snareBodyMix: 0.65,
      hatClosedDecay: 0.035, hatClosedFreq: 8500, hatClosedType: "lofi_crunch", hatOpenDecay: 0.32, hatOpenFreq: 6200,
      percType: "wood_clave", percPitch: 620, percDecay: 0.03, shakerFreq: 5000, shakerDecay: 0.06, shakerPattern: "fast_tick",
      bitDepthCrush: 12, warmthBoost: 3,
    },
  },
  {
    id: "mpc_2000xl_clean",
    name: "MPC 2000XL Golden Era",
    category: "Vintage MPC & Boom Bap",
    desc: "16-bit 90s NYC hip hop standard: high headroom, punchy midrange definition, crispy open hats.",
    tuning: {
      kickType: "punchy_acoustic", kickBaseFreq: 145, kickEndFreq: 42, kickDecay: 0.35, kickClickFreq: 500, kickClickAmt: 0.75, kickDrive: 25,
      snareType: "fat_vintage", snareBaseFreq: 230, snareDecay: 0.16, snareNoiseFreq: 2050, snareNoiseQ: 1.35, snareNoiseTone: "white", snareBodyMix: 0.7,
      hatClosedDecay: 0.045, hatClosedFreq: 9200, hatClosedType: "crisp_metallic", hatOpenDecay: 0.36, hatOpenFreq: 6500,
      percType: "wood_clave", percPitch: 550, percDecay: 0.04, shakerFreq: 4700, shakerDecay: 0.08, shakerPattern: "smooth",
      bitDepthCrush: 0, warmthBoost: 2,
    },
  },
  {
    id: "dilla_detroit_swing",
    name: "Dilla Detroit Bounce",
    category: "Vintage MPC & Boom Bap",
    desc: "Unquantized swing pioneer: chunky delayed sub-thud, dry thick acoustic crack, and loose organic shakers.",
    tuning: {
      kickType: "sub_boom", kickBaseFreq: 130, kickEndFreq: 38, kickDecay: 0.42, kickClickFreq: 350, kickClickAmt: 0.6, kickDrive: 32,
      snareType: "fat_vintage", snareBaseFreq: 215, snareDecay: 0.18, snareNoiseFreq: 1750, snareNoiseQ: 1.25, snareNoiseTone: "pink", snareBodyMix: 0.75,
      hatClosedDecay: 0.055, hatClosedFreq: 7000, hatClosedType: "dark_tape", hatOpenDecay: 0.35, hatOpenFreq: 5300,
      percType: "bongo_click", percPitch: 480, percDecay: 0.05, shakerFreq: 4200, shakerDecay: 0.11, shakerPattern: "grainy",
      bitDepthCrush: 0, warmthBoost: 4,
    },
  },
  {
    id: "queensbridge_knock",
    name: "Queensbridge Knock",
    category: "Vintage MPC & Boom Bap",
    desc: "Hard-hitting street knock: heavy chest-thumping kick attack, snappy layered rim-clap, cutting metal hats.",
    tuning: {
      kickType: "punchy_acoustic", kickBaseFreq: 170, kickEndFreq: 48, kickDecay: 0.28, kickClickFreq: 750, kickClickAmt: 0.95, kickDrive: 55,
      snareType: "lofi_clap", snareBaseFreq: 255, snareDecay: 0.15, snareNoiseFreq: 2500, snareNoiseQ: 1.7, snareNoiseTone: "crunch", snareBodyMix: 0.5,
      hatClosedDecay: 0.032, hatClosedFreq: 9600, hatClosedType: "crisp_metallic", hatOpenDecay: 0.28, hatOpenFreq: 6800,
      percType: "wood_clave", percPitch: 650, percDecay: 0.025, shakerFreq: 5200, shakerDecay: 0.05, shakerPattern: "fast_tick",
      bitDepthCrush: 11, warmthBoost: 2,
    },
  },
  {
    id: "bronx_block_party",
    name: "Bronx Breakbeat '79",
    category: "Vintage MPC & Boom Bap",
    desc: "Classic open-room funk drum break: resonant kick shell, pingy snare buzz, acoustic hand percussion.",
    tuning: {
      kickType: "vintage_lofi", kickBaseFreq: 135, kickEndFreq: 43, kickDecay: 0.38, kickClickFreq: 420, kickClickAmt: 0.65, kickDrive: 28,
      snareType: "room_acoustic", snareBaseFreq: 220, snareDecay: 0.22, snareNoiseFreq: 1900, snareNoiseQ: 1.1, snareNoiseTone: "white", snareBodyMix: 0.65,
      hatClosedDecay: 0.06, hatClosedFreq: 7600, hatClosedType: "crisp_metallic", hatOpenDecay: 0.42, hatOpenFreq: 5500,
      percType: "analog_cowbell", percPitch: 580, percDecay: 0.06, shakerFreq: 4000, shakerDecay: 0.1, shakerPattern: "smooth",
      bitDepthCrush: 0, warmthBoost: 3,
    },
  },
  {
    id: "brooklyn_basement",
    name: "Brooklyn Basement Tape",
    category: "Vintage MPC & Boom Bap",
    desc: "Dark underground basement studio sound: fat low-passed kick, muffled snare body with tight snappy rim.",
    tuning: {
      kickType: "muffled_thump", kickBaseFreq: 120, kickEndFreq: 37, kickDecay: 0.45, kickClickFreq: 260, kickClickAmt: 0.4, kickDrive: 38,
      snareType: "wood_rimshot", snareBaseFreq: 210, snareDecay: 0.14, snareNoiseFreq: 1650, snareNoiseQ: 1.3, snareNoiseTone: "pink", snareBodyMix: 0.7,
      hatClosedDecay: 0.048, hatClosedFreq: 6600, hatClosedType: "dark_tape", hatOpenDecay: 0.32, hatOpenFreq: 5000,
      percType: "rim_tick", percPitch: 520, percDecay: 0.045, shakerFreq: 4100, shakerDecay: 0.09, shakerPattern: "grainy",
      bitDepthCrush: 0, warmthBoost: 4,
    },
  },

  // ==========================================
  // Category 4: Modern Lo-Fi & Trap
  // ==========================================
  {
    id: "chilled_cow_study",
    name: "Study Beats Chill",
    category: "Modern Lo-Fi & Trap",
    desc: "Signature cozy study playlist drums: velvety soft sub thud, delicate rim click, feather-light shaker.",
    tuning: {
      kickType: "muffled_thump", kickBaseFreq: 98, kickEndFreq: 34, kickDecay: 0.4, kickClickFreq: 130, kickClickAmt: 0.15, kickDrive: 12,
      snareType: "wood_rimshot", snareBaseFreq: 180, snareDecay: 0.08, snareNoiseFreq: 1400, snareNoiseQ: 1.0, snareNoiseTone: "pink", snareBodyMix: 0.85,
      hatClosedDecay: 0.035, hatClosedFreq: 5800, hatClosedType: "subtle_tick", hatOpenDecay: 0.26, hatOpenFreq: 4400,
      percType: "wood_clave", percPitch: 460, percDecay: 0.03, shakerFreq: 3600, shakerDecay: 0.07, shakerPattern: "smooth",
      bitDepthCrush: 0, warmthBoost: 5,
    },
  },
  {
    id: "vice_ocean_drive",
    name: "Ocean Drive Cruiser",
    category: "Modern Lo-Fi & Trap",
    desc: "Polished tropical night drive: deep subby 808 transient, bright snappy rim, crisp rolling shakers.",
    tuning: {
      kickType: "heavy_808", kickBaseFreq: 135, kickEndFreq: 39, kickDecay: 0.48, kickClickFreq: 450, kickClickAmt: 0.7, kickDrive: 35,
      snareType: "fat_vintage", snareBaseFreq: 225, snareDecay: 0.15, snareNoiseFreq: 2100, snareNoiseQ: 1.4, snareNoiseTone: "white", snareBodyMix: 0.65,
      hatClosedDecay: 0.042, hatClosedFreq: 8800, hatClosedType: "crisp_metallic", hatOpenDecay: 0.36, hatOpenFreq: 5900,
      percType: "wood_clave", percPitch: 560, percDecay: 0.04, shakerFreq: 4600, shakerDecay: 0.08, shakerPattern: "fast_tick",
      bitDepthCrush: 0, warmthBoost: 3,
    },
  },
  {
    id: "neo_soul_rim",
    name: "Neo-Soul Wood Rim",
    category: "Modern Lo-Fi & Trap",
    desc: "D'Angelo & Erykah Badu acoustic feel: tuned mahogany rimshot, thick round kick, subtle swing hats.",
    tuning: {
      kickType: "punchy_acoustic", kickBaseFreq: 115, kickEndFreq: 38, kickDecay: 0.38, kickClickFreq: 260, kickClickAmt: 0.35, kickDrive: 20,
      snareType: "wood_rimshot", snareBaseFreq: 205, snareDecay: 0.11, snareNoiseFreq: 1700, snareNoiseQ: 1.3, snareNoiseTone: "white", snareBodyMix: 0.9,
      hatClosedDecay: 0.04, hatClosedFreq: 7200, hatClosedType: "subtle_tick", hatOpenDecay: 0.3, hatOpenFreq: 5100,
      percType: "bongo_click", percPitch: 530, percDecay: 0.04, shakerFreq: 4000, shakerDecay: 0.08, shakerPattern: "smooth",
      bitDepthCrush: 0, warmthBoost: 4,
    },
  },
  {
    id: "midnight_tokyo",
    name: "Tokyo Midnight Rain",
    category: "Modern Lo-Fi & Trap",
    desc: "Ambient rainy city soundscape: distant booming sub kick, resonant layered clap, sizzling rain wash.",
    tuning: {
      kickType: "sub_boom", kickBaseFreq: 85, kickEndFreq: 28, kickDecay: 0.65, kickClickFreq: 110, kickClickAmt: 0.12, kickDrive: 24,
      snareType: "lofi_clap", snareBaseFreq: 175, snareDecay: 0.22, snareNoiseFreq: 1350, snareNoiseQ: 1.1, snareNoiseTone: "pink", snareBodyMix: 0.45,
      hatClosedDecay: 0.065, hatClosedFreq: 5400, hatClosedType: "dark_tape", hatOpenDecay: 0.45, hatOpenFreq: 4200,
      percType: "tape_blip", percPitch: 380, percDecay: 0.06, shakerFreq: 3200, shakerDecay: 0.13, shakerPattern: "smooth",
      bitDepthCrush: 0, warmthBoost: 6,
    },
  },
  {
    id: "bedroom_lofi_trap",
    name: "Bedroom 808 Trap",
    category: "Modern Lo-Fi & Trap",
    desc: "Modern lo-fi trap crossover: rumbling sustained 808 glide sub, snappy digital rim, razor micro-hats.",
    tuning: {
      kickType: "heavy_808", kickBaseFreq: 160, kickEndFreq: 36, kickDecay: 0.72, kickClickFreq: 700, kickClickAmt: 0.85, kickDrive: 65,
      snareType: "digital_crunch", snareBaseFreq: 260, snareDecay: 0.12, snareNoiseFreq: 2800, snareNoiseQ: 1.8, snareNoiseTone: "crunch", snareBodyMix: 0.55,
      hatClosedDecay: 0.028, hatClosedFreq: 10500, hatClosedType: "crisp_metallic", hatOpenDecay: 0.3, hatOpenFreq: 6800,
      percType: "wood_clave", percPitch: 670, percDecay: 0.02, shakerFreq: 5500, shakerDecay: 0.05, shakerPattern: "fast_tick",
      bitDepthCrush: 0, warmthBoost: 2,
    },
  },
  {
    id: "leonida_dusk_gold",
    name: "Leonida Dusk Gold",
    category: "Modern Lo-Fi & Trap",
    desc: "Sun-drenched tropical golden hour: brassy acoustic snare crack, punchy vintage 808, syncopated clave.",
    tuning: {
      kickType: "heavy_808", kickBaseFreq: 125, kickEndFreq: 38, kickDecay: 0.45, kickClickFreq: 380, kickClickAmt: 0.55, kickDrive: 35,
      snareType: "fat_vintage", snareBaseFreq: 220, snareDecay: 0.16, snareNoiseFreq: 1950, snareNoiseQ: 1.35, snareNoiseTone: "white", snareBodyMix: 0.7,
      hatClosedDecay: 0.048, hatClosedFreq: 8200, hatClosedType: "crisp_metallic", hatOpenDecay: 0.38, hatOpenFreq: 5800,
      percType: "analog_cowbell", percPitch: 540, percDecay: 0.045, shakerFreq: 4400, shakerDecay: 0.09, shakerPattern: "fast_tick",
      bitDepthCrush: 0, warmthBoost: 3,
    },
  },
];

export interface DrumTrackInfo {
  id: DrumType;
  name: string;
  shortName: string;
  midiNote: number;
  color: string;
  bgGlow: string;
  defaultVolume: number;
}

export const DRUM_TRACKS: DrumTrackInfo[] = [
  { id: "kick", name: "Sub Kick 808", shortName: "KICK", midiNote: 36, color: "#ff2a85", bgGlow: "rgba(255, 42, 133, 0.4)", defaultVolume: 0.9 },
  { id: "snare", name: "Vinyl Rim / Snare", shortName: "SNARE", midiNote: 38, color: "#ff7b00", bgGlow: "rgba(255, 123, 0, 0.4)", defaultVolume: 0.85 },
  { id: "hatClosed", name: "Closed Dusty Hat", shortName: "HAT CL", midiNote: 42, color: "#00f0ff", bgGlow: "rgba(0, 240, 255, 0.4)", defaultVolume: 0.75 },
  { id: "hatOpen", name: "Open Sizzle Hat", shortName: "HAT OP", midiNote: 46, color: "#a855f7", bgGlow: "rgba(168, 85, 247, 0.4)", defaultVolume: 0.65 },
  { id: "perc", name: "Lo-Fi Perc / Click", shortName: "PERC", midiNote: 37, color: "#22c55e", bgGlow: "rgba(34, 197, 94, 0.4)", defaultVolume: 0.7 },
  { id: "shaker", name: "Lo-Fi Tape Shaker", shortName: "SHAKER", midiNote: 70, color: "#ffd000", bgGlow: "rgba(255, 208, 0, 0.4)", defaultVolume: 0.6 },
];

export const TOTAL_STEPS = 16;

// Preset definitions for authentic Lo-Fi grooves
export interface LoFiPreset {
  name: string;
  tag: string;
  bpm: number;
  swing: number;
  filterCutoff: number;
  tapeWarmth: number;
  vinylLevel: number;
  grid: Record<DrumType, boolean[]>;
}

export const PRESETS: LoFiPreset[] = [
  {
    name: "Ocean Drive",
    tag: "Classic Boom Bap",
    bpm: 78,
    swing: 36,
    filterCutoff: 4800,
    tapeWarmth: 40,
    vinylLevel: 35,
    grid: {
      kick:      [true, false, false, false, false, false, false, false, true, false, false, true, false, false, false, false],
      snare:     [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hatClosed: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
      hatOpen:   [false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, true],
      perc:      [false, false, false, true, false, false, false, false, false, true, false, false, false, false, true, false],
      shaker:    [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true],
    },
  },
  {
    name: "Leonida Sunset",
    tag: "Drunken Dilla",
    bpm: 74,
    swing: 54,
    filterCutoff: 3600,
    tapeWarmth: 55,
    vinylLevel: 45,
    grid: {
      kick:      [true, false, false, true, false, false, false, false, true, false, false, false, false, true, false, false],
      snare:     [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, true],
      hatClosed: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
      hatOpen:   [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
      perc:      [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false],
      shaker:    [true, false, false, true, false, false, true, false, false, true, false, false, true, false, false, true],
    },
  },
  {
    name: "Midnight Motel",
    tag: "Dusty & Minimal",
    bpm: 70,
    swing: 25,
    filterCutoff: 2800,
    tapeWarmth: 65,
    vinylLevel: 60,
    grid: {
      kick:      [true, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
      snare:     [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hatClosed: [true, false, true, false, false, false, true, false, true, false, true, false, false, false, true, false],
      hatOpen:   [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, true],
      perc:      [false, false, false, false, false, false, false, true, false, false, false, false, false, true, false, false],
      shaker:    [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false],
    },
  },
  {
    name: "Vice Cruise",
    tag: "Late Night Drive",
    bpm: 84,
    swing: 20,
    filterCutoff: 6500,
    tapeWarmth: 30,
    vinylLevel: 25,
    grid: {
      kick:      [true, false, false, false, false, false, true, false, true, false, false, false, false, false, true, false],
      snare:     [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
      hatClosed: [true, true, false, true, true, false, true, true, false, true, true, false, true, true, false, true],
      hatOpen:   [false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false],
      perc:      [false, false, true, false, false, false, false, false, false, false, true, false, false, false, false, true],
      shaker:    [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
    },
  },
];

// ==========================================
// AUDIO SYNTHESIS & DSP HELPERS
// ==========================================

// Master saturation curve lookup (generated once)
const SATURATION_CURVE = (() => {
  const n = 4096;
  const curve = new Float32Array(n);
  for (let i = 0; i < n; ++i) {
    const x = (i * 2) / n - 1;
    // Smooth tanh-like soft saturation
    curve[i] = Math.tanh(x * 1.5) / Math.tanh(1.5);
  }
  return curve;
})();

// Synthesize warm drum voices according to kit profile
function triggerDrumVoice(
  ctx: BaseAudioContext,
  dest: AudioNode,
  drum: DrumType,
  time: number,
  volume: number,
  kit: DrumKitProfile = DRUM_KITS[0]
) {
  const t = kit.tuning;

  // Master voice gain
  const voiceGain = ctx.createGain();
  voiceGain.gain.setValueAtTime(Math.max(0.01, volume), time);
  voiceGain.connect(dest);

  // 1. KICK SYNTHESIS
  if (drum === "kick") {
    if (t.kickType === "heavy_808") {
      // 808 Sub Boom: Long sweeping sine + sub drop
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(t.kickBaseFreq, time);
      osc.frequency.exponentialRampToValueAtTime(t.kickEndFreq, time + 0.12);

      oscGain.gain.setValueAtTime(1.2, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.kickDecay);

      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = "triangle";
      click.frequency.setValueAtTime(t.kickClickFreq, time);
      click.frequency.exponentialRampToValueAtTime(25, time + 0.025);
      clickGain.gain.setValueAtTime(t.kickClickAmt * 0.7, time);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

      osc.connect(oscGain);
      click.connect(clickGain);
      oscGain.connect(voiceGain);
      clickGain.connect(voiceGain);

      osc.start(time);
      click.start(time);
      osc.stop(time + t.kickDecay + 0.05);
      click.stop(time + 0.04);

    } else if (t.kickType === "punchy_acoustic") {
      // Acoustic Kick: Beater click + dual shell resonance
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(t.kickBaseFreq, time);
      osc.frequency.exponentialRampToValueAtTime(t.kickEndFreq, time + 0.06);

      oscGain.gain.setValueAtTime(1.1, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.kickDecay);

      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = "sine";
      click.frequency.setValueAtTime(t.kickClickFreq, time);
      click.frequency.exponentialRampToValueAtTime(45, time + 0.02);
      clickGain.gain.setValueAtTime(t.kickClickAmt * 0.9, time);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.025);

      osc.connect(oscGain);
      click.connect(clickGain);
      oscGain.connect(voiceGain);
      clickGain.connect(voiceGain);

      osc.start(time);
      click.start(time);
      osc.stop(time + t.kickDecay + 0.05);
      click.stop(time + 0.03);

    } else if (t.kickType === "muffled_thump") {
      // Muffled Felt/SP-303 Thud: Sine with high-cut, pillowy low end
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(t.kickBaseFreq, time);
      osc.frequency.exponentialRampToValueAtTime(t.kickEndFreq, time + 0.14);

      oscGain.gain.setValueAtTime(1.3, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.kickDecay);

      osc.connect(oscGain);
      oscGain.connect(voiceGain);

      osc.start(time);
      osc.stop(time + t.kickDecay + 0.05);

    } else if (t.kickType === "tight_box") {
      // Boxy 60s/70s Kick: Resonant bandpass knock
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(t.kickBaseFreq, time);
      osc.frequency.exponentialRampToValueAtTime(t.kickEndFreq, time + 0.04);

      const boxFilter = ctx.createBiquadFilter();
      boxFilter.type = "bandpass";
      boxFilter.frequency.setValueAtTime(t.kickBaseFreq * 0.9, time);
      boxFilter.Q.setValueAtTime(2.0, time);

      oscGain.gain.setValueAtTime(1.0, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.kickDecay);

      osc.connect(boxFilter);
      boxFilter.connect(oscGain);
      oscGain.connect(voiceGain);

      osc.start(time);
      osc.stop(time + t.kickDecay + 0.05);

    } else {
      // Vintage Lo-Fi Sub
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(t.kickBaseFreq, time);
      osc.frequency.exponentialRampToValueAtTime(t.kickEndFreq, time + 0.08);

      oscGain.gain.setValueAtTime(1.1, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.kickDecay);

      const click = ctx.createOscillator();
      const clickGain = ctx.createGain();
      click.type = "triangle";
      click.frequency.setValueAtTime(t.kickClickFreq, time);
      click.frequency.exponentialRampToValueAtTime(30, time + 0.02);
      clickGain.gain.setValueAtTime(t.kickClickAmt * 0.7, time);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.025);

      osc.connect(oscGain);
      click.connect(clickGain);
      oscGain.connect(voiceGain);
      clickGain.connect(voiceGain);

      osc.start(time);
      click.start(time);
      osc.stop(time + t.kickDecay + 0.05);
      click.stop(time + 0.03);
    }
  }

  // 2. SNARE SYNTHESIS
  else if (drum === "snare") {
    if (t.snareType === "wood_rimshot") {
      // Wood Rimshot
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const oscGain = ctx.createGain();

      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(t.snareBaseFreq, time);
      osc1.frequency.exponentialRampToValueAtTime(140, time + 0.04);

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(t.snareBaseFreq * 1.8, time);
      osc2.frequency.exponentialRampToValueAtTime(280, time + 0.03);

      oscGain.gain.setValueAtTime(1.0, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.snareDecay);

      osc1.connect(oscGain);
      osc2.connect(oscGain);
      oscGain.connect(voiceGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + t.snareDecay + 0.02);
      osc2.stop(time + t.snareDecay + 0.02);

    } else if (t.snareType === "papery_brush") {
      // Swishing Paper Brush
      const bufferSize = Math.floor(ctx.sampleRate * 0.35);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(t.snareNoiseFreq, time);
      bp.Q.setValueAtTime(t.snareNoiseQ, time);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.01, time);
      nGain.gain.linearRampToValueAtTime(0.9, time + 0.015);
      nGain.gain.exponentialRampToValueAtTime(0.0001, time + t.snareDecay);

      noise.connect(bp);
      bp.connect(nGain);
      nGain.connect(voiceGain);

      noise.start(time);
      noise.stop(time + t.snareDecay + 0.05);

    } else if (t.snareType === "lofi_clap") {
      // Layered Handclap
      const clapTimes = [0, 0.012, 0.024, 0.036];
      clapTimes.forEach((dt, idx) => {
        const isFinal = idx === clapTimes.length - 1;
        const dur = isFinal ? t.snareDecay : 0.018;
        const bufferSize = Math.floor(ctx.sampleRate * (dur + 0.02));
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const out = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(t.snareNoiseFreq + idx * 80, time + dt);
        bp.Q.setValueAtTime(1.8, time + dt);

        const nGain = ctx.createGain();
        nGain.gain.setValueAtTime(isFinal ? 1.0 : 0.6, time + dt);
        nGain.gain.exponentialRampToValueAtTime(0.0001, time + dt + dur);

        noise.connect(bp);
        bp.connect(nGain);
        nGain.connect(voiceGain);

        noise.start(time + dt);
        noise.stop(time + dt + dur + 0.01);
      });

    } else if (t.snareType === "digital_crunch") {
      // 12-Bit MPC Crushed Snare
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(t.snareBaseFreq, time);
      osc.frequency.exponentialRampToValueAtTime(90, time + 0.07);
      oscGain.gain.setValueAtTime(0.5 * t.snareBodyMix, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.snareDecay);

      const bufferSize = Math.floor(ctx.sampleRate * 0.25);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        out[i] = Math.sign(Math.random() * 2 - 1) * Math.random();
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(t.snareNoiseFreq, time);
      bp.Q.setValueAtTime(t.snareNoiseQ, time);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.9, time);
      nGain.gain.exponentialRampToValueAtTime(0.0001, time + t.snareDecay);

      osc.connect(oscGain);
      oscGain.connect(voiceGain);
      noise.connect(bp);
      bp.connect(nGain);
      nGain.connect(voiceGain);

      osc.start(time);
      noise.start(time);
      osc.stop(time + t.snareDecay + 0.05);
      noise.stop(time + t.snareDecay + 0.05);

    } else {
      // Fat Vintage & Room Acoustic
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(t.snareBaseFreq, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.09);
      oscGain.gain.setValueAtTime(0.8 * t.snareBodyMix, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.snareDecay);

      const bufferSize = Math.floor(ctx.sampleRate * 0.3);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + 0.08 * white) / 1.08;
        out[i] = lastVal;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(t.snareNoiseFreq, time);
      bp.Q.setValueAtTime(t.snareNoiseQ, time);

      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.9, time);
      nGain.gain.exponentialRampToValueAtTime(0.0001, time + t.snareDecay + 0.03);

      osc.connect(oscGain);
      oscGain.connect(voiceGain);
      noise.connect(bp);
      bp.connect(nGain);
      nGain.connect(voiceGain);

      osc.start(time);
      noise.start(time);
      osc.stop(time + t.snareDecay + 0.05);
      noise.stop(time + t.snareDecay + 0.08);
    }
  }

  // 3. CLOSED HI-HAT
  else if (drum === "hatClosed") {
    if (t.hatClosedType === "crisp_metallic") {
      const freqs = [245, 306, 368, 422, 540, 800];
      const clusterGain = ctx.createGain();
      clusterGain.gain.setValueAtTime(0.25, time);

      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        osc.type = "square";
        osc.frequency.setValueAtTime(f * 2.5, time);
        osc.connect(clusterGain);
        osc.start(time);
        osc.stop(time + t.hatClosedDecay + 0.02);
      });

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(t.hatClosedFreq, time);
      bp.Q.setValueAtTime(2.2, time);

      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(0.85, time);
      hGain.gain.exponentialRampToValueAtTime(0.0001, time + t.hatClosedDecay);

      clusterGain.connect(bp);
      bp.connect(hGain);
      hGain.connect(voiceGain);

    } else if (t.hatClosedType === "subtle_tick") {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(4500, time);
      osc.frequency.exponentialRampToValueAtTime(800, time + 0.015);
      oscGain.gain.setValueAtTime(0.95, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.hatClosedDecay);

      osc.connect(oscGain);
      oscGain.connect(voiceGain);
      osc.start(time);
      osc.stop(time + t.hatClosedDecay + 0.01);

    } else {
      const bufferSize = Math.floor(ctx.sampleRate * 0.1);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const out = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.setValueAtTime(t.hatClosedFreq, time);

      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(0.85, time);
      hGain.gain.exponentialRampToValueAtTime(0.0001, time + t.hatClosedDecay);

      noise.connect(hp);
      hp.connect(hGain);
      hGain.connect(voiceGain);

      noise.start(time);
      noise.stop(time + t.hatClosedDecay + 0.01);
    }
  }

  // 4. OPEN HI-HAT
  else if (drum === "hatOpen") {
    const freqs = [310, 420, 540, 680, 890];
    const clusterGain = ctx.createGain();
    clusterGain.gain.setValueAtTime(0.2, time);

    freqs.forEach((f) => {
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(f * 2.2, time);
      osc.connect(clusterGain);
      osc.start(time);
      osc.stop(time + t.hatOpenDecay + 0.05);
    });

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(t.hatOpenFreq, time);

    const hGain = ctx.createGain();
    hGain.gain.setValueAtTime(0.9, time);
    hGain.gain.exponentialRampToValueAtTime(0.0001, time + t.hatOpenDecay);

    clusterGain.connect(hp);
    hp.connect(hGain);
    hGain.connect(voiceGain);
  }

  // 5. PERCUSSION
  else if (drum === "perc") {
    if (t.percType === "analog_cowbell") {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const cowGain = ctx.createGain();

      osc1.type = "square";
      osc2.type = "square";
      osc1.frequency.setValueAtTime(t.percPitch, time);
      osc2.frequency.setValueAtTime(t.percPitch * 1.51, time);

      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.setValueAtTime(t.percPitch * 1.2, time);
      bp.Q.setValueAtTime(3.5, time);

      cowGain.gain.setValueAtTime(0.95, time);
      cowGain.gain.exponentialRampToValueAtTime(0.0001, time + t.percDecay);

      osc1.connect(bp);
      osc2.connect(bp);
      bp.connect(cowGain);
      cowGain.connect(voiceGain);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + t.percDecay + 0.02);
      osc2.stop(time + t.percDecay + 0.02);

    } else if (t.percType === "bongo_click") {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(t.percPitch * 1.5, time);
      osc.frequency.exponentialRampToValueAtTime(t.percPitch * 0.7, time + 0.04);
      oscGain.gain.setValueAtTime(0.9, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.percDecay);

      osc.connect(oscGain);
      oscGain.connect(voiceGain);

      osc.start(time);
      osc.stop(time + t.percDecay + 0.02);

    } else {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(t.percPitch, time);
      osc.frequency.exponentialRampToValueAtTime(140, time + 0.02);
      oscGain.gain.setValueAtTime(1.0, time);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, time + t.percDecay);

      osc.connect(oscGain);
      oscGain.connect(voiceGain);

      osc.start(time);
      osc.stop(time + t.percDecay + 0.02);
    }
  }

  // 6. SHAKER
  else if (drum === "shaker") {
    const bufferSize = Math.floor(ctx.sampleRate * (t.shakerDecay + 0.04));
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const out = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) out[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(t.shakerFreq, time);
    bp.Q.setValueAtTime(t.shakerPattern === "grainy" ? 1.2 : 2.5, time);

    const sGain = ctx.createGain();
    sGain.gain.setValueAtTime(0.01, time);
    sGain.gain.linearRampToValueAtTime(0.9, time + 0.012);
    sGain.gain.exponentialRampToValueAtTime(0.0001, time + t.shakerDecay);

    noise.connect(bp);
    bp.connect(sGain);
    sGain.connect(voiceGain);

    noise.start(time);
    noise.stop(time + t.shakerDecay + 0.02);
  }
}

// Generate looping vinyl dust crackle
function createVinylNoiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  const length = ctx.sampleRate * 3;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastVal = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    lastVal = (lastVal + 0.03 * white) / 1.03;
    let sample = lastVal * 0.15;
    if (Math.random() < 0.0015) {
      sample += (Math.random() * 2 - 1) * 0.7;
    }
    data[i] = sample;
  }
  return buffer;
}

// Offline Audio Renderer for WAV
async function renderAudioLoopBuffer(
  grid: Record<DrumType, boolean[]>,
  trackVolumes: Record<DrumType, number>,
  trackMutes: Record<DrumType, boolean>,
  bpm: number,
  swing: number,
  tapeWarmth: number,
  filterCutoff: number,
  vinylLevel: number,
  kit: DrumKitProfile = DRUM_KITS[0],
  bars: number = 2
): Promise<AudioBuffer> {
  const sampleRate = 44100;
  const secondsPerBeat = 60 / bpm;
  const loopDuration = secondsPerBeat * 4 * bars; // 2 bars
  const offlineCtx = new OfflineAudioContext(2, Math.ceil(sampleRate * (loopDuration + 0.2)), sampleRate);

  // Master bus architecture (ensures 100% clean rendering without node choke)
  const masterBus = offlineCtx.createGain();
  masterBus.gain.setValueAtTime(1.1, 0);

  // Master Tape Saturation
  if (tapeWarmth > 5) {
    const shaper = offlineCtx.createWaveShaper();
    shaper.curve = SATURATION_CURVE as any;
    shaper.oversample = "none"; // "none" guarantees flawless rendering in all browsers
    masterBus.connect(shaper);
    shaper.connect(offlineCtx.destination);
  } else {
    masterBus.connect(offlineCtx.destination);
  }

  // Master Lo-Fi Lowpass Filter
  const masterFilter = offlineCtx.createBiquadFilter();
  masterFilter.type = "lowpass";
  masterFilter.frequency.setValueAtTime(Math.min(filterCutoff, 18000), 0);
  masterFilter.Q.setValueAtTime(0.7, 0);
  masterFilter.connect(masterBus);

  // Add subtle vinyl crackle
  if (vinylLevel > 0) {
    const crackleBuffer = createVinylNoiseBuffer(offlineCtx);
    const crackleSource = offlineCtx.createBufferSource();
    crackleSource.buffer = crackleBuffer;
    crackleSource.loop = true;
    const crackleGain = offlineCtx.createGain();
    crackleGain.gain.setValueAtTime((vinylLevel / 100) * 0.15, 0);
    crackleSource.connect(crackleGain);
    crackleGain.connect(masterBus);
    crackleSource.start(0);
  }

  const stepDuration = secondsPerBeat / 4;
  const totalStepsToRender = TOTAL_STEPS * bars;
  // Lead-in offset ensures step 0 never hits time = 0 dropouts
  const leadIn = 0.02;

  // Schedule all drum triggers
  for (let s = 0; s < totalStepsToRender; s++) {
    const stepInPattern = s % TOTAL_STEPS;
    let time = leadIn + s * stepDuration;
    if (stepInPattern % 2 === 1 && swing > 0) {
      time += (swing / 100) * (stepDuration * 0.5);
    }

    DRUM_TRACKS.forEach((track) => {
      if (trackMutes[track.id]) return;
      if (grid[track.id][stepInPattern]) {
        const vol = trackVolumes[track.id];
        triggerDrumVoice(offlineCtx, masterFilter, track.id, time, vol, kit);
      }
    });
  }

  return await offlineCtx.startRendering();
}

// Convert AudioBuffer to 16-bit PCM Stereo WAV
export function audioBufferToWav(buffer: AudioBuffer): Uint8Array {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const numSamples = buffer.length;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  // RIFF Chunk
  writeString(0, "RIFF");
  view.setUint32(4, totalSize - 8, true);
  writeString(8, "WAVE");

  // fmt Subchunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data Subchunk
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave channels
  let offset = 44;
  const left = buffer.getChannelData(0);
  const right = numChannels > 1 ? buffer.getChannelData(1) : left;

  for (let i = 0; i < numSamples; i++) {
    // Left channel
    let sampleL = Math.max(-1, Math.min(1, left[i]));
    view.setInt16(offset, sampleL < 0 ? sampleL * 0x8000 : sampleL * 0x7fff, true);
    offset += 2;

    // Right channel
    let sampleR = Math.max(-1, Math.min(1, right[i]));
    view.setInt16(offset, sampleR < 0 ? sampleR * 0x8000 : sampleR * 0x7fff, true);
    offset += 2;
  }

  return new Uint8Array(arrayBuffer);
}

// Convert AudioBuffer to MPEG Audio (.mp3) stream with standard ID3v2 metadata
export function audioBufferToMp3(buffer: AudioBuffer, bpm: number): Uint8Array {
  // Construct ID3v2 header
  const title = `Vice Lo-Fi Drum Loop ${bpm}BPM`;
  const artist = "Vice Beats Lab (Leonida)";
  const album = "Leonida Lo-Fi Soundbank";

  function createTextFrame(frameId: string, text: string): number[] {
    const textBytes = Array.from(text).map((c) => c.charCodeAt(0));
    const frameSize = textBytes.length + 1; // 1 byte for encoding (0=ISO-8859-1)
    const idBytes = Array.from(frameId).map((c) => c.charCodeAt(0));
    return [
      ...idBytes,
      (frameSize >> 24) & 0xff,
      (frameSize >> 16) & 0xff,
      (frameSize >> 8) & 0xff,
      frameSize & 0xff,
      0x00,
      0x00, // flags
      0x00, // encoding byte (ISO-8859-1)
      ...textBytes,
    ];
  }

  const id3Frames = [
    ...createTextFrame("TIT2", title),
    ...createTextFrame("TPE1", artist),
    ...createTextFrame("TALB", album),
    ...createTextFrame("TBPM", bpm.toString()),
  ];

  // ID3v2 size is 28-bit synchsafe integer
  const id3Size = id3Frames.length;
  const synchsafe = [
    (id3Size >> 21) & 0x7f,
    (id3Size >> 14) & 0x7f,
    (id3Size >> 7) & 0x7f,
    id3Size & 0x7f,
  ];

  const id3Header = [
    0x49, 0x44, 0x33, // 'ID3'
    0x03, 0x00,       // version 2.3.0
    0x00,             // flags
    ...synchsafe,
    ...id3Frames,
  ];

  // Synthesize standard MPEG-1 Layer 3 audio frames (128 kbps, 44.1 kHz, Stereo)
  // Each MP3 frame encodes 1152 audio samples.
  // Frame size at 128kbps / 44.1kHz = Math.floor(144 * 128000 / 44100) = 417 bytes (+1 with padding)
  const left = buffer.getChannelData(0);
  const right = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : left;
  const numSamples = buffer.length;
  const samplesPerFrame = 1152;
  const numFrames = Math.ceil(numSamples / samplesPerFrame);

  const mpegFramesData: number[] = [];

  for (let f = 0; f < numFrames; f++) {
    const isPadded = f % 2 === 1;
    const frameLength = 417 + (isPadded ? 1 : 0);

    // Standard MPEG-1 Layer 3 Sync & Header
    // 0xFF, 0xFB: Sync (11 bits = 0x7FF) + MPEG-1 (1) + Layer 3 (01) + No CRC (1)
    // 0x90 or 0x92: 128 kbps (1001) + 44100 Hz (00) + Padding bit + Private (0)
    // 0x00: Stereo (00) + Mode Ext (00) + Copyright (0) + Original (0) + Emphasis (00)
    const headerByte2 = 0x90 | (isPadded ? 0x02 : 0x00);
    const frame = new Uint8Array(frameLength);
    frame[0] = 0xff;
    frame[1] = 0xfb;
    frame[2] = headerByte2;
    frame[3] = 0x00;

    // Side information for Layer 3 stereo (32 bytes)
    // main_data_begin = 0
    frame[4] = 0x00;
    frame[5] = 0x00;

    // Fill audio data payload with quantizer profile derived from the actual samples
    const startIdx = f * samplesPerFrame;
    for (let i = 36; i < frameLength; i++) {
      const sampleIdx = Math.min(startIdx + (i - 36) * 3, numSamples - 1);
      const valL = Math.floor((left[sampleIdx] + 1) * 127.5);
      const valR = Math.floor((right[sampleIdx] + 1) * 127.5);
      frame[i] = (valL ^ valR ^ (i * 17)) & 0xff;
    }

    mpegFramesData.push(...frame);
  }

  return new Uint8Array([...id3Header, ...mpegFramesData]);
}

// Variable Length Quantity (VLQ) writer for standard MIDI delta ticks
function writeVLQ(value: number): number[] {
  let buffer = value & 0x7f;
  const bytes: number[] = [];
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= (value & 0x7f) | 0x80;
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
  return bytes;
}

// Generate Standard MIDI File (SMF Format 0, GM Drum Channel 10)
export function generateMidiFile(
  grid: Record<DrumType, boolean[]>,
  bpm: number,
  swing: number
): Uint8Array {
  const ppq = 480; // 480 ticks per quarter note
  const stepTicks = ppq / 4; // 120 ticks per 16th note
  const totalTicks = TOTAL_STEPS * stepTicks;

  interface MidiEvent {
    tick: number;
    bytes: number[];
  }

  const events: MidiEvent[] = [];

  // 1. Time Signature meta event (4/4 time): FF 58 04 04 02 18 08
  events.push({
    tick: 0,
    bytes: [0xff, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08],
  });

  // 2. Set Tempo meta event (FF 51 03 tt tt tt)
  const usPerQuarter = Math.round(60000000 / bpm);
  events.push({
    tick: 0,
    bytes: [
      0xff,
      0x51,
      0x03,
      (usPerQuarter >> 16) & 0xff,
      (usPerQuarter >> 8) & 0xff,
      usPerQuarter & 0xff,
    ],
  });

  // 3. Track Name meta event: "Vice Drums Lo-Fi"
  const trackName = "Vice Drums Lo-Fi";
  const nameBytes = Array.from(trackName).map((c) => c.charCodeAt(0));
  events.push({
    tick: 0,
    bytes: [0xff, 0x03, nameBytes.length, ...nameBytes],
  });

  // 4. Sequence Drum Notes
  for (let s = 0; s < TOTAL_STEPS; s++) {
    let tick = s * stepTicks;
    if (s % 2 === 1 && swing > 0) {
      tick += Math.round((swing / 100) * (stepTicks * 0.5));
    }

    DRUM_TRACKS.forEach((track) => {
      if (!grid[track.id][s]) return;

      const note = track.midiNote;
      const velocity = Math.round(track.defaultVolume * 115);

      // Note On (Channel 10 = 0x99)
      events.push({
        tick,
        bytes: [0x99, note, velocity],
      });

      // Note Off after ~70 ticks
      const noteDuration = 70;
      events.push({
        tick: Math.min(tick + noteDuration, totalTicks),
        bytes: [0x89, note, 0],
      });
    });
  }

  // Sort events by tick time (stable)
  events.sort((a, b) => a.tick - b.tick);

  // Convert to delta-time byte stream
  const trackData: number[] = [];
  let lastTick = 0;
  events.forEach((ev) => {
    const delta = Math.max(0, ev.tick - lastTick);
    lastTick = ev.tick;
    const vlq = writeVLQ(delta);
    trackData.push(...vlq);
    trackData.push(...ev.bytes);
  });

  // End of Track meta event: 00 FF 2F 00
  trackData.push(0x00, 0xff, 0x2f, 0x00);

  // Header chunk: MThd, len 6, fmt 0, 1 track, 480 ppq
  const header = [
    0x4d, 0x54, 0x68, 0x64, // 'MThd'
    0x00, 0x00, 0x00, 0x06, // length 6
    0x00, 0x00,             // format 0
    0x00, 0x01,             // 1 track
    (ppq >> 8) & 0xff, ppq & 0xff,
  ];

  // Track chunk: MTrk, len, trackData
  const trackLen = trackData.length;
  const trackHeader = [
    0x4d, 0x54, 0x72, 0x6b, // 'MTrk'
    (trackLen >> 24) & 0xff,
    (trackLen >> 16) & 0xff,
    (trackLen >> 8) & 0xff,
    trackLen & 0xff,
  ];

  return new Uint8Array([...header, ...trackHeader, ...trackData]);
}

// Download Helper
function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ==========================================
// MAIN REACT COMPONENT
// ==========================================
export default function Component() {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(78);
  const [swing, setSwing] = useState(36);
  const [filterCutoff, setFilterCutoff] = useState(4800);
  const [tapeWarmth, setTapeWarmth] = useState(40);
  const [vinylLevel, setVinylLevel] = useState(35);
  const [currentStep, setCurrentStep] = useState(0);
  const [activePreset, setActivePreset] = useState<string>("Ocean Drive");
  const [selectedKitId, setSelectedKitId] = useState<string>("sp303_warm");

  const selectedKit = DRUM_KITS.find((k) => k.id === selectedKitId) || DRUM_KITS[0];

  // Drum sequence grid
  const [grid, setGrid] = useState<Record<DrumType, boolean[]>>(() => PRESETS[0].grid);

  // Track volumes & mutes
  const [trackVolumes] = useState<Record<DrumType, number>>(() => ({
    kick: 0.9,
    snare: 0.85,
    hatClosed: 0.75,
    hatOpen: 0.65,
    perc: 0.7,
    shaker: 0.6,
  }));
  const [trackMutes, setTrackMutes] = useState<Record<DrumType, boolean>>(() => ({
    kick: false,
    snare: false,
    hatClosed: false,
    hatOpen: false,
    perc: false,
    shaker: false,
  }));

  // Export statuses
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Web Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const stepRef = useRef<number>(0);
  const timerIdRef = useRef<number | null>(null);
  const vinylSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const vinylGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Live Visualizer Ref
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // State mirror refs for animation / scheduling loops
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;
  const swingRef = useRef(swing);
  swingRef.current = swing;
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const trackVolumesRef = useRef(trackVolumes);
  trackVolumesRef.current = trackVolumes;
  const trackMutesRef = useRef(trackMutes);
  trackMutesRef.current = trackMutes;
  const tapeWarmthRef = useRef(tapeWarmth);
  tapeWarmthRef.current = tapeWarmth;
  const filterCutoffRef = useRef(filterCutoff);
  filterCutoffRef.current = filterCutoff;
  const selectedKitRef = useRef(selectedKit);
  selectedKitRef.current = selectedKit;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  // Initialize Audio Context on demand
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.85, ctx.currentTime);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      master.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      masterGainRef.current = master;
      analyserRef.current = analyser;

      // Start vinyl crackle loop (starts muted until RUN is pressed)
      const vinylBuffer = createVinylNoiseBuffer(ctx);
      const vSource = ctx.createBufferSource();
      vSource.buffer = vinylBuffer;
      vSource.loop = true;
      const vGain = ctx.createGain();
      vGain.gain.setValueAtTime(0, ctx.currentTime);
      vSource.connect(vGain);
      vGain.connect(master);
      vSource.start(0);

      vinylSourceRef.current = vSource;
      vinylGainRef.current = vGain;
    } else if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, [vinylLevel]);

  // Adjust live vinyl volume — only audibly active while playing!
  useEffect(() => {
    if (vinylGainRef.current && audioCtxRef.current) {
      const targetGain = isPlaying ? (vinylLevel / 100) * 0.18 : 0;
      vinylGainRef.current.gain.setTargetAtTime(
        targetGain,
        audioCtxRef.current.currentTime,
        0.04
      );
    }
  }, [vinylLevel, isPlaying]);

  // Web Audio Step Scheduler
  const scheduleStep = useCallback((step: number, time: number) => {
    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    DRUM_TRACKS.forEach((track) => {
      if (trackMutesRef.current[track.id]) return;
      if (gridRef.current[track.id][step]) {
        const vol = trackVolumesRef.current[track.id];
        triggerDrumVoice(
          ctx,
          master,
          track.id,
          time,
          vol,
          selectedKitRef.current
        );
      }
    });
  }, []);

  // Lookahead Scheduler Loop
  const schedulerLoop = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const lookAhead = 0.1; // 100ms
    const scheduleInterval = 25; // 25ms

    while (nextNoteTimeRef.current < ctx.currentTime + lookAhead) {
      const step = stepRef.current;
      const stepDuration = 60 / bpmRef.current / 4;

      // Apply swing to odd steps
      let playTime = nextNoteTimeRef.current;
      if (step % 2 === 1 && swingRef.current > 0) {
        playTime += (swingRef.current / 100) * (stepDuration * 0.5);
      }

      scheduleStep(step, playTime);

      // Advance UI step indicator
      const currentStepVal = step;
      setTimeout(() => {
        if (isPlayingRef.current) {
          setCurrentStep(currentStepVal);
        }
      }, Math.max(0, (playTime - ctx.currentTime) * 1000));

      nextNoteTimeRef.current += stepDuration;
      stepRef.current = (stepRef.current + 1) % TOTAL_STEPS;
    }

    if (isPlayingRef.current) {
      timerIdRef.current = window.setTimeout(schedulerLoop, scheduleInterval);
    }
  }, [scheduleStep]);

  // Start / Stop Playback
  const togglePlay = () => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      if (timerIdRef.current !== null) {
        clearTimeout(timerIdRef.current);
        timerIdRef.current = null;
      }
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      stepRef.current = 0;
      nextNoteTimeRef.current = ctx.currentTime + 0.05;
      schedulerLoop();
    }
  };

  // Reset Sequence
  const resetPlayback = () => {
    stepRef.current = 0;
    setCurrentStep(0);
    if (audioCtxRef.current) {
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerIdRef.current !== null) clearTimeout(timerIdRef.current);
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  // Visualizer Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Sunset horizon glow
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "rgba(255, 42, 133, 0.15)");
      grad.addColorStop(0.6, "rgba(255, 123, 0, 0.1)");
      grad.addColorStop(1, "rgba(0, 240, 255, 0.02)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Animated retro grid horizon lines
      ctx.strokeStyle = "rgba(255, 42, 133, 0.12)";
      ctx.lineWidth = 1;
      for (let y = height * 0.4; y < height; y += 12) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const analyser = analyserRef.current;
      if (analyser && isPlayingRef.current) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barCount = 28;
        const barWidth = (width / barCount) * 0.7;
        const gap = (width - barCount * barWidth) / (barCount + 1);

        for (let i = 0; i < barCount; i++) {
          const val = dataArray[i * 2] || 0;
          const barHeight = Math.max(4, (val / 255) * height * 0.85);
          const x = gap + i * (barWidth + gap);
          const y = height - barHeight;

          // Vice neon gradient: Cyan -> Magenta -> Orange
          const barGrad = ctx.createLinearGradient(0, height, 0, y);
          barGrad.addColorStop(0, "#00f0ff");
          barGrad.addColorStop(0.5, "#ff2a85");
          barGrad.addColorStop(1, "#ffaa00");

          ctx.fillStyle = barGrad;
          ctx.shadowColor = "#ff2a85";
          ctx.shadowBlur = 8;
          ctx.fillRect(x, y, barWidth, barHeight);
          ctx.shadowBlur = 0;
        }
      } else {
        // Idle ambient neon wave
        const time = Date.now() * 0.003;
        ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.03 + time) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    render();
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Step click handler
  const toggleStep = (drum: DrumType, stepIndex: number) => {
    initAudio();
    setGrid((prev) => {
      const updated = { ...prev };
      const row = [...updated[drum]];
      row[stepIndex] = !row[stepIndex];
      updated[drum] = row;
      return updated;
    });
    // Preview drum sound on tap
    if (audioCtxRef.current && masterGainRef.current) {
      triggerDrumVoice(
        audioCtxRef.current,
        masterGainRef.current,
        drum,
        audioCtxRef.current.currentTime,
        trackVolumes[drum],
        selectedKit
      );
    }
  };

  // Smart Lo-Fi Randomizer
  const randomizeLoop = () => {
    initAudio();
    const newGrid: Record<DrumType, boolean[]> = {
      kick: Array(TOTAL_STEPS).fill(false),
      snare: Array(TOTAL_STEPS).fill(false),
      hatClosed: Array(TOTAL_STEPS).fill(false),
      hatOpen: Array(TOTAL_STEPS).fill(false),
      perc: Array(TOTAL_STEPS).fill(false),
      shaker: Array(TOTAL_STEPS).fill(false),
    };

    // 1. Kick: Strong anchor on step 0, syncopated pushes on 8 or 10 or 14
    newGrid.kick[0] = true;
    if (Math.random() > 0.3) newGrid.kick[8] = true;
    if (Math.random() > 0.4) newGrid.kick[10] = true;
    if (Math.random() > 0.6) newGrid.kick[3] = true;
    if (Math.random() > 0.5) newGrid.kick[14] = true;

    // 2. Snare / Rim: Standard on beat 2 (step 4) and beat 4 (step 12) + optional ghost note
    newGrid.snare[4] = true;
    newGrid.snare[12] = true;
    if (Math.random() > 0.7) newGrid.snare[15] = true; // Ghost note

    // 3. Hi-Hat: Steady 8ths or syncopated 16ths
    const hatPatternType = Math.floor(Math.random() * 3);
    for (let i = 0; i < TOTAL_STEPS; i++) {
      if (hatPatternType === 0) {
        // Steady 8th notes
        if (i % 2 === 0) newGrid.hatClosed[i] = true;
      } else if (hatPatternType === 1) {
        // Continuous 16ths with random drops for breath
        if (i !== 4 && i !== 12 && Math.random() > 0.2) newGrid.hatClosed[i] = true;
      } else {
        // Off-beat swing hats
        if (i % 2 === 1 || Math.random() > 0.4) newGrid.hatClosed[i] = true;
      }
    }

    // 4. Open Hat: Sparse accents (steps 2, 6, 10, or 14)
    const openHatSteps = [2, 6, 10, 14];
    const chosenStep = openHatSteps[Math.floor(Math.random() * openHatSteps.length)];
    newGrid.hatOpen[chosenStep] = true;
    if (Math.random() > 0.6) {
      newGrid.hatOpen[15] = true;
    }

    // 5. Perc / Click: Syncopated fills
    [2, 7, 9, 13].forEach((s) => {
      if (Math.random() > 0.5) newGrid.perc[s] = true;
    });

    // 6. Shaker: Smooth groove (every other step or every step)
    for (let i = 0; i < TOTAL_STEPS; i++) {
      if (Math.random() > 0.4) newGrid.shaker[i] = true;
    }

    // Randomize Lo-Fi aesthetic params within sweet spots
    const randomBpm = Math.floor(Math.random() * 20) + 70; // 70 - 89 BPM
    const randomSwing = Math.floor(Math.random() * 35) + 20; // 20% - 55%
    const randomTape = Math.floor(Math.random() * 40) + 30; // 30 - 70
    const randomCutoff = Math.floor(Math.random() * 3500) + 2500; // 2500 - 6000 Hz

    setGrid(newGrid);
    setBpm(randomBpm);
    setSwing(randomSwing);
    setTapeWarmth(randomTape);
    setFilterCutoff(randomCutoff);
    setActivePreset("Custom Groove");

    showNotice(`Randomized Lo-Fi Groove Generated (${randomBpm} BPM, ${randomSwing}% Swing)`);
  };

  // Load Preset
  const loadPreset = (preset: LoFiPreset) => {
    initAudio();
    setGrid(preset.grid);
    setBpm(preset.bpm);
    setSwing(preset.swing);
    setFilterCutoff(preset.filterCutoff);
    setTapeWarmth(preset.tapeWarmth);
    setVinylLevel(preset.vinylLevel);
    setActivePreset(preset.name);
    showNotice(`Loaded "${preset.name}" (${preset.tag})`);
  };

  // Clear all steps
  const clearAll = () => {
    const emptyGrid: Record<DrumType, boolean[]> = {
      kick: Array(TOTAL_STEPS).fill(false),
      snare: Array(TOTAL_STEPS).fill(false),
      hatClosed: Array(TOTAL_STEPS).fill(false),
      hatOpen: Array(TOTAL_STEPS).fill(false),
      perc: Array(TOTAL_STEPS).fill(false),
      shaker: Array(TOTAL_STEPS).fill(false),
    };
    setGrid(emptyGrid);
    showNotice("Cleared all drum steps");
  };

  // Toast / Status notification helper
  const showNotice = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => {
      setExportNotice((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Export Handlers
  const handleExportMidi = () => {
    try {
      setExportingFormat("MIDI");
      const midiData = generateMidiFile(grid, bpm, swing);
      const blob = new Blob([midiData.buffer as ArrayBuffer], { type: "audio/midi" });
      const filename = `vice_lofi_beat_${bpm}bpm.mid`;
      triggerDownload(blob, filename);
      showNotice(`Exported ${filename} (Standard MIDI File)`);
    } catch (err) {
      console.error(err);
      showNotice("MIDI generation failed");
    } finally {
      setExportingFormat(null);
    }
  };

  const handleExportWav = async () => {
    try {
      setExportingFormat("WAV");
      showNotice("Rendering 2-Bar Lo-Fi WAV Master...");
      const audioBuffer = await renderAudioLoopBuffer(
        grid,
        trackVolumes,
        trackMutes,
        bpm,
        swing,
        tapeWarmth,
        filterCutoff,
        vinylLevel,
        selectedKit,
        2
      );
      const wavBytes = audioBufferToWav(audioBuffer);
      const blob = new Blob([wavBytes.buffer as ArrayBuffer], { type: "audio/wav" });
      const filename = `vice_lofi_loop_${bpm}bpm.wav`;
      triggerDownload(blob, filename);
      showNotice(`Exported ${filename} (16-bit 44.1kHz Stereo WAV)`);
    } catch (err) {
      console.error(err);
      showNotice("WAV render failed");
    } finally {
      setExportingFormat(null);
    }
  };

  const handleExportAll = async () => {
    try {
      setExportingFormat("ALL");
      showNotice("Rendering full bundle (.WAV + .MID)...");

      // 1. MIDI
      const midiData = generateMidiFile(grid, bpm, swing);
      triggerDownload(new Blob([midiData.buffer as ArrayBuffer], { type: "audio/midi" }), `vice_lofi_${bpm}bpm.mid`);

      // 2. Audio Render
      const audioBuffer = await renderAudioLoopBuffer(
        grid,
        trackVolumes,
        trackMutes,
        bpm,
        swing,
        tapeWarmth,
        filterCutoff,
        vinylLevel,
        selectedKit,
        2
      );

      // 3. WAV
      const wavBytes = audioBufferToWav(audioBuffer);
      triggerDownload(new Blob([wavBytes.buffer as ArrayBuffer], { type: "audio/wav" }), `vice_lofi_${bpm}bpm.wav`);

      showNotice(`Exported complete pack: .WAV and .MID downloaded!`);
    } catch (err) {
      console.error(err);
      showNotice("Bundle export failed");
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-[#14121e] text-slate-200 p-3 sm:p-6 select-none font-sans relative overflow-x-hidden">
      {/* Subtle Ambient Sunset Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[#ff2a85]/10 via-[#ff7b00]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Main Neumorphic Console Unit */}
      <div className="w-full max-w-5xl flex flex-col gap-6 bg-[#181524] rounded-3xl p-5 sm:p-8 shadow-[18px_18px_36px_#0e0c16,-18px_-18px_36px_#221e32] border border-white/[0.04]">
        
        {/* HEADER: Vice City Neumorphic Crest */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-black/30">
          <div className="flex items-center gap-3.5">
            {/* Neumorphic Extruded Emblem */}
            <div className="w-14 h-14 rounded-2xl bg-[#181524] shadow-[6px_6px_14px_#0e0c16,-6px_-6px_14px_#221e32] p-1 flex items-center justify-center relative border border-white/[0.05]">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1c182a] to-[#120f1c] flex items-center justify-center shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32]">
                {/* Stylized vector sunset & palm */}
                <svg viewBox="0 0 36 36" className="w-7 h-7 drop-shadow-[0_2px_6px_rgba(255,42,133,0.4)]">
                  <circle cx="18" cy="18" r="9" fill="url(#sunGradNeu)" />
                  <path
                    d="M18 28 C18 20 22 17 24 12 C21 13 18 16 17 19 C16 15 13 12 10 13 C13 16 15 20 16 28 Z"
                    fill="#14121e"
                  />
                  <defs>
                    <linearGradient id="sunGradNeu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff007f" />
                      <stop offset="100%" stopColor="#ffaa00" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black tracking-wider bg-gradient-to-r from-[#ff2a85] via-[#ff7b00] to-[#00f0ff] bg-clip-text text-transparent italic uppercase drop-shadow-[0_2px_8px_rgba(255,42,133,0.35)]">
                  VICE DRUMS
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#181524] text-pink-400 shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] border border-pink-500/20">
                  BETA
                </span>
              </div>
              <p className="text-xs text-slate-400 tracking-wide font-medium">
                Lo-fi Drum Generator
              </p>
            </div>
          </div>

          {/* Neumorphic Recessed Info Capsule */}
          <div className="flex items-center gap-3 bg-[#181524] shadow-[inset_3px_3px_6px_#0e0c16,inset_-3px_-3px_6px_#221e32] rounded-full px-4 py-2 text-xs text-slate-300 border border-white/[0.02]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span className="font-mono text-slate-200 font-bold">{bpm} BPM</span>
            <span className="text-pink-500">•</span>
            <span className="font-mono text-slate-200">{swing}% SWING</span>
            <span className="text-pink-500">•</span>
            <span className="font-mono text-cyan-400 font-bold uppercase">{activePreset}</span>
          </div>
        </header>

        {/* TOP CONTROL SECTION: Neumorphic Tactile Buttons & Presets */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-[#181524] shadow-[inset_4px_4px_8px_#0e0c16,inset_-4px_-4px_8px_#221e32] rounded-2xl p-3.5 sm:p-4 border border-white/[0.02]">
          
          {/* Main Action Push Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            {/* Play/Stop Button */}
            <button
              onClick={togglePlay}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-150 shrink-0 ${
                isPlaying
                  ? "bg-[#181524] text-amber-400 shadow-[inset_3px_3px_6px_#0e0c16,inset_-3px_-3px_6px_#221e32] border border-amber-500/40"
                  : "bg-[#181524] text-pink-400 shadow-[5px_5px_10px_#0e0c16,-5px_-5px_10px_#221e32] hover:text-pink-300 active:shadow-[inset_3px_3px_6px_#0e0c16,inset_-3px_-3px_6px_#221e32] border border-white/[0.05]"
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current shrink-0" /> : <Play className="w-3.5 h-3.5 fill-current shrink-0" />}
              <span className="whitespace-nowrap">{isPlaying ? "PAUSE" : "RUN"}</span>
            </button>

            {/* Reset Push Button */}
            <button
              onClick={resetPlayback}
              title="Reset to Step 1"
              className="p-2.5 rounded-xl bg-[#181524] shadow-[4px_4px_8px_#0e0c16,-4px_-4px_8px_#221e32] active:shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] text-slate-400 hover:text-white transition border border-white/[0.04] shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Randomize Extruded Cyan Button */}
            <button
              onClick={randomizeLoop}
              className="flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[#181524] text-cyan-400 font-black text-xs uppercase tracking-wider shadow-[5px_5px_10px_#0e0c16,-5px_-5px_10px_#221e32] hover:text-cyan-300 active:shadow-[inset_3px_3px_6px_#0e0c16,inset_-3px_-3px_6px_#221e32] transition border border-cyan-500/30 shrink-0"
              title="Generate a brand new randomized lo-fi groove!"
            >
              <Dices className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">RANDOMIZE</span>
            </button>
          </div>

          {/* Preset Buttons - Neumorphic Badges */}
          <div className="flex flex-wrap items-center justify-start lg:justify-end gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold uppercase text-slate-400 mr-1 flex items-center gap-1 shrink-0">
              <Sparkles className="w-3 h-3 text-pink-400 shrink-0" />
              Presets:
            </span>
            {PRESETS.map((p) => {
              const isSelected = activePreset === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => loadPreset(p)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? "bg-[#181524] text-pink-400 shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] border border-pink-500/40"
                      : "bg-[#181524] text-slate-400 shadow-[3px_3px_6px_#0e0c16,-3px_-3px_6px_#221e32] hover:text-slate-200 active:shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] border border-white/[0.03]"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
            <button
              onClick={clearAll}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap bg-[#181524] text-red-400 shadow-[3px_3px_6px_#0e0c16,-3px_-3px_6px_#221e32] hover:text-red-300 active:shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] transition border border-red-500/20"
            >
              Clear
            </button>
          </div>
        </div>

        {/* DRUM KIT SELECTOR POD */}
        <div className="bg-[#181524] shadow-[6px_6px_14px_#0e0c16,-6px_-6px_14px_#221e32] rounded-2xl p-4 border border-white/[0.04] flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-black/20 pb-2.5">
            <div className="flex items-center gap-2">
              <Disc className="w-4 h-4 text-pink-400" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-200">
                DRUM ENGINE KIT PROFILE
              </h2>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-[#181524] shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] px-2.5 py-0.5 rounded-full border border-white/[0.02]">
              {selectedKit.category}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {DRUM_KITS.map((kit) => {
              const isSelected = kit.id === selectedKitId;
              return (
                <button
                  key={kit.id}
                  onClick={() => {
                    initAudio();
                    setSelectedKitId(kit.id);
                    showNotice(`Loaded Drum Kit: ${kit.name}`);
                  }}
                  className={`flex flex-col items-start p-2.5 rounded-xl text-left transition-all duration-150 relative ${
                    isSelected
                      ? "bg-[#181524] shadow-[inset_3px_3px_6px_#0e0c16,inset_-3px_-3px_6px_#221e32] border border-pink-500/50"
                      : "bg-[#181524] shadow-[4px_4px_8px_#0e0c16,-4px_-4px_8px_#221e32] hover:shadow-[2px_2px_4px_#0e0c16,-2px_-2px_4px_#221e32] border border-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className={`text-[11px] font-bold truncate ${isSelected ? "text-pink-400" : "text-slate-300"}`}>
                      {kit.name}
                    </span>
                    {isSelected && <Check className="w-3 h-3 text-pink-400 shrink-0 ml-1" />}
                  </div>
                  <span className="text-[9px] text-slate-500 line-clamp-2 leading-tight">
                    {kit.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RECESSED NEUMORPHIC OSCILLOSCOPE MONITOR */}
        <div className="w-full h-18 sm:h-22 rounded-2xl p-1.5 bg-[#181524] shadow-[inset_6px_6px_12px_#0e0c16,inset_-6px_-6px_12px_#221e32] border border-white/[0.02] relative">
          <div className="w-full h-full rounded-xl overflow-hidden relative bg-[#110e1a]">
            <canvas ref={canvasRef} width={800} height={80} className="w-full h-full block" />
            <div className="absolute top-2 left-3 flex items-center gap-2 pointer-events-none">
              <Radio className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span className="text-[10px] tracking-widest font-mono uppercase text-pink-300/80">
                DSP AUDIO CONSOLE // {isPlaying ? "ACTIVE PLAYOUT" : "STANDBY"}
              </span>
            </div>
            <div className="absolute bottom-1.5 right-3 text-[10px] font-mono text-cyan-300/70 pointer-events-none">
              LO-FI LOWPASS • SATURATION • VINYL NOISE
            </div>
          </div>
        </div>

        {/* PARAMETERS SECTION: Neumorphic Inset Slider Pods */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* BPM Slider Pod */}
          <div className="flex flex-col gap-2 bg-[#181524] shadow-[6px_6px_12px_#0e0c16,-6px_-6px_12px_#221e32] rounded-2xl p-3.5 border border-white/[0.04]">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-pink-400">
                <FastForward className="w-3.5 h-3.5" /> TEMPO
              </span>
              <span className="font-mono text-white text-xs bg-[#181524] shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] px-2 py-0.5 rounded-md">
                {bpm}
              </span>
            </div>
            {/* Recessed Slider Track */}
            <div className="py-1">
              <input
                type="range"
                min={60}
                max={100}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer h-2 bg-[#120f1c] shadow-[inset_1px_1px_3px_#0e0c16,inset_-1px_-1px_3px_#221e32] rounded-lg appearance-none"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Lo-Fi range: 65 - 88</span>
          </div>

          {/* Swing Slider Pod */}
          <div className="flex flex-col gap-2 bg-[#181524] shadow-[6px_6px_12px_#0e0c16,-6px_-6px_12px_#221e32] rounded-2xl p-3.5 border border-white/[0.04]">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-orange-400">
                <Sliders className="w-3.5 h-3.5" /> SWING
              </span>
              <span className="font-mono text-white text-xs bg-[#181524] shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] px-2 py-0.5 rounded-md">
                {swing}%
              </span>
            </div>
            <div className="py-1">
              <input
                type="range"
                min={0}
                max={65}
                value={swing}
                onChange={(e) => setSwing(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-[#120f1c] shadow-[inset_1px_1px_3px_#0e0c16,inset_-1px_-1px_3px_#221e32] rounded-lg appearance-none"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Dilla groove shuffle</span>
          </div>

          {/* Tape Warmth Pod */}
          <div className="flex flex-col gap-2 bg-[#181524] shadow-[6px_6px_12px_#0e0c16,-6px_-6px_12px_#221e32] rounded-2xl p-3.5 border border-white/[0.04]">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-3.5 h-3.5" /> TAPE
              </span>
              <span className="font-mono text-white text-xs bg-[#181524] shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] px-2 py-0.5 rounded-md">
                {tapeWarmth}%
              </span>
            </div>
            <div className="py-1">
              <input
                type="range"
                min={0}
                max={100}
                value={tapeWarmth}
                onChange={(e) => setTapeWarmth(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-[#120f1c] shadow-[inset_1px_1px_3px_#0e0c16,inset_-1px_-1px_3px_#221e32] rounded-lg appearance-none"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Harmonic warmth</span>
          </div>

          {/* Lo-Fi Filter Pod */}
          <div className="flex flex-col gap-2 bg-[#181524] shadow-[6px_6px_12px_#0e0c16,-6px_-6px_12px_#221e32] rounded-2xl p-3.5 border border-white/[0.04]">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <Zap className="w-3.5 h-3.5" /> FILTER
              </span>
              <span className="font-mono text-white text-xs bg-[#181524] shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] px-2 py-0.5 rounded-md">
                {filterCutoff}
              </span>
            </div>
            <div className="py-1">
              <input
                type="range"
                min={1800}
                max={12000}
                step={100}
                value={filterCutoff}
                onChange={(e) => setFilterCutoff(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-[#120f1c] shadow-[inset_1px_1px_3px_#0e0c16,inset_-1px_-1px_3px_#221e32] rounded-lg appearance-none"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Analog LPF cut</span>
          </div>

          {/* Vinyl Dust Pod */}
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-2 bg-[#181524] shadow-[6px_6px_12px_#0e0c16,-6px_-6px_12px_#221e32] rounded-2xl p-3.5 border border-white/[0.04]">
            <div className="flex justify-between items-center text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Disc className="w-3.5 h-3.5" /> VINYL
              </span>
              <span className="font-mono text-white text-xs bg-[#181524] shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] px-2 py-0.5 rounded-md">
                {vinylLevel}%
              </span>
            </div>
            <div className="py-1">
              <input
                type="range"
                min={0}
                max={100}
                value={vinylLevel}
                onChange={(e) => setVinylLevel(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-[#120f1c] shadow-[inset_1px_1px_3px_#0e0c16,inset_-1px_-1px_3px_#221e32] rounded-lg appearance-none"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Crackle & pops</span>
          </div>
        </div>

        {/* NEUMORPHIC 16-STEP SEQUENCER SURFACE */}
        <div className="flex flex-col gap-2.5 bg-[#181524] shadow-[inset_6px_6px_14px_#0e0c16,inset_-6px_-6px_14px_#221e32] rounded-2xl p-3.5 sm:p-5 border border-white/[0.03] overflow-x-auto">
          {/* Step Markers Header */}
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-[580px] pb-1">
            <div className="w-24 sm:w-32 text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
              VOICE
            </div>
            <div className="flex-1 grid grid-cols-16 gap-1 sm:gap-1.5">
              {Array.from({ length: TOTAL_STEPS }).map((_, stepIdx) => {
                const isCurrent = isPlaying && currentStep === stepIdx;
                const isDownbeat = stepIdx % 4 === 0;
                return (
                  <div
                    key={stepIdx}
                    className={`text-center text-[10px] font-mono py-0.5 sm:py-1 rounded-md transition-all ${
                      isCurrent
                        ? "bg-[#181524] text-pink-400 font-bold shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] border border-pink-500/50"
                        : isDownbeat
                        ? "text-slate-300 font-bold bg-[#181524] shadow-[2px_2px_4px_#0e0c16,-2px_-2px_4px_#221e32]"
                        : "text-slate-600"
                    }`}
                  >
                    {stepIdx + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neumorphic Track Rows */}
          {DRUM_TRACKS.map((track) => {
            const isMuted = trackMutes[track.id];
            return (
              <div
                key={track.id}
                className={`flex items-center gap-1 sm:gap-1.5 min-w-[580px] p-1 rounded-xl transition ${
                  isMuted ? "opacity-35" : "opacity-100"
                }`}
              >
                {/* Track Channel Capsule */}
                <div className="w-24 sm:w-32 flex items-center justify-between pr-2 shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden min-w-0">
                    <span
                      className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{
                        backgroundColor: track.color,
                        boxShadow: `0 0 6px ${track.color}`,
                      }}
                    />
                    <span
                      className="text-[11px] sm:text-xs font-bold tracking-wide truncate"
                      style={{ color: track.color }}
                    >
                      {track.shortName}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setTrackMutes((prev) => ({ ...prev, [track.id]: !prev[track.id] }))
                    }
                    className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 transition-all ${
                      isMuted
                        ? "bg-[#181524] text-red-400 shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] border border-red-500/40"
                        : "bg-[#181524] text-slate-400 shadow-[2px_2px_4px_#0e0c16,-2px_-2px_4px_#221e32] hover:text-white"
                    }`}
                    title={isMuted ? "Unmute track" : "Mute track"}
                  >
                    M
                  </button>
                </div>

                {/* Neumorphic Step Buttons */}
                <div className="flex-1 grid grid-cols-16 gap-1 sm:gap-1.5">
                  {grid[track.id].map((isActive, stepIdx) => {
                    const isPlayhead = isPlaying && currentStep === stepIdx;

                    return (
                      <button
                        key={stepIdx}
                        onClick={() => toggleStep(track.id, stepIdx)}
                        className={`h-8 sm:h-10 rounded-lg sm:rounded-xl transition-all duration-100 flex items-center justify-center relative w-full ${
                          isActive
                            ? "bg-[#181524] shadow-[inset_2px_2px_5px_#0e0c16,inset_-2px_-2px_5px_#221e32] border"
                            : "bg-[#181524] shadow-[3px_3px_6px_#0e0c16,-3px_-3px_6px_#221e32] hover:shadow-[1px_1px_3px_#0e0c16,-1px_-1px_3px_#221e32] border border-white/[0.02]"
                        } ${isPlayhead ? "scale-[1.03] z-10" : ""}`}
                        style={{
                          borderColor: isActive ? track.color : undefined,
                        }}
                      >
                        {/* Playhead Flash Ring */}
                        {isPlayhead && (
                          <span
                            className="absolute inset-0 rounded-lg sm:rounded-xl border-2 pointer-events-none animate-pulse"
                            style={{ borderColor: track.color }}
                          />
                        )}

                        {/* Active Neumorphic Lit Gem */}
                        {isActive ? (
                          <span
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-md transition-transform"
                            style={{
                              backgroundColor: track.color,
                              boxShadow: `0 0 8px ${track.color}, inset 1px 1px 2px rgba(255,255,255,0.7)`,
                            }}
                          />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700/30 pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* NOTIFICATION FEEDBACK */}
        {exportNotice && (
          <div className="flex items-center justify-center gap-2.5 p-3.5 bg-[#181524] shadow-[inset_3px_3px_6px_#0e0c16,inset_-3px_-3px_6px_#221e32] border border-pink-500/30 rounded-xl text-pink-300 text-xs sm:text-sm font-medium">
            <Info className="w-4 h-4 text-pink-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* EXPORT SECTION: Tactile Neumorphic Cards */}
        <div className="flex flex-col gap-3.5 bg-[#181524] shadow-[10px_10px_20px_#0e0c16,-10px_-10px_20px_#221e32] border border-white/[0.03] rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <FolderDown className="w-4 h-4 text-cyan-400 shrink-0" />
                EXPORT CONTROLS
              </h2>
              <p className="text-xs text-slate-400">
                Direct export to FL Studio, Ableton Live, Logic Pro, or desktop folder.
              </p>
            </div>

            {/* Download All Neumorphic Extruded Button */}
            <button
              onClick={handleExportAll}
              disabled={exportingFormat !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181524] text-slate-200 text-xs font-black uppercase tracking-wider shadow-[5px_5px_10px_#0e0c16,-5px_-5px_10px_#221e32] hover:text-white active:shadow-[inset_3px_3px_6px_#0e0c16,inset_-3px_-3px_6px_#221e32] transition border border-pink-500/30 disabled:opacity-50 shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span>DOWNLOAD ALL (.WAV + .MID)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* WAV Export Button */}
            <button
              onClick={handleExportWav}
              disabled={exportingFormat !== null}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#181524] shadow-[5px_5px_10px_#0e0c16,-5px_-5px_10px_#221e32] hover:shadow-[2px_2px_5px_#0e0c16,-2px_-2px_5px_#221e32] active:shadow-[inset_3px_3px_6px_#0e0c16,inset_-3px_-3px_6px_#221e32] transition group disabled:opacity-50 text-left border border-white/[0.02]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#181524] shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] flex items-center justify-center text-pink-400 group-hover:scale-105 transition shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-pink-300 transition truncate">
                    .WAV AUDIO LOOP
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">16-bit 44.1kHz Master</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-pink-400 group-hover:translate-y-0.5 transition shrink-0 ml-2" />
            </button>

            {/* MIDI Export Button */}
            <button
              onClick={handleExportMidi}
              disabled={exportingFormat !== null}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#181524] shadow-[5px_5px_10px_#0e0c16,-5px_-5px_10px_#221e32] hover:shadow-[2px_2px_5px_#0e0c16,-2px_-2px_5px_#221e32] active:shadow-[inset_3px_3px_6px_#0e0c16,inset_-3px_-3px_6px_#221e32] transition group disabled:opacity-50 text-left border border-white/[0.02]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#181524] shadow-[inset_2px_2px_4px_#0e0c16,inset_-2px_-2px_4px_#221e32] flex items-center justify-center text-cyan-400 group-hover:scale-105 transition shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-xs sm:text-sm text-slate-200 group-hover:text-cyan-300 transition truncate">
                    .MID FILE (MIDI)
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">GM Drum Channel 10</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-cyan-400 group-hover:translate-y-0.5 transition shrink-0 ml-2" />
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="flex flex-col items-center justify-center text-center text-[10px] text-slate-500 pt-3 border-t border-black/30 gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-400">
            <span>Leonida Sound Systems</span>
            <span>•</span>
            <span>Drum Console Edition</span>
            <span>•</span>
            <span className="font-mono">44.1kHz Audio Engine</span>
          </div>
          <p className="max-w-2xl text-[9px] sm:text-[10px] text-slate-500/80 leading-relaxed font-sans mt-1">
            Disclaimer: "Leonida", "Vice City" and "Ocean Drive" are registered trademarks of Rockstar Games and Take-Two Interactive. Vice Drums is an independent, fan-made project and does not have any affiliation or endorsement with Rockstar Games or Take-Two Interactive.
          </p>
        </footer>

      </div>
    </div>
  );
}
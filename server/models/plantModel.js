const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    // ── Owner Reference ──────────────────────────
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    // ── User-Provided Fields ─────────────────────
    nickname:{
        type: String,
        required: [true,"Please give your plant a name."],
        trim: true,
        minlength: 2,
        maxlength: 15
    },
    imageUrl:{
        type: String,
        required: [true,'Please upload your plant image']
    },

    // ── AI-Identified Fields (Gemini Vision) ─────
    commonName:{
        type: String,       // e.g., "Money Plant"
        default: null
    },
    scientificName:{
        type: String,       // e.g., "Epipremnum aureum"
        default: null
    },
    species:{
        type: String,       // e.g., "E. aureum"
        default: null
    },
    family:{
        type: String,       // e.g., "Araceae"
        default: null
    },
    aiConfidence:{
        type: Number,
        min: 0,
        max: 1,             // 0.94 --> 94%
        default: null
    },
    identificationStatus: {
      type: String,
      enum: ["pending", "identified", "failed", "manual"],
      default: "pending",
    },

    // ── Care Information (AI-populated via Gemini) ──
    careInfo: {
      waterFrequency: { type: String, default: null },  // "Every 7-10 days"
      sunlight:       { type: String, default: null },   // "Bright indirect"
      soilType:       { type: String, default: null },   // "Well-draining"
      temperature:    { type: String, default: null },   // "18-27°C"
      humidity:       { type: String, default: null },   // "High (60%+)"
      toxicity:       { type: String, default: null },   // "Toxic to pets"
      difficulty: {
        type: String,
        enum: ["easy", "moderate", "hard", null],
        default: null,
      },
    },

    // ── Tracking & Logging ───────────────────────
    healthStatus: {
      type: String,
      enum: ["healthy", "needs-attention", "sick", "dormant"],
      default: "healthy",
    },
    notes: {
      type: String,
      maxlength: 500,
      default: "",
    },
    location: {
      type: String,       // "Living room", "Balcony", "Garden"
      default: null,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    lastWatered: {
      type: Date,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,     // adds createdAt & updatedAt automatically
  }
);

// ── Indexes for performance ───────────────────────
plantSchema.index({ user: 1, createdAt: -1 });    // fetch user's plants sorted by newest
plantSchema.index({ user: 1, commonName: 1 });    // search user's plants by name

const Plant = mongoose.models.Plant || mongoose.model("Plant", plantSchema);
module.exports = Plant;

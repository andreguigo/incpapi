const mongoose = require('mongoose');
const uuidv4 = require('uuid').v4;

const CustomerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true
    },

    birthDate: {
      type: Date,
      required: true
    },

    phoneUser: {
      type: String,
      required: true
    },

    selectedVolunteerArea: {
        type: [String],
        default: [],
        set: v => {
            if (!v) return [];
            if (Array.isArray(v)) 
              return v.filter(Boolean).map(i => String(i).trim());

            return String(v)
              .split(',')
              .map(i => i.trim())
              .filter(Boolean);
        }
    },

    baptismDate: {
      type: Date,
      required: false
    },

    selectedMemberDate: {
      type: String,
      required: false
    },

    fileNameUrl: {
      type: String,
      required: false
    },

    cloudinaryId: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Customer', CustomerSchema);
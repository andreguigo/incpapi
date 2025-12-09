import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
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

    phone: {
      type: String,
      required: true
    },

    selectedVolunteerArea: {
        type: [String],
        default: [],
        set: v => {
            if (!v) return [];                          // trata undefined, null ou vazio
            if (Array.isArray(v)) 
            return v.filter(Boolean).map(i => String(i).trim());

            return String(v)
            .split(',')
            .map(i => i.trim())
            .filter(Boolean);                          // remove valores vazios
        }
    },

    baptismDate: {
      type: Date,
      required: false
    },

    selectedMemberDate: {
      type: String,      // se for só o ano, deixe como string
      required: false
    },

    fileNameUrl: {
      type: String,
      required: false
    },

    cloudinaryId: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
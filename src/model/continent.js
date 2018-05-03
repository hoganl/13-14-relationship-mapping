'use strict';

import mongoose from 'mongoose';

const continentSchema = mongoose.Schema({
  location: {
    type: String,
    required: true,
    unique: true,    
  },  
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  penguin: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'penguin',
    },
  ],
});

export default mongoose.model('continent', continentSchema);

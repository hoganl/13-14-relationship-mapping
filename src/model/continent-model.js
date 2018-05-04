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
  penguins: [
    {
      type: mongoose.Schema.Types.ObjectId, ref: 'penguin',
    },
  ],
}, { 
  usePushEach: true,
});

export default mongoose.model('continent', continentSchema);

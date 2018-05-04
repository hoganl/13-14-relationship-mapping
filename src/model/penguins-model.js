'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Continent from './continent-model';

const penguinSchema = mongoose.Schema({
  species: {
    type: String,
    required: true,
    unique: true,    
  },  
  description: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(),
  },
  continent: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'continent',
  },
});

function penguinPreHook(done) {
  return Continent.findById(this.continent)
    .then((continentFound) => {
      if (!continentFound) {
        throw new HttpError(404, 'continent not found');
      }
      continentFound.penguins.push(this._id);
      return continentFound.save();
    })
    .then(() => done())
    .catch(done);
}

const penguinPostHook = (document, done) => {
  return Continent.findById(document.continent)
    .then((continentFound) => {
      if (!continentFound) {
        throw new HttpError(500, 'continent not found');
      }
      continentFound.penguins = continentFound.penguins.filter((penguin) => {
        return penguin._id.toString() !== document._id.toString();
      });
    })
    .then(() => done())
    .catch(done);
};

penguinSchema.pre('save', penguinPreHook);
penguinSchema.post('remove', penguinPostHook);

export default mongoose.model('penguin', penguinSchema);

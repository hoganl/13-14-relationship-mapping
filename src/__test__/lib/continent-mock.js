'use strict';

import faker from 'faker';
import Continent from '../../model/continent-model';

const createContinentMock = () => {
  return new Continent({
    location: faker.lorem.word(2),
    description: faker.lorem.words(15),
  }).save();
};

const removeContinentMock = () => Continent.remove({});

export { createContinentMock, removeContinentMock };

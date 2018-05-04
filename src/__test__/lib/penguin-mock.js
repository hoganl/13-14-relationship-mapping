'use strict';

import faker from 'faker';
import Penguin from '../../model/penguins-model';
import { createContinentMock, removeContinentMock } from './continent-mock';

const createPenguinMock = () => {
  const resultMock = {};

  return createContinentMock()
    .then((createdContinent) => {
      resultMock.continent = createdContinent;

      return new Penguin({
        species: faker.lorem.words(2),
        description: faker.lorem.word(10),
        continent: createdContinent._id,
      }).save();
    })
    .then((newPenguin) => {
      resultMock.penguin = newPenguin;
      return resultMock;
    });
};

const removePenguinMock = () => Promise.all([
  Penguin.remove({}),
  removeContinentMock(),
]);

export { createPenguinMock, removePenguinMock };

'use strict';

import faker from 'faker';
import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createContinentMock } from './lib/continent-mock';
import { createPenguinMock, removePenguinMock } from './lib/penguin-mock';

const apiURL = `http://localhost:${process.env.PORT}/api/penguins`;

describe('/api/penguins', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removePenguinMock);

  describe('POST /api/penguins', () => {
    test('200 status code in creation', () => {
      return createContinentMock()
        .then((continentMock) => {
          const penguinToPost = {
            species: faker.lorem.words(2),
            description: faker.lorem.words(8),
            continent: continentMock._id,
          };
          return superagent.post(apiURL)
            .send(penguinToPost)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.species).toEqual(penguinToPost.species);
              expect(response.body.description).toEqual(penguinToPost.description);
            });
        });
    });

    test('409 due to duplicate species', () => {
      return createContinentMock()
        .then((continentMock) => {
          const penguinToPost = {
            species: faker.lorem.words(2),
            description: faker.lorem.words(8),
            continent: continentMock._id,
          };
          return superagent.post(apiURL)
            .send(penguinToPost);
        })
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });

    test('400 due to lack of species', () => {
      return superagent.post(apiURL)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });

  describe('PUT api/penguins', () => {
    test('200 status code in creation', () => {
      let penguinToUpdate = null;
      return createPenguinMock()
        .then((mock) => {
          penguinToUpdate = mock.penguin;
          return superagent.put(`${apiURL}/${mock.penguin._id}`)
            .send({ species: 'Royal' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.species).toEqual('Royal');
          expect(response.body.description).toEqual(penguinToUpdate.description);
        });
    });
  });

  describe('GET /api/penguins', () => {
    test('200', () => {
      let tempPenguin = null;
      return createPenguinMock()
        .then((mock) => {
          tempPenguin = mock.penguin;
          return superagent.get(`${apiURL}/${mock.penguin._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.species).toEqual(tempPenguin.species);
          expect(response.body.description).toEqual(tempPenguin.description);
        });
    });

    test('404 due to no penguin found', () => {
      return superagent.get(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/penguins', () => {
    test('204', () => {
      return createPenguinMock()
        .then((mock) => {
          return superagent.delete(`${apiURL}/${mock.penguin._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });

    test('404 due to no penguin found', () => {
      return superagent.delete(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

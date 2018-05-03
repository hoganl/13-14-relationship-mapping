'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Continent from '../model/continent';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/continents`;

const createContinentMock = () => {
  return new Continent({
    location: faker.lorem.word(2),
    description: faker.lorem.words(15),
  }).save();
};

describe('/api/continents', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(() => Continent.remove({}));

  describe('POST api/continents', () => {
    test('200', () => {
      const mockContinent = {
        location: faker.lorem.word(2),
        description: faker.lorem.words(20),
      };
      return superagent.post(apiURL)
        .send(mockContinent)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.location).toEqual(mockContinent.location);
          expect(response.body.description).toEqual(mockContinent.description);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();
        });
    });

    test('409 due to duplicate location', () => {
      return createContinentMock()
        .then((continent) => {
          const mockContinent = {
            location: continent.location,
            description: continent.description,
          };
          return superagent.post(apiURL)
            .send(mockContinent);
        })
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });

    test('400 due to lack of location', () => {
      return superagent.post(apiURL)
        .send({})
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });

    test('400 due to bad json', () => {
      return superagent.post(apiURL)
        .send('{')
        .then(Promise.reject)
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });
  
  describe('PUT /api/continents', () => {
    test('200 for successful PUT', () => {
      let continentToUpdate = null;
      return createContinentMock()
        .then((continent) => {
          continentToUpdate = continent;
          return superagent.put(`${apiURL}/${continent._id}`)
            .send({ location: 'New Antarctica' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.location).toEqual('New Antarctica');
          expect(response.body.description).toEqual(continentToUpdate.description);
          expect(response.body._id).toEqual(continentToUpdate._id.toString());
        });
    });

    test('409 due to duplicate location', () => {
      return createContinentMock()
        .then((continent) => {
          return superagent.put(`${apiURL}/${continent._id}`)
            .send({ location: continent.location });
        })
        .catch((err) => {
          expect(err.status).toEqual(409);
        });
    });

    test('404 due to no continent found', () => {
      return superagent.put(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });

    test('400 due to lack of location', () => {      
      return createContinentMock()
        .then((continent) => {
          return superagent.put(`${apiURL}/${continent._id}`)
            .send({ location: '' });
        })
        .catch((err) => {
          expect(err.status).toEqual(400);
        });
    });
  });
  
  describe('GET /api/continents', () => {
    test('200', () => {
      let tempContinent = null;
      return createContinentMock()
        .then((continent) => {
          tempContinent = continent;
          return superagent.get(`${apiURL}/${continent._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.location).toEqual(tempContinent.location);  
          expect(response.body.description).toEqual(tempContinent.description);
          expect(response.body._id).toEqual(tempContinent._id.toString());
        });
    });

    test('404 due to no id being passed', () => {
      return superagent.get(`${apiURL}`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });

    test('404 due to no continent found', () => {
      return superagent.get(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  
  describe('DELETE /api/continents', () => {
    test('204', () => {
      return createContinentMock()
        .then((continent) => {
          return superagent.delete(`${apiURL}/${continent._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('404 due to no continent found', () => {
      return superagent.delete(`${apiURL}/InvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
});

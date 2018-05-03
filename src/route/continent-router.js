'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Continent from '../model/continent';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const continentRouter = new Router();

continentRouter.post('/api/continents', jsonParser, (request, response, next) => {
  if (!request.body.location) {
    logger.log(logger.ERROR, 'CONTINENT-ROUTER: Responding with 400 error code');
    return next(new HttpErrors(400, 'Continent location is required'));
  }
  return new Continent(request.body).save()
    .then(continent => response.json(continent))
    .catch(next);
});

continentRouter.put('/api/continents/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  
  return Continent.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedContinent) => {
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedContinent);
    })
    .catch(next);
});

continentRouter.get('/api/continents/:id', (request, response, next) => {
  return Continent.findById(request.params.id)
    .then((continent) => {
      logger.log(logger.INFO, 'CONTINENT ROUTER: responding with 200 status code');
      logger.log(logger.INFO, `CONTINENT ROUTER: ${JSON.stringify(continent)}`);
      return response.json(continent);
    })
    .catch(next);
});

continentRouter.delete('/api/continents/:id', (request, response, next) => {
  return Continent.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'CONTINENT ROUTER: responding with 204 status code');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default continentRouter;

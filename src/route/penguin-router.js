'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import logger from '../lib/logger';
import Penguin from '../model/penguins-model';

const jsonParser = bodyParser.json();
const penguinRouter = new Router();

penguinRouter.post('/api/penguins', jsonParser, (request, response, next) => {
  if (!request.body.species) {
    logger.log(logger.ERROR, 'PENGUIN-ROUTER: Responding with 400 error code');
    return next(new HttpErrors(400, 'Penguin species is required'));
  }
  return new Penguin(request.body).save()
    .then((penguin) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      response.json(penguin);
    })
    .catch(next);
});

penguinRouter.put('/api/penguins/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  
  return Penguin.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedPenguin) => {
      if (!updatedPenguin) {
        logger.log(logger.INFO, 'PENGUIN-ROUTER: responding with a 404 status code');
        return next(new HttpErrors(404, 'penguin not found'));
      }
      logger.log(logger.INFO, 'PENGUIN-ROUTER: responding with a 200 status code');
      return response.json(updatedPenguin);
    })
    .catch(next);
});

penguinRouter.get('/api/penguins/:id', (request, response, next) => {
  return Penguin.findById(request.params.id)
    .then((penguin) => {
      logger.log(logger.INFO, 'PENGUIN-ROUTER: responding with 200 status code');
      logger.log(logger.INFO, `PENGUIN-ROUTER: ${JSON.stringify(penguin)}`);
      return response.json(penguin);
    })
    .catch(next);
});

penguinRouter.delete('/api/penguins/:id', (request, response, next) => {
  return Penguin.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'PENGUIN-ROUTER: responding with 204 status code');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default penguinRouter;

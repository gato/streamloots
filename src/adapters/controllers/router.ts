import express from 'express';
import CardInteractor from '../../core/interactors/cardInteractor';
import controller from './controller';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (cardInteractor: CardInteractor) => {
    return express
        .Router()
        .post('/', controller.create.bind(controller.create, cardInteractor))
        .get('/', controller.getAll.bind(controller.getAll, cardInteractor))
        .get(
            '/:id',
            controller.getById.bind(controller.getById, cardInteractor)
        )
        .put('/:id', controller.update.bind(controller.update, cardInteractor))
        .post(
            '/publish',
            controller.publish.bind(controller.publish, cardInteractor)
        )
        .post(
            '/unpublish',
            controller.unpublish.bind(controller.unpublish, cardInteractor)
        );
};

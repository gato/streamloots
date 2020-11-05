import CardInteractor from '../../core/interactors/cardInteractor';
import { Request, Response } from 'express';
import status from 'http-status';

// TODO: quick and dirty error management
const errorMapper = {
    'Required fields are missing': status.BAD_REQUEST,
    'card not found': status.NOT_FOUND,
    "You can't update other's people cards": status.FORBIDDEN,
};
const mapError = (s) => {
    return errorMapper[s] || status.INTERNAL_SERVER_ERROR;
};
export class Controller {
    getAll(service: CardInteractor, req: Request, res: Response): void {
        service.getAll(req.userID).then((r) => {
            res.json(r);
        });
    }

    getById(service: CardInteractor, req: Request, res: Response): void {
        service.getById(req.userID, req.params['id']).then((r) => {
            if (r) res.json(r);
            else res.status(status.NOT_FOUND).end();
        });
    }

    create(service: CardInteractor, req: Request, res: Response): void {
        service
            .createCard(req.userID, req.body)
            .then((r) =>
                res
                    .status(status.CREATED)
                    .location(`/api/v1/cards/${r.id}`)
                    .json(r)
            )
            .catch((e) => {
                res.status(mapError(e)).json(e);
            });
    }

    update(service: CardInteractor, req: Request, res: Response): void {
        service
            .updateCard(req.userID, req.params['id'], req.body)
            .then((r) => res.status(status.OK).json(r))
            .catch((e) => {
                res.status(mapError(e)).json(e);
            });
    }

    publish(service: CardInteractor, req: Request, res: Response): void {
        service
            .publish(req.userID, req.body)
            .then((r) => res.status(status.OK).json(r))
            .catch((e) => {
                res.status(mapError(e)).json(e);
            });
    }

    unpublish(service: CardInteractor, req: Request, res: Response): void {
        service
            .unpublish(req.userID, req.body)
            .then((r) => res.status(status.OK).json(r))
            .catch((e) => {
                res.status(mapError(e)).json(e);
            });
    }
}

export default new Controller();

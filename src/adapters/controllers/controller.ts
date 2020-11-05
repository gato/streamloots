import CardInteractor from '../../core/interactors/cardInteractor';
import { Request, Response } from 'express';

export class Controller {
    getAll(service: CardInteractor, req: Request, res: Response): void {
        console.log('getAll', req.userID);
        service.getAll(req.userID).then((r) => {
            res.json(r);
        });
    }

    getById(service: CardInteractor, req: Request, res: Response): void {
        service.getById(req.userID, req.params['id']).then((r) => {
            if (r) res.json(r);
            else res.status(404).end();
        });
    }

    create(service: CardInteractor, req: Request, res: Response): void {
        service
            .createCard(req.userID, req.body)
            .then((r) =>
                res.status(201).location(`/api/v1/cards/${r.id}`).json(r)
            );
    }
}

export default new Controller();

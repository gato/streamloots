import CardInteractor from '../../core/interactors/cardInteractor';
import { Request, Response } from 'express';

export class Controller {
    getAll(service: CardInteractor, req: Request, res: Response): void {
        service.getAll('user1').then((r) => {
            console.log(r);
            res.json(r);
        });
    }

    getById(service: CardInteractor, req: Request, res: Response): void {
        service.getById('user1', req.params['id']).then((r) => {
            if (r) res.json(r);
            else res.status(404).end();
        });
    }

    create(service: CardInteractor, req: Request, res: Response): void {
        console.log(req.body);
        service
            .createCard('user1', req.body)
            .then((r) =>
                res.status(201).location(`/api/v1/cards/${r.id}`).json(r)
            );
    }
}

export default new Controller();

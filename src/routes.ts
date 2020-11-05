import { Application } from 'express';
import cardService from './cardService';
import cardsRouter from './adapters/controllers/router';
export default function routes(app: Application): void {
    app.use('/api/v1/cards', cardsRouter(cardService));
}

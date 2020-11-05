import CardInteractor from './core/interactors/cardInteractor';
import { MongoCardRepository } from './adapters/repository/mongodbCardRepository';
import { DummyAnalytics } from './adapters/repository/dummyAnalytics';
import './common/env';

const mongoCardRepository = new MongoCardRepository(
    process.env.MONGODB_HOST,
    parseInt(process.env.MONGODB_PORT)
);
const analytics1 = new DummyAnalytics('dummy analytics 1');
const analytics2 = new DummyAnalytics('dummy analytics 2');

export default new CardInteractor(mongoCardRepository, [
    analytics1,
    analytics2,
]);

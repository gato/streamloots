import Card from '../entities/Card';

export interface AnalyticsRepository {
    cardCreated(card: Card): boolean;
    cardPublished(card: Card): boolean;
}

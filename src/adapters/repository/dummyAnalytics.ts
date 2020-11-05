import Card from '../../core/entities/Card';
import { AnalyticsRepository } from '../../core/repositories/analyticsRepository';
import l from '../../common/logger';
export class DummyAnalytics implements AnalyticsRepository {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    cardCreated(card: Card): boolean {
        l.info(`[${this.name}] card ${card} created`);
        return true;
    }
    cardPublished(card: Card): boolean {
        l.info(`[${this.name}] card ${card} published`);
        return true;
    }
}

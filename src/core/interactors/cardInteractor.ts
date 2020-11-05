import Card from '../entities/Card';
import { AnalyticsRepository } from '../repositories/analyticsRepository';
import { CardRepository } from '../repositories/cardRepository';
import { v4 as uuidv4 } from 'uuid';

export default class CardInteractor {
    cardRepository: CardRepository;
    analytics: Array<AnalyticsRepository>;

    constructor(
        cardRepository: CardRepository,
        analytics: AnalyticsRepository[]
    ) {
        this.cardRepository = cardRepository;
        this.analytics = analytics;
    }

    private isValid(card: Card, force: boolean): boolean {
        if (card.published || force) {
            return card.image !== '' && card.name !== '' && card.limit >= 0;
        }
        return true;
    }

    public async getById(user: string, id: string): Promise<Card> {
        return await this.cardRepository.get(user, id);
    }

    public async getAll(user: string): Promise<Card[]> {
        return await this.cardRepository.getAll(user);
    }

    public async createCard(user: string, card: Card): Promise<Card> {
        if (!this.isValid(card, false)) {
            throw new Error('Required fields are missing');
        }
        card.id = uuidv4().replace('-', '');
        card.owner = user;
        const c = await this.cardRepository.create(user, card);
        this.analytics.forEach((a) => a.cardCreated(c));
        return c;
    }

    public async updateCard(user: string, card: Card): Promise<Card> {
        if (!this.isValid(card, false)) {
            throw new Error('Required fields are missing');
        }
        const c: Card = await this.cardRepository.get(user, card.id);
        if (c.owner !== user) {
            throw new Error("You can't update other's people cards");
        }
        card = await this.cardRepository.save(user, card);
        if (c.published !== card.published && c.published === false) {
            // card published, notify
            this.analytics.forEach((a) => a.cardPublished(c));
        }
        return c;
    }

    public async publish(user: string, ids: Array<string>): Promise<boolean> {
        // TODO: maybe this should be done more eficiently in other level (like repository, but is business logic so it should be here)
        // retrieve all cards
        const cards = await Promise.all(
            ids.map((id) => this.cardRepository.get(user, id))
        );
        // check if all can be published
        if (!cards.every((c) => this.isValid(c, true) && c.owner === user)) {
            return false;
        }

        let unpublished = cards.filter((c) => !c.published);

        // store unpublished cards as published
        unpublished = await Promise.all(
            unpublished.map((c) => {
                c.published = true;
                return this.cardRepository.save(user, c);
            })
        );

        // notify publishing
        unpublished.forEach((c) => {
            this.analytics.forEach((a) => {
                a.cardPublished(c);
            });
        });
        return true;
    }

    public async unpublish(user: string, ids: Array<string>): Promise<boolean> {
        // TODO: maybe this should be done more eficiently in other level (like repository, but is business logic so it should be here)
        // retrieve all cards
        let cards = await Promise.all(
            ids.map((id) => this.cardRepository.get(user, id))
        );

        // check if he/she owns all cards
        if (!cards.every((c) => c.owner === user)) {
            return false;
        }

        cards = cards.filter((c) => c.published);

        // store published cards as unpublished
        await Promise.all(
            cards.map((c) => {
                c.published = false;
                return this.cardRepository.save(user, c);
            })
        );
        return true;
    }
}

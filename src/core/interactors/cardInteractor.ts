import Card from '../entities/Card';
import { AnalyticsRepository } from '../repositories/analyticsRepository';
import { CardRepository } from '../repositories/cardRepository';
import { v4 as uuidv4 } from 'uuid';
import Rarity from '../entities/Rarity';

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
            return (
                !!card.image &&
                !!card.name &&
                Object.values(Rarity).includes(card.rarity) &&
                card.limit >= 0
            );
        }
        return (
            !!card.image ||
            !!card.name ||
            Object.values(Rarity).includes(card.rarity) ||
            card.limit >= 0
        );
    }

    public async getById(user: string, id: string): Promise<Card> {
        return await this.cardRepository.get(user, id);
    }

    public async getAll(user: string): Promise<Card[]> {
        return await this.cardRepository.getAll(user);
    }

    public async createCard(user: string, card: Card): Promise<Card> {
        if (!this.isValid(card, false)) {
            return Promise.reject('Required fields are missing');
        }
        card.id = uuidv4().replace(/-/g, '');
        card.owner = user;
        const c = await this.cardRepository.create(user, card);
        this.analytics.forEach((a) => a.cardCreated(c));
        return c;
    }

    public async updateCard(
        user: string,
        id: string,
        card: Card
    ): Promise<Card> {
        if (!this.isValid(card, false)) {
            return Promise.reject('Required fields are missing');
        }
        let c: Card = await this.cardRepository.get(user, id);
        if (!c) {
            return Promise.reject('card not found');
        }
        if (c.owner !== user) {
            return Promise.reject("You can't update other people's cards");
        }
        const published = c.published;
        c.image = card.image;
        c.limit = card.limit;
        c.name = card.name;
        c.rarity = card.rarity;
        c.published = card.published;
        c = await this.cardRepository.save(user, c);
        if (published !== c.published && c.published === true) {
            // card published, notify
            this.analytics.forEach((a) => a.cardPublished(c));
        }
        return c;
    }

    public async publish(user: string, ids: Array<string>): Promise<boolean> {
        // TODO: maybe this should be done more eficiently in other level (like repository, but is business logic so it should be here)
        // retrieve all cards
        let cards = await Promise.all(
            ids.map((id) => this.cardRepository.get(user, id))
        );
        // check if all cards where found
        if (!cards.every((c) => c !== null)) {
            return Promise.reject('card not found');
        }

        // check if all can be published
        if (!cards.every((c) => this.isValid(c, true) && c.owner === user)) {
            return Promise.reject("You can't update other people's cards");
        }

        cards = cards.filter((c) => !c.published);

        // store unpublished cards as published
        cards = await Promise.all(
            cards.map((c) => {
                c.published = true;
                return this.cardRepository.save(user, c);
            })
        );

        // notify publishing
        cards.forEach((c) => {
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
        // check if all cards where found
        if (!cards.every((c) => c !== null)) {
            return Promise.reject('card not found');
        }

        // check if all can be published
        if (!cards.every((c) => this.isValid(c, true) && c.owner === user)) {
            return Promise.reject("You can't update other people's cards");
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

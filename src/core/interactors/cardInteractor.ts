
import Card from "../entities/Card";
import { AnalyticsRepository } from "../repositories/analyticsRepository";
import { CardRepository } from "../repositories/cardRepository";

export default class CardInteractor {
    cardRepository: CardRepository;
    analytics: Array<AnalyticsRepository>;

    constructor(cardRepository: CardRepository, analytics: Array<AnalyticsRepository>) {
      this.cardRepository = cardRepository;
      this.analytics = analytics;
    }

    private isValid(card: Card, force: boolean): boolean {
        if (card.published || force) {
            return card.image !== "" && card.name !== "" && card.limit >= 0;
        }
        return true;        
    }

    public async getById(id: string): Promise<Card> {
        return this.cardRepository.get(id);
    }

    public async getAllByUser(user: string): Promise<Array<Card>> {
        return this.cardRepository.getAllByUser(user);
    }

    public async getAllByOwner(owner: string): Promise<Array<Card>> {
        return this.cardRepository.getAllByOwner(owner);
    }

    public async createCard(card: Card): Promise<Card> {
        if (!this.isValid(card, false)) {
            throw new Error("Required fields are missing");
        }
        let c = await this.cardRepository.create(card);
        this.analytics.forEach(a => a.cardCreated(c));
        return c;
    }

    public async updateCard(card: Card): Promise<Card> {
        if (!this.isValid(card, false)) {
            throw new Error("Required fields are missing");
        }
        let c = await this.cardRepository.save(card);
        return c;
    }

    public async publish(ids: Array<string>): Promise<boolean> {
        // TODO: maybe this should be done more eficiently in other level (like repository, but is business logic so it should be here)
        // retrieve all cards
        let cards =  await Promise.all(ids.map(id => this.cardRepository.get(id)));
        // check if all can be published
        if (!cards.every(c => this.isValid(c, true))) {
            return false;
        }
        
        let unpublished = cards.filter(c => !c.published);

        // store unpublished cards as published
        cards = await Promise.all(unpublished.map( c => {
            c.published = true;
            return this.cardRepository.save(c);
        }));

        // notify publishing 
        cards.forEach( c => {
            this.analytics.forEach(a => {
                a.cardPublished(c);
            });
        });
        return true;
    }

    public async unpublish(ids: Array<string>): Promise<boolean> {
        // TODO: maybe this should be done more eficiently in other level (like repository, but is business logic so it should be here)
        // retrieve all cards
        let cards =  await Promise.all(ids.map(id => this.cardRepository.get(id)));
        
        let published = cards.filter(c => c.published);

        // store published cards as unpublished
        await Promise.all(published.map( c => {
            c.published = false;
            return this.cardRepository.save(c);
        }));
        return true;
    }

};


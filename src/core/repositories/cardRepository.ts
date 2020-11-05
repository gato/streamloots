import Card from '../entities/Card';

export interface CardRepository {
    get(user: string, id: string): Promise<Card>;
    getAll(user: string): Promise<Card[]>;
    create(user: string, card: Card): Promise<Card>;
    save(user: string, card: Card): Promise<Card>;
}

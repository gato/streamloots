import Card from '../entities/Card';

export interface CardRepository {
    get(id: string): Promise<Card>;
    getAllByUser(user: string): Promise<Array<Card>>;
    getAllByOwner(owner: string): Promise<Array<Card>>;
    create(card: Card): Promise<Card>;
    save(card: Card): Promise<Card>;
};

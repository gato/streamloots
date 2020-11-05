import Card from '../../core/entities/Card';
import Rarity from '../../core/entities/Rarity';
import { CardRepository } from '../../core/repositories/cardRepository';
import MongoClient from 'mongodb';

interface MongoCard {
    id: string;
    owner: string;
    name: string;
    image: string;
    limit: number;
    rarity: Rarity;
    published: boolean;
}

export class MongoCardRepository implements CardRepository {
    private async getDB() {
        const url = 'mongodb://localhost:27017';
        const client = await MongoClient.connect(url, {
            useUnifiedTopology: true,
        });
        return client.db('streamloots');
    }

    private mongoCard2Card(card: MongoCard, used: number, owned: number): Card {
        const c: Card = {
            id: card.id,
            image: card.image,
            owner: card.owner,
            limit: card.limit,
            name: card.name,
            rarity: card.rarity,
            published: card.published,
            used: used,
            owned: owned,
        };
        return c;
    }

    private card2MongoCard(card: Card): MongoCard {
        const c: MongoCard = {
            id: card.id,
            image: card.image,
            owner: card.owner,
            limit: card.limit,
            name: card.name,
            rarity: card.rarity,
            published: card.published,
        };
        return c;
    }

    public async get(user: string, id: string): Promise<Card> {
        const db = await this.getDB();
        const card: MongoCard = await db.collection('cards').findOne({ id });
        if (card === null) {
            return null;
        }
        // TODO: calculate owned and used
        const used = 0;
        const owned = 0;
        return this.mongoCard2Card(card, used, owned);
    }

    public async getAll(user: string): Promise<Card[]> {
        const db = await this.getDB();
        const cards: MongoCard[] = await db
            .collection('cards')
            .find({
                $or: [
                    {
                        owner: user,
                    },
                    {
                        published: true,
                    },
                ],
            })
            .toArray();
        return cards.map((c) => {
            // TODO: calculate owned and used
            const used = 0;
            const owned = 0;
            return this.mongoCard2Card(c, used, owned);
        });
    }
    public async create(user: string, card: Card): Promise<Card> {
        const db = await this.getDB();
        const c: MongoCard = this.card2MongoCard(card);
        await db.collection('cards').insertOne(c);
        return this.mongoCard2Card(c, 0, 0);
    }

    public async save(user: string, card: Card): Promise<Card> {
        const db = await this.getDB();
        const c: MongoCard = this.card2MongoCard(card);
        await db.collection('cards').updateOne({ id: c.id }, { $set: c });
        // TODO: calculate owned and used
        const used = 0;
        const owned = 0;
        return this.mongoCard2Card(card, used, owned);
    }
}

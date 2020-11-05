import Rarity from './Rarity';

export default interface Card {
    id: string;
    owner: string;
    name: string;
    image: string;
    limit: number;
    rarity: Rarity;
    published: boolean;
    owned: number;
    used: number;
}

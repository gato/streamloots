import Rarity from './Rarity';
import User from './User';


export default interface Card {
  id: string;
  owner: User;
  name: string;
  image: string;
  limit: number;
  rarity: Rarity;
  published: boolean;
  owned: number;
  used: number;
};
  
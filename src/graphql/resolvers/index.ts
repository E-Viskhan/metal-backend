import { Article } from './Article';
import { Transaction } from './Transaction';
import { InventoryItem } from './InventoryItem';
import { Inventory } from './Inventory';
import { User } from './User';
import { user } from "./Mutation/user"
import { Query } from "./Query"

export default {
  Query,
  Mutation: {
    ...user,
  },
  User,
  Inventory,
  InventoryItem,
  Transaction,
  Article
}
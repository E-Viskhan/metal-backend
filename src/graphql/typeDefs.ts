import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    password: String!
    firstname: String!
    lastname: String!
    firstScreen: String!
    transactions: [Transaction!]!
    inventories: [Inventory!]!
  }

  type Article {
    id: Int!
    name: String!
    price: Float!
    transactions: [Transaction!]!
    inventoryItems: [InventoryItem!]!
  }

  type Transaction {
    id: Int!
    operationType: OperationType!
    createdAt: String!
    updatedAt: String!
    count: Float!
    price: Float!
    amount: Float!
    author: User!
    authorId: Int!
    article: Article!
    articleId: Int!
    articleName: String!
  }

  type InventoryItem {
    id: Int!
    article: Article!
    articleId: Int!
    articleName: String!
    count: Float!
    inventory: Inventory!
    inventoryId: Int!
  }

  type Inventory {
    id: Int!
    createdAt: String!
    updatedAt: String!
    inventoryItems: [InventoryItem!]!
    author: User!
    authorId: Int!
  }

  enum OperationType {
    PURCHASE
    SALE
  }

  type Query {
    users: [User!]!
    transactions: [Transaction!]!
    inventories: [Inventory!]!
    articles: [Article!]!
  }

  type Mutation {
    createUser(email: String!, password: String!, firstname: String!): User!
  }
`;

export default typeDefs;
import { gql } from "graphql-tag";

export const authDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        password_hash: String!
        location: Location
    }

    type Location {
        with: ID
        coords: Coords
        timestamp: String!
    }

    type Coords {
        longitude: Float!
        latitude: Float!
    }

    type Session {
        id: ID!
        user_id: ID!
        expires_at: String!
    }

    type Mutation {
        signup(email: String!, username: String!, password: String!): Session
        login(username: String!, password: String!): Session

        userLocationToCoords(longitude: Float!, latitude: Float!): Location
        userLocationToUser(id: ID!): Location
    }

    type Query {
        currentUser: User
        user(id: ID!): User
    }
`;

/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Location = {
  __typename?: 'Location';
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  login?: Maybe<Session>;
  signup?: Maybe<Session>;
  userLocation?: Maybe<Location>;
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationSignupArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUserLocationArgs = {
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  user?: Maybe<User>;
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Session = {
  __typename?: 'Session';
  expires_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  user_id: Scalars['ID']['output'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location?: Maybe<Location>;
  password_hash: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

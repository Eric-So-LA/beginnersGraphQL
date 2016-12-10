import * as _ from 'underscore';

// This is the Dataset in our blog
import PostsList from './data/posts';
import AuthorsList from './data/authors';
import {CommentList, ReplyList} from './data/comments';

import {
  // These are the basic GraphQL types
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
  GraphQLObjectType,
  GraphQLEnumType,

  // This is used to create required fields and arguments
  GraphQLNonNull,

  // This is the class we need to create the schema
  GraphQLSchema
} from 'graphql';

/**
  DEFINE YOUR TYPES BELOW
**/

// This is the Root Query
const Query = new GraphQLObjectType({
  name: 'BlogSchema',
  description: 'Root of the Blog Schema',
  fields: () => ({
    echo: {
      type: GraphQLString,
      description: 'Echo what you enter',
      args: {
        message: {type: GraphQLString}
      },
      resolve: function(source, {message}) {
        return message;
      }
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: function() {
        return PostsList;
      }
    }
  })
});

const Mutation = new GraphQLObjectType({
  name: "BlogMutations",
  descirption: "Mutations of blog posts",
  fields: () => ({
    createPost: {
      type: Post,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString)},
        content: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: function(source, args) {
        let post = Object.assign({}, args);

        post._id = `${Date.now()}::${Math.ceil(Math.random()*99999999)}`;

        post.author = args.author || "arunoda";

        PostsList.push(post);

        return post;
      }
    }
  })
})
const Post = new GraphQLObjectType({
  name: "Post",
  description: "This represents a Post",
  fields: () => ({
    _id: {type: new GraphQLNonNull(GraphQLString)},
    title: {type: new GraphQLNonNull(GraphQLString),
      resolve: function(post) {
        return `Title is: ${post.title}` || "Does not exist";
      }
    },
    content: {type: GraphQLString},
    author: {
      type: Author,
      resolve: function(post) {
        return AuthorsList.find(a => a._id == post.author);
      }
    }
  })
});

const Author = new GraphQLObjectType({
  name: "Author",
  description: "This represents an author",
  fields: () => ({
    _id: { type: new GraphQLNonNull(GraphQLString)},
    name: { type: GraphQLString}
  })
});





// The Schema
const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default Schema;

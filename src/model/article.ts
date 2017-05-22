import * as mongoose from 'mongoose';
import {IUser} from "./user";
let Schema = mongoose.Schema;
let ObjectId = mongoose.Schema.Types.ObjectId;

export interface IArticle extends mongoose.Document {
  title: string;
  slug: string;
  content: string;
  user: IUser;
  tag: Array<string>;
  comments: Array<{body: string, user: IUser, createdAt: Date}>;
}

const getTags = tags => tags.join(',');
const setTags = tags => tags.split(',');

export let ArticleType = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  },
  user: {
    type: ObjectId,
    ref: 'User'
  },
  comments: [{
    body: {type: String, default: ''},
    user: {type: ObjectId, ref: 'User'},
    createdAt: {type: Date, default: Date.now}
  }],
  tag: {
    type: [], get: getTags, set: setTags
  },
}, {
  timestamps: true
});

export let ArticleModel = mongoose.model<IArticle>('article', ArticleType, 'articles', true);

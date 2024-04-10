import snoowrap from "snoowrap";

const reddit = new snoowrap({
  userAgent: "leads script",
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

export default reddit;

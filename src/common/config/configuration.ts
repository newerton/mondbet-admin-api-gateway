export default () => ({
  jwt: {
    secret: process.env.AUTH_SECRET,
    expiresIn: '15d',
  },
});

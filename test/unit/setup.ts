export default () => {
  process.env = {
    NODE_ENV: 'test',
    HTTP_PORT: '3000',
    TYPEORM_DATABASE: 'brain_agriculture',
    TYPEORM_PORT: '5432',
    TYPEORM_HOST: 'localhost',
    TYPEORM_USERNAME: 'postgres',
    TYPEORM_PASSWORD: 'password'
  };
};

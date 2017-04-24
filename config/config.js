const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';

export const logStars = function(message) {
  console.info('**********');
  console.info(message);
  console.info('**********');
};

export default {
	// change localhost to mongo for docker
  mongoDb: 'mongodb://localhost:27017/test',
  seedDb: true,
  port: env.PORT || 8090
};

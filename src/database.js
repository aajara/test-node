import redis from 'redis';
const config = require('./config/config');

const client = redis.createClient(config.redis_url, {no_ready_check: true});
client.AUTH(config.redis_pass);

client.on('connect', function(){
    console.log('Redis conectado')
})

module.exports = client;
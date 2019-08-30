import redis from 'redis';

const client = redis.createClient("redis://redis-18745.c91.us-east-1-3.ec2.cloud.redislabs.com:18745", {no_ready_check: true});
client.AUTH("VzPXYgbHgN6SxXVpZRjgHxq2hD74eMhx");

client.on('connect', function(){
    console.log('Redis conectado')
})

module.exports = client;
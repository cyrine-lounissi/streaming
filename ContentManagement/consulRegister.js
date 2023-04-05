const Consul = require('consul');
const consulHost = process.env.CONSUL_HOST
const consul = new Consul({
    host: `${consulHost}`, // Consul server address
    port: 8500, // Consul server port
    promisify: true // Enable promises instead of callbacks
  });
const registerService = (name, port, healthCheckEndpoint) => {
  const check = {
    http: `http://172.17.0.6:${port}${healthCheckEndpoint}`,
    interval: '10s',
    timeout: '5s'
  };

  const registrationOptions = {
    name,
    address: `${consulHost}`,
    port,
    check
  };

  consul.agent.service.register(registrationOptions)
  .then(() => {
    console.log(`Service ${name} registered with Consul`);
  })
  .catch((error) => {
    console.error(`Error registering service ${name} with Consul:`, error.message);
  });

};

module.exports = registerService;
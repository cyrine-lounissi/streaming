const Consul = require('consul');

const consul = new Consul({
    host: '172.17.0.4', // Consul server address
    port: 8500, // Consul server port
    promisify: true // Enable promises instead of callbacks
  });
const registerService = (name, port, healthCheckEndpoint) => {
  const check = {
    http: `http://172.17.0.5:${port}${healthCheckEndpoint}`,
    interval: '10s',
    timeout: '5s'
  };

  const registrationOptions = {
    name,
    address: '172.17.0.4',
    port,
    check
  };

  consul.agent.service.register(registrationOptions, (err) => {
    if (err) throw err;
    console.log(`Service ${name} registered with Consul`);
  });
};

module.exports = registerService;
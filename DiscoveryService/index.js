const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const consul = require('consul');

const app = express();
const PORT = 8080;

// Define the Consul client options
const consulClientOptions = {
  host: '172.17.0.4', // Set the Consul server host
  port: 8500, // Set the Consul server port
  promisify: true, // Enable promise-based API
};

// Instantiate a new Consul client object with the options
const consulClient = new consul(consulClientOptions);
// Define the Consul service lookup middleware
console.log(consulClient.catalog.service);
const getServiceURL = async (req, res, next) => {
  try {
    // Retrieve the service name from the request URL parameters
    const { serviceName } = req.params;
    const endpoint = req.url.replace(`/api/${serviceName}/`, '');

    console.log(serviceName);
    console.log(`Endpoint: ${endpoint}`);

      if (consulClient.catalog && consulClient.catalog.service) {
        const nodes = await consulClient.catalog.service.nodes({ service: serviceName});
        if (nodes.length > 0) {
      const node = nodes[0];
      const address = node.ServiceAddress;
      const port = node.ServicePort;
      console.log(port);
      console.log(`${serviceName} service is available at 172.17.0.5:${port}`);
      
      const serviceURL = `http://172.17.0.5:${port}${endpoint}`;
      console.log('this the service url');
      console.log(serviceURL);
  
      // Set the service URL in the request headers
      res.locals.target = serviceURL;
  
      next();
    } else {
      console.log('VideoStreaming service is not available');
    }

    // Construct the service URL
   
        // rest of your code
      } else {
        console.log("consulClient.catalog.service does not exist");
      }
      
    
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving service information from Consul.');
  }
};

app.use('/api/:serviceName/', getServiceURL, (req, res) => {
  const targetUrl = res.locals.target;
  const options = {
    target: targetUrl,
    changeOrigin: true,
    pathRewrite: function(path, req) {
      const serviceName = req.params.serviceName;
      return path.replace(new RegExp(`api/${serviceName}/.*`), '');
    }
  };
  const proxy = createProxyMiddleware(options);
  proxy(req, res);
});
// Start the API Gateway server
app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});


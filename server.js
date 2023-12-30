const corsAnywhere = require('cors-anywhere');

const PORT = process.env.PORT || 8000;

// Create a CORS Anywhere server with the options
const corsOptions = {
  originWhitelist: [], // Allow all origins
  requireHeaders: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
};

// Start the CORS Anywhere server
const server = corsAnywhere.createServer(corsOptions);

// Listen on the specified port
server.listen(PORT, () => {
  console.log(`CORS Anywhere server is running on http://localhost:${PORT}`);
});



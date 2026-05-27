const loggerMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    
    console.log(`
    📝 [${timestamp}]
    Method: ${req.method}
    URL: ${req.path}
    Status: ${res.statusCode}
    Duration: ${duration}ms
    IP: ${req.ip}
    `);
  });

  next();
};

module.exports = loggerMiddleware;

const errorHandler = (err, req, res, next) => {
  // Use the status code from the error if it exists, otherwise default to 500
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    // Provide stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// We are exporting an object containing the function
module.exports = { 
    errorHandler 
};

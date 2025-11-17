module.exports = async (req, res) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    status: 'ok',
    service: 'PDF Analyzer API',
    timestamp: new Date().toISOString(),
  });
};

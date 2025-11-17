module.exports = async (req, res) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return res.status(200).json(corsHeaders);
  }

  return res.status(200).json({
    ...corsHeaders,
    status: 'ok',
    service: 'PDF Analyzer API',
    timestamp: new Date().toISOString(),
  });
};

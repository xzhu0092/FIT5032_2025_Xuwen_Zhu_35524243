exports.handler = async (event) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };
  }

  try {
    const { ratings } = JSON.parse(event.body || '{}');
    if (!Array.isArray(ratings)) {
      return { statusCode: 400, headers: cors, body: 'Invalid payload' };
    }

    const n = ratings.length;
    const avg = n ? ratings.reduce((s, r) => s + Number(r.score || 0), 0) / n : 0;

    const buckets = { '1★': 0, '2★': 0, '3★': 0, '4★': 0, '5★': 0 };
    const bySection = {};

    ratings.forEach(r => {
      const s = Math.max(1, Math.min(5, Number(r.score || 0)));
      buckets[`${s}★`] = (buckets[`${s}★`] || 0) + 1;

      const sec = r.section || 'Unknown';
      bySection[sec] = bySection[sec] || { count: 0, total: 0 };
      bySection[sec].count += 1;
      bySection[sec].total += s;
    });

    Object.keys(bySection).forEach(k => {
      const { count, total } = bySection[k];
      bySection[k].avg = count ? +(total / count).toFixed(2) : 0;
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...cors },
      body: JSON.stringify({
        count: n,
        average: +avg.toFixed(2),
        buckets,
        bySection,
      }),
    };
  } catch (e) {
    return { statusCode: 500, headers: cors, body: 'Server error: ' + (e.message || 'unknown') };
  }
};

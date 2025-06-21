const supabase = require('../utils/supabase');

const handleOAuthRedirect = async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).send('Missing OAuth code');

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return res.status(400).json({ error: error.message });

    res.redirect(`/auth/success?access_token=${data.session.access_token}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserSession = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) return res.status(401).json({ error: error.message });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { handleOAuthRedirect, getUserSession };
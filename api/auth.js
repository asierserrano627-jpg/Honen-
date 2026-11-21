export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!clientId || !clientSecret || !redirectUri || !guildId) {
    return res.status(500).json({ error: 'Faltan variables de entorno en Vercel.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const code = body?.code;
    if (!code) return res.status(400).json({ error: 'Falta el código OAuth.' });
    if (body.redirectUri && body.redirectUri !== redirectUri) {
      return res.status(400).json({ error: 'La URL de redirección no coincide.' });
    }

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || !tokenData.access_token) {
      return res.status(401).json({ error: 'Discord no pudo validar el código OAuth.' });
    }

    const headers = { Authorization: `Bearer ${tokenData.access_token}` };
    const [userResponse, guildsResponse] = await Promise.all([
      fetch('https://discord.com/api/users/@me', { headers }),
      fetch('https://discord.com/api/users/@me/guilds', { headers })
    ]);
    const user = await userResponse.json();
    const guilds = await guildsResponse.json();

    if (!userResponse.ok || !user.id || !guildsResponse.ok || !Array.isArray(guilds)) {
      return res.status(401).json({ error: 'No se pudieron obtener los datos de Discord.' });
    }

    const inServer = guilds.some(guild => guild.id === guildId);
    return res.status(200).json({
      id: user.id,
      username: user.username,
      global_name: user.global_name || user.username,
      avatar: user.avatar,
      inServer
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno al completar el login.' });
  }
}

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    clientId: !!process.env.DISCORD_CLIENT_ID,
    clientSecret: !!process.env.DISCORD_CLIENT_SECRET,
    redirectUri: !!process.env.DISCORD_REDIRECT_URI,
    guildId: !!process.env.DISCORD_GUILD_ID
  });
}

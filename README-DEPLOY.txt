HONEN — PROYECTO LISTO PARA GITHUB + VERCEL

ARCHIVOS (mantén estos nombres y carpetas):
index.html
package.json
vercel.json
api/auth.js

SUBIR A GITHUB
1. Crea un repositorio llamado Honen.
2. Sube el contenido de esta carpeta a la raíz del repositorio.
3. Comprueba que api/auth.js está dentro de la carpeta api.

CONECTAR VERCEL
1. Entra en https://vercel.com/new
2. Importa el repositorio Honen desde GitHub.
3. Usa los valores predeterminados para un proyecto estático/Node.js y pulsa Deploy.
4. En Settings → Environment Variables añade:
   DISCORD_CLIENT_ID = 1555251496537301053
   DISCORD_CLIENT_SECRET = (tu Client Secret privado)
   DISCORD_REDIRECT_URI = https://discordlogin-green.vercel.app
   DISCORD_GUILD_ID = 1503164380093743174
5. Guarda y haz Redeploy.

DISCORD DEVELOPER PORTAL
En tu aplicación → OAuth2 → Redirects, registra exactamente:
https://discordlogin-green.vercel.app

IMPORTANTE
- El dominio discordlogin-green.vercel.app debe estar asignado a ESTE proyecto Vercel.
- El HTML envía el código a /api/auth en el mismo dominio.
- No subas DISCORD_CLIENT_SECRET a GitHub ni lo pongas en index.html.
- El backend intercambia el código OAuth, consulta el perfil y verifica la pertenencia al servidor 1503164380093743174.
- Este backend devuelve datos de perfil al navegador y el HTML los guarda en localStorage. No es una sesión segura de servidor; para una aplicación pública conviene migrar a cookies HttpOnly.
- El inicio de sesión real solo se confirma después de configurar Discord y probar el despliegue.

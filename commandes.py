import discord
import json
from discord.ext import commands

with open("configue.json", "r") as file:
    key = json.load(file)

with open(key["configpath"], "r") as file:
    data = json.load(file)

token = key["TOKEN"]

intents = discord.Intents.all()
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.command()
@commands.has_permissions(manage_channels=True)  # Vérifie que l'utilisateur a les permissions requises
async def silence(ctx, member: discord.Member, duration: int, unit: str = "minutes", *, reason=None):
    """Réduit au silence un utilisateur dans tous les salons pour une durée définie."""
    # Conversion de la durée en secondes
    time_units = {"minutes": 60, "hours": 3600, "days": 86400}
    if unit not in time_units:
        await ctx.send("❌ Unité de temps invalide. Utilisez 'minutes', 'heures' ou 'jours'.")
        return
    
    duration_in_seconds = duration * time_units[unit]
    if duration_in_seconds <= 0:
        await ctx.send("❌ La durée doit être un nombre positif.")
        return

    # Réduire l'utilisateur au silence dans tous les salons
    for channel in ctx.guild.channels:
        try:
            await channel.set_permissions(member, send_messages=False, reason=reason)
        except discord.Forbidden:
            await ctx.send(f"❌ Je n'ai pas les permissions nécessaires pour modifier les permissions dans le salon {channel.name}.")
            return

    await ctx.send(f"🔇 {member.mention} a été réduit au silence pour {duration} {unit} pour la raison : {reason if reason else 'Aucune raison donnée.'}")

    # Attendre la durée définie
    await asyncio.sleep(duration_in_seconds)

    # Restaurer les permissions après la durée
    for channel in ctx.guild.channels:
        try:
            await channel.set_permissions(member, overwrite=None, reason="Fin de la durée de silence.")
        except discord.Forbidden:
            await ctx.send(f"⚠️ Impossible de restaurer les permissions dans le salon {channel.name}.")

    await ctx.send(f"🔊 {member.mention} peut de nouveau parler.")

@silence.error
async def silence_error(ctx, error):
    if isinstance(error, commands.MissingPermissions):
        await ctx.send("❌ Vous n'avez pas les permissions nécessaires pour utiliser cette commande.")
    elif isinstance(error, commands.MissingRequiredArgument):
        await ctx.send("❌ Veuillez spécifier un membre, une durée et une unité de temps.")
    elif isinstance(error, commands.BadArgument):
        await ctx.send("❌ Veuillez mentionner un utilisateur valide et fournir une durée correcte.")
    else:
        await ctx.send("❌ Une erreur est survenue.")

bot.run(token=token)
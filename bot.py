import discord
import random
from discord.ext import commands

token = 'token'

intents = discord.Intents.default()
intents.messages = True
mentions = discord.Intents.default()
mentions.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

@bot.event
async def on_ready():
    activity = discord.Game(name="bruh bruh bruh")
    await bot.change_presence(activity=activity)
    print(f'Connecté en tant que {bot.user}')

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return
    
    if bot.user in message.mentions:
        bruh_count = random.randint(1, 50)
        response = " ".join(["bruh"] * bruh_count)
        await message.channel.send(response)
    
    # 1 chance sur 3 de répondre "bruh" à un message
    elif random.randint(1, 3) == 1:
        bruh_count = random.randint(1, 50)  # Nombre de "bruh" entre 1 et 50
        response = " ".join(["bruh"] * bruh_count) 
        await message.channel.send(response)
    
    # Récupérer les émojis personnalisés du serveur
    guild = message.guild
    if guild:
        poulet = discord.utils.get(guild.emojis, name="poulet")
        chat = discord.utils.get(guild.emojis, name="chat")
        hann = discord.utils.get(guild.emojis, name="hann")

        # Réagir avec les émojis personnalisés si les mots-clés sont détectés
        if "caca" in message.content.lower():
            await message.channel.send(poulet)
        if "olala" in message.content.lower():
            await message.channel.send(':chat:')
        if "bruh" in message.content.lower():
            await message.channel.send(hann)
    
    await bot.process_commands(message)

bot.run(token)

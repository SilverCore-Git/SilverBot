import discord
import json
from discord.ext import commands

with open("configue.json", "r") as file:
    key = json.load(file)

with open(key["configpath"], "r") as file:
    data = json.load(file)

token = key["TOKEN"]


mots_interdits = ["fdp", "connard", "fils de pute", "enculé", "salop", "putain", "merde", "tg", "ta gueule", "fille de pute", "salope", "ptn", "conard"]
intents = discord.Intents.all()
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_message(message: discord.Message):
    if message.author.bot:
        return

    if any(mot in message.content.lower() for mot in mots_interdits):
        await message.delete()
        await message.channel.send(f"{message.author.mention}, la vulgarité est interdite ici !")


@bot.event
async def on_message_delete(message: discord.Message):
    if any(mot in message.content.lower() for mot in mots_interdits):
        channel = bot.get_channel(data["Salons"]["logs"])
        if channel is not None:
            await channel.send(f"{message.author.mention}, a fait preuve de vulgarité : ```{message.content}```")
        else:
            print("impossible de trouver le salon")
    else:
        channel = bot.get_channel(data["Salons"]["logs"])
        await channel.send(f"{message.author.mention} a supprimé : ```{message.content}```")


bot.run(token=token)
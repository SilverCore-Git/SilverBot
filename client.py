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

bot.run(token=token)

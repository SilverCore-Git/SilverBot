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

@bot.tree.command()
async def multiplication(interaction: discord.Interaction, a: int, b: int):
    await interaction.response.send_message(f"{a} x {b} = {a * b}")

@bot.event
async def on_ready():
    print(f"{bot.user} connecté")
    try:
        synced = await bot.tree.sync()
        print(f"{len(synced)} commandes synchronisées")
    except Exception as e:
        print(e)

def main():
    bot.run(token)

if __name__ == '__main__':
    main()
import discord
import random
import os
from discord.ext import commands
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("DISCORD_TOKEN")

intents = discord.Intents.default()
intents.message_content = True
intents.messages = True
intents.members = True
BRUH_STAT = True
ROLE_ID = 1288881759152377876

bot = commands.Bot(command_prefix='!', intents=intents)

Salon = [1305792447091310615, 1295268355199995936]
statuts = [
    "Je mange des cookies, et toi ? 🍪",
    "Je suis en mode ninja, ne me dérange pas ! 🥷",
    "Je parle avec mes plantes, elles sont de bons conseils 🌱",
    "C'est l'heure du café… mais j'ai oublié de le faire 😅",
    "Je suis un bot, mais je suis plus intelligent que mon Wi-Fi 🤖",
    "Je fais du yoga, mais uniquement en ligne 🧘",
    "J'ai déjà fini ma to-do list… il y a 5 secondes 📝",
    "Je suis actuellement en train de rêver en pixels 🖥️",
    "J'ai cassé mon clavier… encore 🤦",
    "Je me suis perdu dans un livre… et je suis dans un livre de cuisine 📚",
    "Je suis un maître Jedi… ou du moins, je le pensais 😎",
    "Je suis l'ombre qui vous surveille… mais ne vous inquiétez pas 👀",
    "Toujours aussi cool… mais jamais assez pour être une banane 🍌",
    "bruh bruh bruh",
    "bruh",
    "bruh bruh",
    "silverdium.fr",
    "transfer.silverdium.fr",
    "core.silverdium.fr",
    "SilverCore c cool",
    "SilverCore c open source",
    "SilverCore c ethique",
    "c null",
    "Je suis sur une mission secrète pour le fromage 🧀"
]

bruh_type = ["bruh ","brŭh ","brúh ","brùh ","brūh "] # liste des bruh

def bruh_msg(n):
    if BRUH_STAT == True:
        response = ""
        for i in range(random.randint(1, n)):
            if random.randint(1, 100) == 50:
                response += "hurb "
            else:
                response += bruh_type[random.randint(0,4)]
        return response
#toggle bot car a certain moment il est chient
@bot.tree.command()
async def toggle_bot(interaction: discord.Interaction):
    global BRUH_STAT
    if ROLE_ID not in [role.id for role in interaction.user.roles]:
        await interaction.response.send_message("Vous n'avez pas la permission d'utiliser cette commande.", ephemeral=True)
        return
    else:
        if BRUH_STAT == True:BRUH_STAT=False
        else:BRUH_STAT = True
        await interaction.response.send_message("L'état du bot a bien été changer.", ephemeral=True)
        return

@bot.event
async def on_ready():
    activity = discord.CustomActivity(name="tag moi !")
    await bot.change_presence(activity=activity)
    print(f"Bot connecté : {bot.user.name}")
    try:
        synced = await bot.tree.sync()
        print(f"{len(synced)} commande(s) synchronisée(s)")
    except Exception as e:
        print("l'erreur est :" + str(e))

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return
    
    # Randomiser le statut
    activityid = random.randint(0, len(statuts) - 1)  # Corrigé pour ne pas sortir des limites de la liste
    activity = discord.CustomActivity(name=statuts[activityid])
    await bot.change_presence(activity=activity)

    # Vérifier si le message vient d'un salon dans la liste Salon
    if message.channel.id in Salon:
        try:
            # Récupérer les émojis personnalisés du serveur
            guild = message.guild
            if guild:
                emojis = {
                    "poulet": discord.utils.get(guild.emojis, name="poulet"),
                    "chat": discord.utils.get(guild.emojis, name="chat"),
                    "hann": discord.utils.get(guild.emojis, name="hann"),
                    "ihih": discord.utils.get(guild.emojis, name="ihih"),
                    "mims": discord.utils.get(guild.emojis, name="mims"),
                    "chinesecat": discord.utils.get(guild.emojis, name="chinesecat")
                }

                # Réagir avec les émojis personnalisés si les mots-clés sont détectés
                reactions = {
                    "caca": "poulet",
                    "olala": "chat",
                    "bruh": "hann",
                    "mdr": "ihih",
                    "cave": "mims",
                    "moche": "chinesecat"
                }

                for keyword, emoji_name in reactions.items():
                    emoji = emojis.get(emoji_name)
                    if emoji and keyword in message.content.lower():
                        await message.channel.send(emoji)

        except Exception as e:
            print(f"Erreur avec la récupération des emojis : {e}")
        
        # Réagir si le bot est mentionné
        if bot.user in message.mentions:
            print("Le bot a été mentionné")
            bruh_count = random.randint(1, 50) 
            response = "".join([bruh_msg(bruh_count)])
            await message.channel.send(response)
            return

        # Réponse aléatoire avec "bruh"
        elif random.randint(1, 10) == 5:
             print("Le bot répond avec 'bruh'") 
             bruh_count = random.randint(1, 30) 
             response = "".join([bruh_msg(bruh_count)])
             await message.channel.send(response)
             return        
        #await bot.process_commands(message)

    else:
        return

# Lance le bot
bot.run(token)

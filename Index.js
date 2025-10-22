import discord
from discord.ext import commands

intents = discord.Intents.default()
intents.members = True  # Required to manage nicknames

bot = commands.Bot(command_prefix="!", intents=intents)

# Replace with the role IDs or permission checks for admins
ADMIN_ROLE_NAME = "Admin"

# Lock for group (server) name changes
server_name_locked = True
# Lock for nicknames
nickname_locked = True

@bot.event
async def on_guild_update(before, after):
    if server_name_locked and before.name != after.name:
        await after.edit(name=before.name)
        print(f"Server name change detected and reverted to: {before.name}")

@bot.event
async def on_member_update(before, after):
    if nickname_locked and before.nick != after.nick:
        # Only revert if user is not admin
        role_names = [role.name for role in after.roles]
        if ADMIN_ROLE_NAME not in role_names:
            await after.edit(nick=before.nick)
            print(f"Nickname change reverted for {after.name}")

@bot.command()
@commands.has_role(ADMIN_ROLE_NAME)
async def lock_server(ctx):
    global server_name_locked
    server_name_locked = True
    await ctx.send("Server name lock enabled.")

@bot.command()
@commands.has_role(ADMIN_ROLE_NAME)
async def unlock_server(ctx):
    global server_name_locked
    server_name_locked = False
    await ctx.send("Server name lock disabled.")

@bot.command()
@commands.has_role(ADMIN_ROLE_NAME)
async def lock_nick(ctx):
    global nickname_locked
    nickname_locked = True
    await ctx.send("Nickname lock enabled.")

@bot.command()
@commands.has_role(ADMIN_ROLE_NAME)
async def unlock_nick(ctx):
    global nickname_locked
    nickname_locked = False
    await ctx.send("Nickname lock disabled.")

bot.run("YOUR_BOT_TOKEN")

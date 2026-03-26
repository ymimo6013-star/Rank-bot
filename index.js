const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;

let data = { lastRank: 0, users: {} };

function saveData() {
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
}

client.on("ready", () => {
  console.log("✅ Bot khdam");
});

client.on("guildMemberAdd", async (member) => {
  if (!data.users[member.id]) {
    data.lastRank++;
    data.users[member.id] = data.lastRank;
    saveData();
  }

  let rank = data.users[member.id];

  try {
    await member.setNickname(`RANK ${rank} | ${member.user.username}`);
  } catch {}
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith("&fixrank")) {

    let members = await message.guild.members.fetch();

    for (let member of members.values()) {

      if (!data.users[member.id]) {
        data.lastRank++;
        data.users[member.id] = data.lastRank;
      }

      let rank = data.users[member.id];

      try {
        await member.setNickname(`RANK ${rank} | ${member.user.username}`);
      } catch {}
    }

    saveData();
    message.reply("✅ تصلاحت!");
  }
});

client.login(TOKEN);

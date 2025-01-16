"use strict";

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  SlashCommandBuilder,
  REST,
  Routes,
  ButtonBuilder,
} = require("discord.js");
const { interactionTaskCreate } = require("../util/interactionCreate.util");
const { commands } = require("../util/command.util");

const discordListener = () => {
  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers, // Fetch members (online/offline)
      GatewayIntentBits.GuildPresences, // To check online/offline status
    ],
  });
  // chanel 1252932322697678900
  client.login(process.env.BOT_TOKEN);

  // disconnect
  client.on("disconnect", () => {
    console.log("Disconnected from Discord");
  });

  client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);

    try {
      await rest.put(Routes.applicationCommands(process.env.BOT_CLIENT_ID), {
        body: commands,
      });
      console.log("✅ Slash command (/task) registered successfully!");
    } catch (error) {
      console.error("❌ Error registering slash command:", error);
    }
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    // Handle the /task command
    if (interaction.commandName === "task") {
      interactionTaskCreate(interaction);
    }
  });

  // Welcome message when a user joins
  client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.get(
      process.env.CHANNEL_WELCOME
    );

    const embed = new EmbedBuilder()
      .setColor("#1746a9")
      .setTitle("✅ Welcome to SportLinker")
      .setDescription(`Please read careful the rules \n`)
      .setFooter({
        text: "If you have any questions, feel free to ask in the chat!",
      })
      .setTimestamp();

    // Button
    const customBotButton = new ButtonBuilder()
      .setLabel("Custom Bot")
      .setStyle(ButtonStyle.Link)
      .setURL("https://green-bot.app/custom");

    const row = new ActionRowBuilder().addComponents(customBotButton);

    channel.send({ embeds: [embed], components: [row] });
  });

  client.login(process.env.BOT_TOKEN);
};

module.exports = {
  discordListener,
};

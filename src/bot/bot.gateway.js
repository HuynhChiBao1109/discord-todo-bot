"use strict";

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  SlashCommandBuilder,
  REST,
  Routes,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { interactionTaskCreate } = require("../util/interactionCreate.util");
// const { commands } = require("../util/command.util");
const { ActionRowBuilder } = require("discord.js");

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
    const commands = [
      new SlashCommandBuilder()
        .setName("task")
        .setDescription("Assign a task to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to assign the task to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("The description of the task")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("type_task")
            .setDescription("Type of the task: Frontend (fe) or Backend (be)")
            .setRequired(true)
            .addChoices(
              { name: "Frontend", value: "fe" },
              { name: "Backend", value: "be" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("date")
            .setDescription("Due date for the task (YYYY-MM-DD)")
            .setRequired(true)
        ),
    ].map((command) => command.toJSON());

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
      .setLabel("Website")
      .setStyle(ButtonStyle.Link)
      .setURL("https://sportlinker.site");

    const row = new ActionRowBuilder().addComponents(customBotButton);

    channel.send({ embeds: [embed], components: [row] });
  });

  client.login(process.env.BOT_TOKEN);
};

module.exports = {
  discordListener,
};

"use strict";

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  SlashCommandBuilder,
  REST,
  Routes,
} = require("discord.js");

const discordListener = () => {
  // Register the /task command
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

  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
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

  // Handle the /task command
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "task") {
      const user = interaction.options.getUser("user");
      const description = interaction.options.getString("description");
      const typeTask = interaction.options.getString("type_task");
      const dueDate = interaction.options.getString("date");

      // Validate the date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dueDate)) {
        return interaction.reply({
          content: "❌ Invalid date format! Please use YYYY-MM-DD.",
          ephemeral: true,
        });
      }

      // Embed for task assignment
      const embed = new EmbedBuilder()
        .setColor("#00FF00")
        .setTitle("📋 New Task Assigned")
        .setDescription(
          `**Task:** ${description}\n` +
            `**Assigned to:** ${user}\n` +
            `**Type:** ${typeTask === "fe" ? "Frontend" : "Backend"}\n` +
            `**Due Date:** ${dueDate}`
        )
        .setFooter({ text: `Assigned by ${interaction.user.tag}` })
        .setTimestamp();

      const taskMessage = await interaction.reply({
        embeds: [embed],
        fetchReply: true,
      });

      // Allowed emojis for interaction
      const allowedEmojis = ["👍", "❤️", "👎"];
      for (const emoji of allowedEmojis) {
        await taskMessage.react(emoji);
      }

      // Reaction filter
      const filter = (reaction, user) => {
        return allowedEmojis.includes(reaction.emoji.name) && !user.bot;
      };

      const collector = taskMessage.createReactionCollector({
        filter,
        time: 86400000,
      });

      collector.on("collect", (reaction, user) => {
        if (reaction.emoji.name === "👍") {
          interaction.followUp({
            content: `${user.tag} marked the task as **successful**! ✅`,
            ephemeral: true,
          });
        } else if (reaction.emoji.name === "❤️") {
          interaction.followUp({
            content: `${user.tag} marked the task as **completed**! ✅`,
            ephemeral: true,
          });
        } else if (reaction.emoji.name === "👎") {
          interaction.followUp({
            content: `${user.tag} marked the task as **failed**! ❌`,
            ephemeral: true,
          });
        }
      });

      collector.on("end", () => {
        console.log("Reaction collection ended.");
      });
    }
  });

  client.login(process.env.BOT_TOKEN);
};

module.exports = {
  discordListener,
};

"use strict";

const { EmbedBuilder } = require("discord.js");

async function interactionTaskCreate(interaction) {
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
    .setTitle(`📋 [${typeTask}] - ${description}`)
    .setDescription(`**Assigned to:** ${user}\n` + `**Due Date:** ${dueDate}`)
    .setFooter({ text: `Assigned by ${interaction.user.tag}` })
    .setTimestamp();

  // Send the task in the current channel
  await interaction.reply({
    embeds: [embed],
  });

  const taskMessage = await interaction.fetchReply();

  // const targetChannel = await client.channels.fetch(
  //   process.env.CHANNEL_TARGET
  // );

  // if (targetChannel && targetChannel.isTextBased()) {
  //   await targetChannel.send({ embeds: [embed] });
  // } else {
  //   console.error("❌ Target channel not found or is not a text channel.");
  // }

  // Allowed emojis for interaction
  const allowedEmojis = ["✅", "👍", "👎"];
  for (const emoji of allowedEmojis) {
    await taskMessage.react(emoji);
  }

  // Reaction filter
  const filter = (reaction, user) => {
    return allowedEmojis.includes(reaction.emoji.name) && !user.bot;
  };

  const collector = taskMessage.createReactionCollector({
    filter,
    time: 86400000, // 24 hours
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

module.exports = {
  interactionTaskCreate,
};

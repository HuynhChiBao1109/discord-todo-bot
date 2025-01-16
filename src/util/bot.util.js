/**
 * 
       // Embed
       const embed = new EmbedBuilder()
         .setColor("#00FF00")
         .setTitle("✅ Thanks for adding Green-bot")
         .setDescription(
           `To get started, join a voice channel and use \`/play\`, you can provide a song name or a Spotify playlist/song/album [link](https://spotify.com).\n` +
             `A full list of commands is available when doing \`/help\`.\n\n` +
             `If you have any questions or need help with Green-bot, [join the support server](https://support.green-bot.app)\n\n` +
             `You can set me up very easily in seconds thanks to my amazing dashboard!\n` +
             `Here is your link: [Green-bot Dashboard](https://green-bot.app/server/1296535594759634944)`
         )
         .setFooter({
           text: "Want to customize the bot with your own profile picture, username, status...? Check our new Custom Bot option!",
         })
         .setTimestamp();
 
       // Button
       const customBotButton = new ButtonBuilder()
         .setLabel("Custom Bot")
         .setStyle(ButtonStyle.Link)
         .setURL("https://green-bot.app/custom");
 
       const row = new ActionRowBuilder().addComponents(customBotButton);
 
       await message.channel.send({ embeds: [embed], components: [row] });
     }
   });
 */

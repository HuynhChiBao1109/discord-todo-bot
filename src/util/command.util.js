export const commands = [
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

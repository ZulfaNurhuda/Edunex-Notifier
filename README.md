# Edunex Notifier

Edunex Notifier is a bot that notifies you about new assignments and exams on Edunex, the Learning Management System (LMS) of the Bandung Institute of Technology (ITB).

## Features

-   Notifies you about new assignments and exams on Edunex.
-   Sends notifications to multiple platforms:
    -   Email
    -   Discord (bot and webhook)
    -   Telegram
-   Configurable notification interval.

## Setup

1.  Clone the repository:

    ```bash
    git clone https://github.com/ZulfaNurhuda/Edunex-Notifier.git
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Create a `.env` file in the root directory of the project and add the following environment variables:

    ```
    EDUNEX_BEARER=
    GMAIL_APP_USERNAME=
    GMAIL_APP_PASSWORD=
    GMAIL_DEST=
    TELEGRAM_BOT_TOKEN=
    TELEGRAM_DEST=
    DISCORD_BOT_TOKEN=
    DISCORD_CHANNEL_ID=
    DISCORD_WEBHOOK_URL=
    EDUNEX_HANDLER_INTERVAL=
    ```

4.  Run the bot:

    ```bash
    npm run run
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request if you have any ideas or suggestions.

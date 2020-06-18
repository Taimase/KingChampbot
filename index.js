'use strict';

// Import the discord.js module
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
// Create an instance of a Discord client
const client = new Discord.Client();

const ytdl = require('ytdl-core');
var playing = false;
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`); 
});

// Create an event listener for messages
client.on('message', async message => {
    //triggers on all messages but bots

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const taggedUser = message.mentions.users.first();

    /*
    if (!message.guild) {
        console.log("not guilded");
        return;
    }
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
   

    if (message.content === '/join') {
        // Only try to join the sender's voice channel if they are in one themselves
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }

   

    if (message.content === '/play') {
      
    }

 if (message.content === '/dc') {

        const connection = await message.member.voice.channel.disconnect();

        console.log("tried to disconnect");
    }
   */

 //   if (message.content === '/server') {
 //       message.channel.send(`This server's name is: ${message.guild.name}`);
  //  }

 //   if (command === 'args-info') {
  //      if (!args.length) {
  //          return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
 //       }

 //       message.channel.send(`Command name: ${command}\nArguments: ${args}`);
 //   }
    // if (command === 'avatar') {
    //    if (!message.mentions.users.size) {
    //        return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
    //    }

   //     const avatarList = message.mentions.users.map(user => {
    //        return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
    //    });

        // send the entire array of strings as a message
        // by default, discord.js will `.join()` the array with `\n`
    //    message.channel.send(avatarList);
  //  }
    if (command === 'prune') {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount > 100 || amount < 2) {
            return message.reply('you cannot prune more than a 100 messages, or less than 2');
        } else {
            message.channel.bulkDelete(amount, true);
            return message.reply(`deleted ${amount - 1} messages`)
                .then(msg => {
                    msg.delete({ timeout: 10000 })
                });
        }

        // ...
    } else if (command === 'join') {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            playing = true;
        }
    } else if (command === 'leave') {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
            playing = false;
        }
    } else if (command === 'hurt') {

        message.channel.send(`attempting to play music`);
        const stream = ytdl('https://www.youtube.com/watch?v=ds6I5sUBGtw', { filter: 'audioonly' });
        const connection = await message.member.voice.channel.join();
        //const dispatcher = connection.play('C:/Users/utili/Desktop/Programmingandsideprojects/DiscordBot/music/slide.mp3');
        const dispatcher = connection.play(stream);
        dispatcher.on('start', () => {
            console.log('audio.mp3 is now playing!');
        });

        dispatcher.on('finish', () => {
            console.log('audio.mp3 has finished playing!');
        });

        // Always remember to handle errors appropriately!
        dispatcher.on('error', console.error);


    } else if (command === 'target') {
        if (!message.mentions.users.size) {
            return message.channel.send("no target was given");
        }

        let target = message.guild.member(message.mentions.users.first());

        let targetChannel = target.voice.channel;

        targetChannel.join();

        //play music
        const connection = await targetChannel.join();

        const stream = ytdl('https://www.youtube.com/watch?v=xrx2v-SHT5g', { filter: 'audioonly' });
        const dispatcher = connection.play(stream);

        dispatcher.on('start', () => {
            console.log('audio.mp3 is now playing!');
        });

        dispatcher.on('finish', () => {
            console.log('audio.mp3 has finished playing!');
        });

        // Always remember to handle errors appropriately!
        dispatcher.on('error', console.error);
    } else if (command === 'play') {
        if (message.member.voice.channel) {
            message.channel.send(`attempting to play music`);
            const stream = ytdl(args[0], { filter: 'audioonly' });
            const connection = await message.member.voice.channel.join();
            //const dispatcher = connection.play('C:/Users/utili/Desktop/Programmingandsideprojects/DiscordBot/music/slide.mp3');
            const dispatcher = connection.play(stream);
            dispatcher.on('start', () => {
                console.log('audio.mp3 is now playing!');
            });

            dispatcher.on('finish', () => {
                console.log('audio.mp3 has finished playing!');
            });

            // Always remember to handle errors appropriately!
            dispatcher.on('error', console.error)
            playing = true;
        }
    } else if (command === 'dm') {
        if (!message.mentions.users.size) {
            return message.channel.send("no target was given");
        }

        let target = message.guild.member(message.mentions.users.first());

        target.send('My fellow king-in-training, I couldn\'t help but notice you weren\'t at the gym last week. My fellow champs and I just wanted to let you know that through hard work and self respect you will be well on your way to become a king such as myself.');
    } else if (command === 'cringe') {

        const channel = message.channel;

        channel.messages.fetch({ limit: 2 }).then(messages => {
            let lastMessage = messages.last();

            // do what you need with lastMessage below
            if (!lastMessage.author.bot) {
                // The author of the last message wasn't a bot

                let target = message.guild.member(lastMessage.author);

                console.log(target);

                var cringe = 0;
                var fortnite = false;
                var image = false;
                if (target.user.username === 'Taimase' || target.user.username === 'Blwaze' || target.user.username === 'Dylgib') {
                    cringe += 1;
                }
                if (lastMessage.content.includes('cringe') || lastMessage.content.includes('Cringe')) {

                    cringe += 2;
                }
                if (lastMessage.content.includes('gaming') || lastMessage.content.includes('Gaming')) {

                    cringe += 2;
                }
                if (lastMessage.content.includes('anime') || lastMessage.content.includes('Anime')) {

                    cringe += 2;
                }
                if (lastMessage.content.includes('ree') || lastMessage.content.includes('Ree')) {

                    cringe += 2;
                }
                if (lastMessage.content.includes('epic') || lastMessage.content.includes('Epic')) {
                    cringe += 2;
                }
                if (lastMessage.content.includes('moment') || lastMessage.content.includes('Moment')) {
                    cringe += 2;
                }

                if (lastMessage.content.includes('fortnite') || lastMessage.content.includes('Fortnite')) {
                    fortnite = true;
                    cringe += 3;
                }

                if (lastMessage.attachments.size > 0) {
                    cringe += 3;
                    image = true;
                }
                if (cringe >= 8 && image === false) {
                    message.channel.bulkDelete(2, true);
                    message.channel.send(`Hold it right there King ${target.user.username}, This message is so unbelievably cringe it burns the eyes to see. I will delete the message to save you from further embarrassment.`)
                    
                }
                else if (cringe >= 3 && image === false) {
                    message.channel.send(`Sorry King ${target.user.username}, your message is marked as cringe. I expect better of you in future messages King.`)

                    lastMessage.react('🇨');
                    lastMessage.react('🇷');
                    lastMessage.react('🇮');
                    lastMessage.react('🇳');
                    lastMessage.react('🇬');
                    lastMessage.react('🇪');
                    lastMessage.react('723059060940865557');
                }
                if (image) {
                    message.channel.send(`${target.user.username}'s image caused my muscles to retract. This is due to my reaction of disgust at it, in other words: wow that's cringe. Sorry King.`);
                }
                if (fortnite) {
                    message.channel.send(`Also ${target.user.username}, adding fortnite to your message doesn\'t make it funny or relevant`);
                }
                if (cringe < 3 && image === false) {
                    message.channel.send(`Good job ${target.user.username}! Your message is not cringe. Keep up the good work King.`)
                }
                console.log(cringe);
                console.log(image);
            } else {
                message.channel.send(`My fellow king-in-training, I have spent a lot of time analyzing this message, and it seems to have been sent by me or another bot. Not cringe.`);
            }
        })
            .catch(console.error);
    } else if (command === 'help') {
        message.channel.send(`No one can help you King.`);
    }
  
});



// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(token);
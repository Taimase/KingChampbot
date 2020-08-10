
// Import the discord.js module
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const fetch = require("node-fetch");
// To use the KINGCHAMP_TOKEN, the system running the bot client needs to have that environment variable set to the bot token.
const token = process.env.KINGCHAMP_TOKEN
// Create an instance of a Discord client
const client = new Discord.Client();

const ytdl = require('ytdl-core');
let playing = false;
/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`); 
});
client.on('guildMemberAdd', (guildMember) => {
const role = guildMember.guild.roles.cache.find(role => role.name === 'Gaming');
guildMember.roles.add(role);
});



/*
The following is failed versions of getting the bot to trigger when joining the hurtchamber voice channel


client.on('voiceStateUpdate', (oldstate, newstate) => {

    
    const newUserChannel = newstate.channel.id;
    const oldUserChannel = oldstate.channel.id;

    console.log(newUserChannel.id);

    
    const textChannel = oldstate.guild.channels.cache.get('621499352300519461');
 

    if (newUserChannel === '621499352300519461') {
        textChannel.send(`${newMember.user.username} (${newMember.id}) has joined the channel`)
    } else if (oldUserChannel === '621499352300519461' && newUserChannel !== '621499352300519461') {
        textChannel.send(`${newMember.user.username} (${newMember.id}) has left the channel`)
    }
 
})
*/
        
      /*
client.on('voiceStateUpdate', (oldstate, newstate) => {
    let newUserChannel = newstate.member.voice.channel;
    let oldUserChannel = oldstate.member.voice.channel;


    if (oldUserChannel === undefined && newUserChannel !== undefined) {

        // User Joins a voice channel
        console.log("joined");

    } else if (newUserChannel === undefined) {

        // User leaves a voice channel
        console.log("left");
    }
});

   */     
         
            
//this is where all the commands take place this event triggers on all messages
client.on('message', async message => {
   

    if (!message.content.startsWith(prefix) || message.author.bot) return; //this line makes it so it doesn't trigger on bot messages and on messages without the prefix

    const args = message.content.slice(prefix.length).split(/ +/); //this array gives us arguments besides the command
    const command = args.shift().toLowerCase();
    const taggedUser = message.mentions.users.first(); //gives us the tagged user mention

    /*
   
   Completed Argument test command. This command verified that the arguments worked. If you want to see how argments work uncomment the args-info command
 //   if (command === 'args-info') {
  //      if (!args.length) {
  //          return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
 //       }

 //       message.channel.send(`Command name: ${command}\nArguments: ${args}`);
 //   }



Unused functional avatar command
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




*/

    //  prune/mass delete command
    //add else ifs like these to add more commands
    if (command === 'prune') {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount > 100 || amount < 2) {
            return message.reply('you cannot prune more than a 100 messages, or less than 2');
        } else {
            message.channel.bulkDelete(amount, true); //the actual code that deltes the messages
            return message.reply(`deleted ${amount - 1} messages`)
                .then(msg => {
                    msg.delete({ timeout: 10000 }) //deletes the reply kingchamp sends after 10 seconds
                });
        }

        // ...


    } else if (command === 'join') { //voice commands start from here on
        if (message.member.voice.channel) { //join voice channel
            const connection = await message.member.voice.channel.join();
            playing = true; //I don't remember how much I use the playing variable ignore it for now
        }
    } else if (command === 'leave') {// leave voice channel
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
            playing = false;
        }
    } else if (command === 'hurt') { //this command only works if kingchamp is already in a channel. It is meant to blow out the commander's ears

        message.channel.send(`attempting to play music`);
        const stream = ytdl('https://www.youtube.com/watch?v=ds6I5sUBGtw', { filter: 'audioonly' });// the ytdl is a dependancy that gets videos from youtube
        const connection = await message.member.voice.channel.join();
        //const dispatcher = connection.play('C:/Users/utili/Desktop/Programmingandsideprojects/DiscordBot/music/slide.mp3'); // This is the backup mario 64 file
        const dispatcher = connection.play(stream); //the actual code that plays the music
        dispatcher.on('start', () => {
            console.log('music is now playing!'); //this is the console log that tells you audio is supposably working this is the event that is called when music is playing
        });

        dispatcher.on('finish', () => { //event when music is done
            console.log('music has finished playing!');
        });

        // This is for catching errors, I should have added more of this code to other commands but I have been lazy
        dispatcher.on('error', console.error);


    } else if (command === 'target') { //this is the best Kinchamp command. target a user by going |target @username and kingchamp will join their voice channel and blow out their ears.
        if (!message.mentions.users.size) {
            return message.channel.send("no target was given");
        }

        let target = message.guild.member(message.mentions.users.first()); //the code that tells Kingchamp who to target

        let targetChannel = target.voice.channel;

        targetChannel.join(); //kingChamp joins the voice channel

        //play music
        const connection = await targetChannel.join();

        const stream = ytdl('https://www.youtube.com/watch?v=xrx2v-SHT5g', { filter: 'audioonly' });
        const dispatcher = connection.play(stream); //play the music

        dispatcher.on('start', () => {
            console.log('audio.mp3 is now playing!');
        });

        dispatcher.on('finish', () => {
            console.log('audio.mp3 has finished playing!');
        });


        dispatcher.on('error', console.error);

        //the play commmand allows you to play any youtube video but it is also
    } else if (command === 'play') { //the command most likely to crash the bot. if you wish for kingchamp to be sustainable either remove this command or make it so it doesn't crash when invalid input is given
        if (message.member.voice.channel) {
            message.channel.send(`attempting to play music`);
            const stream = ytdl(args[0], { filter: 'audioonly' }); //where the bot is givin input through the args array. the input MUST be a valid youtube link
            const connection = await message.member.voice.channel.join();
            //const dispatcher = connection.play('C:/Users/utili/Desktop/Programmingandsideprojects/DiscordBot/music/slide.mp3'); //this is test input
            const dispatcher = connection.play(stream);
            dispatcher.on('start', () => {
                console.log('audio.mp3 is now playing!');
            });

            dispatcher.on('finish', () => {
                console.log('audio.mp3 has finished playing!');
            });

            // this error catcher doesn't work the way I thought it would
            dispatcher.on('error', console.error)
            playing = true;
        }


    } else if (command === 'dm') { //this command dms the target user some crap
        if (!message.mentions.users.size) {
            return message.channel.send("no target was given");
        }

        let target = message.guild.member(message.mentions.users.first());//gets the target
        //sends a stupid copypasta
        target.send('My fellow king-in-training, I couldn\'t help but notice you weren\'t at the gym last week. My fellow champs and I just wanted to let you know that through hard work and self respect you will be well on your way to become a king such as myself.');

    } else if (command === 'cringe') { //this is where the logic for the cringe commmand is.

        const channel = message.channel;

        channel.messages.fetch({ limit: 2 }).then(messages => { //it gets one message higher than the users command message
            let lastMessage = messages.last();


            if (!lastMessage.author.bot) {
                // if The author of the last message wasn't a bot

                let target = message.guild.member(lastMessage.author);

                console.log(target);

                var cringe = 0; //this is the cringe variable that determines how cringe the message is
                var fortnite = false;
                var image = false;
                if (target.user.username === 'Taimase' || target.user.username === 'Blwaze' || target.user.username === 'Dylgib') { //if the message is sent by me andrew or dillan the message is automatically given +1 cringe
                    cringe += 1;
                } //cringe key words are here. If you want to add more words just copy and paste this code
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

                if (lastMessage.content.includes('fortnite') || lastMessage.content.includes('Fortnite')) { //if message contains fortnite the bot changes its message
                    fortnite = true;
                    cringe += 3;
                }

                if (lastMessage.attachments.size > 0) { //if their is an image the message is marked as cringe
                    cringe += 3;
                    image = true;
                }
                if (cringe >= 8 && image === false) {//highest level of cringe currently. If you want to make a custom message for cringe level 14 you would copy this code
                    message.channel.bulkDelete(2, true); //the bot auto deletes your message if it is cringe level above 8
                    message.channel.send(`Hold it right there King ${target.user.username}, This message is so unbelievably cringe it burns the eyes to see. I will delete the message to save you from further embarrassment.`)

                }
                else if (cringe >= 3 && image === false) {
                    message.channel.send(`Sorry King ${target.user.username}, your message is marked as cringe. I expect better of you in future messages King.`)
                    //this is where the bot reacts with emojiis to the message. you either need to use unicode or the emojii id.
                    lastMessage.react('🇨');
                    lastMessage.react('🇷');
                    lastMessage.react('🇮');
                    lastMessage.react('🇳');
                    lastMessage.react('🇬');
                    lastMessage.react('🇪');
                    lastMessage.react('723059060940865557');
                }
                if (image) { //response to an image
                    message.channel.send(`${target.user.username}'s image caused my muscles to retract. This is due to my reaction of disgust at it, in other words: wow that's cringe. Sorry King.`);
                }
                if (fortnite) { //fortnite addition to message
                    message.channel.send(`Also ${target.user.username}, adding fortnite to your message doesn\'t make it funny or relevant`);
                }
                if (cringe < 3 && image === false) { //if not cringe
                    message.channel.send(`Good job ${target.user.username}! Your message is not cringe. Keep up the good work King.`)
                }
                console.log(cringe);
                console.log(image);
            } else { //if the message was sent by a bot
                message.channel.send(`My fellow king-in-training, I have spent a lot of time analyzing this message, and it seems to have been sent by me or another bot. Not cringe.`);
            }
        })
            .catch(console.error);
    } else if (command === 'help') { //stupid command. Might make the help command actually usefull someday
        message.channel.send(`No one can help you King.`);
    } else if (command === 'bad') { //kicks and dms an invite to target
        if (!message.mentions.users.size) {
            return message.channel.send("no target was given");
        }

        let target = message.guild.member(message.mentions.users.first()); //targets user
        const temp = target.username; //saves user name
        replyWithInvite(message, target); //calls function


        async function replyWithInvite(message, target) {
            let invite = await message.channel.createInvite( //creation of the invite
                {
                    maxAge: 500, // maximum time for the invite, in milliseconds
                    maxUses: 1 // maximum times it can be used
                },
                `Requested with command by ${message.author.tag}`
            )
                .catch(console.log);
            target.send('You have been kicked from the server, nimrod.'); //the dm message

            target.send(invite ? `But I forgive you this time King. ${invite}` : "There has been an error during the creation of the invite."); //sends the invite through dm
        }

        message.channel.send(`Kicking ${target} from the server, goodbye King.`); //kicks target from server
        setTimeout(function () {
            //this delays the kick. The dm is actually sent a half second or so before the kick this is so the bot can still send the dm before the user is kicked from the channel.
            //you cannot dm someone that you don't share a server with which is why this code is here

            target.kick(); //the actual kick

        }, 1500);
    } else if (command === 'hangout') { //the hangout command. Input the host the time and additional info in the args

        message.channel.send(`@everyone there is a hangout at ${args[0]}\'s house at ${args[1]}`); //the actual message


        if (args[2] != null) {

            //

            var mystring = args.slice(2).toString();//This adds commas and stuff between the message
            ;
            var newchar = ' '
            mystring = mystring.split(',').join(newchar);

            message.channel.send(`Additional information ${mystring}`); //sends the additional information
        }
    } else if (command === 'quarantine') { //currently useless command becuase everyone is admin
        message.channel.send('Sorry kings quarantine has been activated on this channel until it is safe for posting.');

        closeDownChannel(message); //calls function


    } else if (command === 'unquarantine') {
        message.channel.send('The evil has been dealt with, continue crap posting kings');

        openChannel(message);


    } else if (command === 'bit') { //bit command nothing fancy
        message.channel.send('https://cdn.discordapp.com/attachments/641376848726720522/739657206215213106/bit.png');


        let bitTextOptions = [
            'What :question: an imbecile :man_facepalming: :woman_facepalming:. It appears :eyes:  you have failed :x: to get :person_raising_hand:  this extremely high :arrow_heading_up:  level humor known as a bit :rofl: . OP crafted :hammer:  a hilarious :laughing:  inside joke that you clearly didn\'t grasp. Don\'t take it personal king :crown:, it takes a very complex :muscle: mind :brain:  to comprehend :exploding_head:  such nuance :question:  and subtlety. I will now take a screenshot :camera:  on my computer and post :post_office: this conversation on the subreddit known as r/woooosh where I will surely get reddit guilds :money_mouth:  and can redeem my reddit premium subscription.',
            'Please have mercy King! OP\'s intent for their original message was one of humor and sarcasm as opposed to an expression of their actual opinion. You may laugh now Kings.'
        ];

        message.channel.send(bitTextOptions[getRandomInt(bitTextOptions.length - 1)]);

    } else if (command === 'hello') { //stupid command nothing fancy. You can add || around text like this || to add spoilers
        message.channel.send('What the f||rick|| did you just f||ricking|| say about me, you little b||uster||? I\'ll have you know I graduated top of my class in the Navy Seals, and I\'ve been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I\'m the top sniper in the entire US armed forces.You are nothing to me but just another target. I will wipe you the f||rick|| out with precision the likes of which has never been seen before on this Earth, mark my f||rick||ing words.You think you can get away with saying that s||hrek|| to me over the Internet ? Think again, f||rick||er.As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot.The storm that wipes out the pathetic little thing you call your life.You\'re f||rick||ing dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that\'s just with my bare hands.Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable a||donkey|| off the face of the continent, you little s||crap|| .If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your f||rick||ing tongue.But you couldn\'t, you didn\'t, and now you\'re paying the price, you g||stupid||mn idiot. I will send fury all over you and you will drown in it. You\'re f||rick||ing dead, kiddo.');
    } else if (command === 'poggers') {
        message.channel.send('This do be a gamer moment');
        /*
         <:PogChamp:701657226984685639>
        <:MassivePog:701659668963000320>
        <:poggers:729112522086416396>
         
          */
        message.react('701657226984685639');
        message.react('701659668963000320');
        message.react('729112522086416396');
        message.channel.send('<:PogChamp:701657226984685639><:PogChamp:701657226984685639><:PogChamp:701657226984685639><:PogChamp:701657226984685639><:PogChamp:701657226984685639>');
    } else if (command === 'deep') { //copypastas from r/im14andthisisdeep
        let deepTextOptions = [
            'Maybe humans are the real virus',
            'sHE\'s brOKen',
            'First you learn to read. Then you read to learn',
            'I want a Nokia but society won\t let me',
            'Remember, when you point a finger at someone there are three more pointing back at you',
            'Girl: as soon as I can \n \n Boy: will you ever leave me \n \n Girl: no are you crazy? \n \n Boy: do you love me? \n \n Girl: yes alot \n \n Boy: have you ever cheated on me \n \n Girl: no never \n \n Boy: will you ever kiss me? \n \n Girl: every chance I get \n \n Boy: will you ever hit me \n \n Girl: definitely not \n \n Boy: can I trust you? \n \n Girl: yes \n \n Boy: Babe \n \n now read it backwards',
            'Sugar and Salt look almost same. \n Be Careful of Whom You Trust...',
            'A salary is a bribe they give you to forget your dreams',
            'The most expensive liquid in the world is a tear. It is 1% water and 99% feelings. \n Think before you hurt someone.',
            'Police: why are you here? \n \n Someone: I am being abuse \n \n Police: what\'s your name \n \n Someone: Mother Earth \n \n Police: who abused u? \n \n Mother Earth: Humans. \n \n 1 like = 10 trees to save earth :tree:',
            'https://cdn.discordapp.com/attachments/621499352300519455/742082515967410216/d256ad2.jpg',
            'Every smoker has a story so before you tell them smoking kills, I want you to know that something is already killing them.',
            'we all got arrested for being born and sent to prison until wer 18 that prison is call "school"',
            '-Grab a plate and throw it on the floor \n -Okay done. \n -Did it break? \n -Yes. \n -Now say sorry to it. \n -Sorry \n -Did it go back to how it was before? \n -No. \n -Do you understand?',
            'Doctor: On a scale of 1 to 10 how bad is your pain \n Man: π \n Doctor: π? \n Man: Yeah. Low level but never ending.',
            'Did you know ? \n *80%* of boys have girlfriends \n Rest 20% have *brain*.',
            'If There Is Bread Winners, There Is Bread Losers. But You Can\'t Toast What Isn\'t Real. #BreadPeopleLives',
            'OMG so I just figured out the word "hurt" \n it\'s past present and future \n you will be ***hurt*** \n you are ***hurt*** \n you were ***hurt*** \n **BECAUSE IF SOMETHING TRULY HURT, IT NEVER REALLY STOPS** \n \n it\'s because it\'s an adjective... \n you will be ***stupid*** \n you are ***stupid*** \n you were ***stupid***',
            'If I Were White And Not Will Smith\'s """""SILLY""""" Son I Would Be The Most Respected Philosopher Of Our And All Time.',
            'Friends are like birds, they die if you kill them.',
        ];
        message.channel.send('You got it King, polling local 14 year olds for deep quotes.');
        message.channel.send('--------------------------------------------------------------------')
        message.channel.send(deepTextOptions[getRandomInt(deepTextOptions.length - 1)]);
    } else if (command === 'blursed') {

        postRandommeme(message);

    }

    

});

function closeDownChannel(message) { //quarantine function no longer works because everyone is admin
    let channel = message.channel;
    let roles = message.guild.roles; // collection

    // find specific role - this targets the gaming role
    const role = message.channel.guild.roles.cache.find(role => role.name === 'Gaming');

   

    // overwrites 'SEND_MESSAGES' role, only on this specific channel
    channel.updateOverwrite(role, { SEND_MESSAGES: false });
}
function openChannel(message) { //fixes the quarantine command and is called on the |unquarantine
    let channel = message.channel;
    let roles = message.guild.roles; // collection

    // find specific role - enter name of a role you create here
    const role = message.channel.guild.roles.cache.find(role => role.name === 'Gaming');



    // overwrites 'SEND_MESSAGES' role, only on this specific channel
    channel.updateOverwrite(role, { SEND_MESSAGES: true });
}

// randomizer function
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max + 1));
  }


// Log our bot in using the token from https://discordapp.com/developers/applications/me







/*
function loadmemes(message) {
    fetch('https://www.reddit.com/r/memeswithoutmods.json?limit=800&?sort=hot&t=all')
        .then(res => res.json())
        .then(json => json.data.children.map(v => v.data.url))
        .then(urls => postRandommeme(urls, message));
}

function postRandommeme(urls, message) {
    const randomURL = urls[Math.floor(Math.random() * urls.length) + 1];
    const embed = new Discord.MessageEmbed({
        image: {
            url: randomURL
        }
    });
    message.channel.send(embed);
}

*/
function loadmemes() {
    // Fetch JSON
    return fetch('https://www.reddit.com/r/blursedimages.json?limit=800&?sort=hot&t=all')
        .then(res => res.json())
        // Return the actual posts
        .then(json => json.data.children);

   
}

function postRandommeme(message) {
    return loadmemes().then(posts => {
        // Get a random post's title and URL
        const { title, url } = posts[Math.floor(Math.random() * posts.length)].data;
        // Create the embed
        const embed = new Discord.MessageEmbed({
            title,
            image: { url },
            //footer: { text: 'Subreddit : r/memes' }
        });
        // Send the embed
        return message.channel.send(embed);
    })
}


client.login(token);
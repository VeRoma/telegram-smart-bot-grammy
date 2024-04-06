require ('dotenv').config();

const { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError } = require ('grammy');


const bot = new Bot(process.env.BOT_API_KEY);

const { getRandomQuestion } = require('./utils');


bot.command('start', async (ctx) => {

    const startKeyboard = new Keyboard()
        .text("HTML").text('CSS').row()
        .text('JavaScript').text("React")
        .resized();

    await ctx.reply('Привет!');
    await ctx.reply('Выбери тему:', {
        reply_markup: startKeyboard
    });

});

bot.hears( ['HTML', 'CSS', 'JavaScript', 'React' ], async (ctx) => {
    const topic = ctx.message.text;
    const question = getRandomQuestion(topic);
    let inlineKeyboard;
   

    if (question.hasOptions) {
        const buttonRows = question.options.map((option) => [
             InlineKeyboard.text(
                option.text,
                JSON.stringify({
                    type: `${topic}-option`,
                    isCorrect: option.isCorrect,
                    questionID: question.id
                }),
            ),
        ]);

        inlineKeyboard = InlineKeyboard.from(buttonRows)

    } else {
        inlineKeyboard = new InlineKeyboard().text(
            'Узнать ответ', JSON.stringify({
            type: ctx.message.text,
            questionID: question.id,
            })
        );
    }

    await ctx.reply(question.text, {
        reply_markup: inlineKeyboard
    });


});

bot.on('callback_query:data', async (ctx) => {
    
    const callbackData = JSON.parse(ctx.callbackQuery.data);
    
    // if (ctx.callbackQuery.data === 'cancel') {
    //     await ctx.reply('Отменено')
    //     await ctx.answerCallbackQuery('Canceled');
    //     return;
    // } 

    
    // await ctx.reply(`${callbackData.type} - content`);
    // await ctx.answerCallbackQuery();
    
});



bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });



bot.start();
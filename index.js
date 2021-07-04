require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const UserService = require('./service/user-service');
const XmlGeneratorService = require('./service/xml-generator-service')

const token = process.env.TOKEN;

const bot = new TelegramBot(token, {polling: true});

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (e) {
    console.log(e);
  }
}

bot.onText(/\/start/, async (msg) => {
  let telegramUserId = msg.from.id
  try {
    await UserService.createOrIgnoreUser(telegramUserId)
  } catch (e) {
    console.log(e)
  }

  bot.sendMessage(msg.chat.id, "От какой компании мы делаем договор?", {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["ИП", "ООО"], ["Отмена"]],
    }
  });
});
bot.on('message', (msg) => {
  let Hi = "ип";
  let CategoryOfCompany = 'individualEntrepreneur'
  UserService.updateCategoryOfCompany(msg.from.id, CategoryOfCompany)
  if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    bot.sendMessage(msg.chat.id, "Введите название компании клиента", {
      reply_markup: {
        force_reply: true,
      }
    }).then(async msg => {
      await bot.onReplyToMessage(msg.chat.id, msg.message_id, msg => {
        let companyName = msg.text
        UserService.updateCompanyName(msg.from.id, companyName)
        updateProfession()
      })
    })
  }
  if (msg.text === 'ООО') {
    let CategoryOfCompany = 'OOO'
    UserService.updateCategoryOfCompany(msg.from.id, CategoryOfCompany)
    bot.sendMessage(msg.chat.id, "Введите название компании клиента", {
      reply_markup: {
        force_reply: true,
      }
    }).then(async msg => {
      await bot.onReplyToMessage(msg.chat.id, msg.message_id, msg => {
        let companyName = msg.text
        UserService.updateCompanyName(msg.from.id, companyName)
        updateProfession()
      })
    })

    function updateProfession () {
      bot.sendMessage(msg.chat.id, "В лице должность", {
        reply_markup: {
          force_reply: true,
        }
      }).then(async msg => {
        await bot.onReplyToMessage(msg.chat.id, msg.message_id, msg => {
          let profession = msg.text
          UserService.updateProfession(msg.from.id, profession)
          updateFullName()
        })
      })
    }

    function updateFullName () {
      bot.sendMessage(msg.chat.id, "В лице ФИО", {
        reply_markup: {
          force_reply: true,
        }
      }).then(async msg => {
        await bot.onReplyToMessage(msg.chat.id, msg.message_id, msg => {
          let fullName = msg.text
          UserService.updateFullName(msg.from.id, fullName)
          updateCharter()
        })
      })
    }

    async function updateCharter () {
      bot.sendMessage(msg.chat.id, "Действует на основании Устава?", {
        reply_markup: {
          force_reply: true,
        }
      }).then(async msg => {
        await bot.onReplyToMessage(msg.chat.id, msg.message_id, msg => {
          let charter = msg.text
          UserService.updateCharter(msg.from.id, charter)
          getResults()
        })
      })
    }

    async function getResults () {
      let userDocument = await UserService.getUserDocument(msg.from.id)
      XmlGeneratorService.generateWorldDocument(
        userDocument.companyName,
        userDocument.profession,
        userDocument.fullName,
        userDocument.charter
      ).then(res => {
        let pathToUploadDoc = res.toString()
        bot.sendMessage(msg.chat.id, `Готово, подготавливаем результат...`, {})
        setTimeout(function(){
          bot.sendDocument(msg.chat.id, pathToUploadDoc)
        }, 2000);

      }).catch(err => console.log(err))

    }
  }
});
start()
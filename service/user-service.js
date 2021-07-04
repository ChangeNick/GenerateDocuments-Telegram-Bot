const UserModel = require('../models/user-model');

class UserService {
  async createOrIgnoreUser (telegramUserId) {
    const candidate = await UserModel.findOne({telegramUserId})
    if (candidate) {
      return
    }
    await UserModel.create({telegramUserId})
  }

  async updateCategoryOfCompany (telegramUserId, categoryOfCompany) {
    await UserModel.findOneAndUpdate({telegramUserId}, {categoryOfCompany})
  }

  async updateCompanyName (telegramUserId, companyName) {
    await UserModel.findOneAndUpdate({telegramUserId}, {companyName})
  }

  async updateProfession (telegramUserId, profession) {
    await UserModel.findOneAndUpdate({telegramUserId}, {profession})
  }

  async updateFullName (telegramUserId, fullName) {
    await UserModel.findOneAndUpdate({telegramUserId}, {fullName})
  }

  async updateCharter (telegramUserId, charter) {
    await UserModel.findOneAndUpdate({telegramUserId}, {charter})
  }

  async getUserDocument (telegramUserId) {
    const userDocument = await UserModel.findOne({telegramUserId})
    return userDocument
  }
}

module.exports = new UserService();
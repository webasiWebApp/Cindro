const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getSettings = async (req, res, next) => {
  try {
    const settings = await prisma.appSetting.findUnique({ where: { userId: req.user.id } });
    res.json(settings || {});
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    let settings = await prisma.appSetting.findUnique({ where: { userId: req.user.id } });
    if (settings) {
      settings = await prisma.appSetting.update({
        where: { id: settings.id },
        data: req.body
      });
    } else {
      settings = await prisma.appSetting.create({
        data: { ...req.body, userId: req.user.id }
      });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };

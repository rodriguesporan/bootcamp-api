import { Op } from 'sequelize';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Mail from '../../lib/Mail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });
    return res.json(subscriptions);
  }

  async store(req, res) {
    const { meetup_id } = req.body;
    const meetup = await Meetup.findByPk(meetup_id);
    if (!meetup) {
      return res.status(400).json({ error: 'Invalid meetup.' });
    }
    const organizer = await User.findByPk(meetup.user_id);
    const user_id = req.userId;
    const user = await User.findByPk(user_id);
    if (user_id === meetup.user_id) {
      return res
        .status(400)
        .json({ error: 'User can not subscribe on your owns meetups.' });
    }
    if (meetup.past) {
      return res.status(400).json({ error: 'Meetup already done.' });
    }
    const subscriptionExist = await Subscription.findOne({
      where: { meetup_id, user_id },
    });
    if (subscriptionExist) {
      return res
        .status(400)
        .json({ error: 'You have already been subscribe on this meetup.' });
    }
    const checkDate = await Subscription.findOne({
      where: { user_id },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });
    if (checkDate) {
      return res.status(400).json({
        error: `You have alredy subscribed to a meetup at this time ${meetup.date}`,
      });
    }

    const subscription = await Subscription.create({ meetup_id, user_id });
    await Mail.sendMessage({
      to: `${organizer.name} <${organizer.email}>`,
      subject: `Nova inscrição em: ${meetup.title}`,
      text: `Nova inscrição de ${user.name}`,
      template: 'confirmation',
      context: {
        organizer,
        user,
        meetup,
      },
    });
    return res.json(subscription);
  }
}

export default new SubscriptionController();

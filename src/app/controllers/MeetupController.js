import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupController {
  async store(req, res) {
    if (isBefore(parseISO(req.body.date), new Date())) {
      return res
        .status(400)
        .json({ error: 'Is not possible add a date before today.' });
    }

    const user_id = req.userId;
    const meetup = await Meetup.create({ ...req.body, user_id });
    return res.json(meetup);
  }

  async update(req, res) {
    const meetup = await Meetup.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup not found.' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({
        error: 'You can only update meetups 2 hours until they start.',
      });
    }

    await meetup.update(req.body);
    return res.json(meetup);
  }
}

export default new MeetupController();

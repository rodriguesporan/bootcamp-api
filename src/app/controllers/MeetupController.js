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
}

export default new MeetupController();

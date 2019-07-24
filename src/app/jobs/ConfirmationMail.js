import Mail from '../../lib/Mail';

class ConfirmationMail {
  get key() {
    return 'ConfirmationMail';
  }

  async handle({ data }) {
    const { organizer, meetup, user } = data;
    console.log('A fila executou');
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
  }
}

export default new ConfirmationMail();

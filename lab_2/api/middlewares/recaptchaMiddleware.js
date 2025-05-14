import axios from 'axios';

const RECAPTCHA_SECRET = '6LfCASErAAAAAHzbmutmVNg8K63beZsdOKI_qXzI';

export const verifyRecaptcha = async (req, res, next) => {
  const { recaptcha_token } = req.body;
  
  if (!recaptcha_token) {
    return res.status(400).json({ message: 'Подтвердите, что вы не робот' });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${recaptcha_token}`
    );
    
    if (!response.data.success) {
      return res.status(400).json({ message: 'Ошибка проверки reCAPTCHA' });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
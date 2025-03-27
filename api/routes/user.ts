import Express from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/user';
import { User } from '../../src/app/interfaces/user';
const router = Express.Router();
router.get('/', async (req, res) => {
  const users = await UserModel.find();
  const result = users.map((user: User) => {
    return {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.email,
    };
  });
  res.send({ status: true, result });
});
router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await UserModel.findOne({ email: email });
  if (user != undefined || user != null) {
    const isUser = await bcrypt.compare(password, user.password);

    if (isUser) {
      const result = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      };
      res.send({ status: isUser, result: result });
    }
    res.send({ status: false });
  }

  res.send({ status: false });
});
router.post('/create', async (req, res) => {
  try {
    const unhashedUser = req.body;
    const hash = await bcrypt.hash(unhashedUser.password, 10);
    unhashedUser.password = hash;
    const user = await UserModel.create(unhashedUser);

    const result = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };
    res.send({ result, status: true });
  } catch (error: any) {
    console.log(req.body);
    res.send({ status: false });
  }
});
router.post('/createmany', async (req, res) => {
  const requests = req.body;
  const hashed: User[] = [];
  for (let item of requests) {
    const hashedPassword = await bcrypt.hash(item.password, 10);
    item.password = hashedPassword;
    hashed.push(item);
  }
  const users = await UserModel.create(hashed);
  // console.log(users)
  const result = users.map((user: User) => {
    return {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };
  });
  res.send(result);
});
export default router;

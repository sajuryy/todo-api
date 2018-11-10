const { User } = require('./../models/User');
const { authenticate } = require('./../middleware/authenticate');
const _ = require('lodash');

module.exports = app => {
    // create user
    app.post('/users', async (req, res) => {
        const body = _.pick(req.body, ['email', 'password']);
        const user = new User(body);
        try {
            await user.save();
            const token = user.generateAuthToken();
            res.header('x-auth', token).send(user);
        } catch (e) {
            res.status(400).send(e);
        }

    });

    app.get('/users/me', authenticate, (req, res) => {
        res.send(req.user);
    });

    // login
    app.post('/users/login', async (req, res) => {
        const body = _.pick(req.body, ['email', 'password']);

        try {
            const user = await User.findByCredentials(body.email, body.password);
            const token = await user.generateAuthToken();
            res.header('x-auth', token).send(user);

        } catch (e) {

            res.status(400).send();
        }
    });


    app.delete('/users/me/token', authenticate, async (req, res) => {
        try {
            await req.user.removeToken(req.token)
            res.status(200).send();
        } catch (e) {
            res.status(400).send();
        }
    });
};
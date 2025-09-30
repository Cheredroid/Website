const { trainers } = require('../models');
const bcrypt = require('bcrypt');

exports.getlogin = (req, res) => {
    try {
      res.render('login', { loggedIn: req.session.loggedIn }, (err, html) => {
    if (err) return res.status(500).send(err);
    res.send(html);
  });
    } catch (err) {
        console.error(err)
    }
  
};

exports.postLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).send('username and password required');

    const user = await trainers.unscoped().findOne({ where: { username } });
    if (!user) return res.status(401).send('Invalid credentials');

    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).send('Invalid credentials');

    req.session.regenerate(err => {
      if (err) return next(err);

      req.session.loggedIn = true;
      req.session.userId = user.id;
      req.session.username = user.username;

      req.session.save(err2 => {
        if (err2) return next(err2);
        return res.redirect('/pc');
      });
    });
    
  } catch (err) {
    console.error(err.message)
    return next(err);
  }
};


exports.getRegistry = (req, res) => {
  res.render('signup', {}, (err, html) => {
    if (err) return res.status(500).send('Render error');
    res.send(html);
  });
};

exports.postRegistry = async (req, res) => {
  try {
    const trainer = await trainers.create({ age: parseInt(req.body.age),...req.body });
    if (!trainer) return res.status(500).send('trainer was not created');

    return res.redirect(302, '/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Signup failed');
  }
};


exports.logout = (req, res) => {
    req.session.destroy;
    res.redirect(301,'/')
}


exports.guard = async (req, res, next) => {
    try {
        console.log('guard loggedIn', await req.session.loggedIn)
        if(!req.session.loggedIn) {
            return res.redirect(301,'/')
        }

        return next();

    } catch(err) {
        console.log(err.message)
    }
}
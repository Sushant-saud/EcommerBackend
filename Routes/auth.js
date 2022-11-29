const router = require('express').Router();
const CrytoJs = require('crypto-js');
const User = require('../models/User')
const jwt = require('jsonwebtoken');
//REGISTER
router.post("/register", async (req, res) => {
    const NewUser = new User({
        username:req.body.username,
        email:req.body.email,
        password: CrytoJs.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString(),
    });
    try {
        const saved = await NewUser.save();
        res.status(200).json(saved);
    } catch (err) {
        res.status(500).json(err);
    }
});
//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).send("Wrong Credentails")
        const hashPassword = CrytoJs.AES.decrypt(user.password,
            process.env.PASSWORD_SEC);
        const orginalpassword = hashPassword.toString(CrytoJs.enc.Utf8);
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        }, process.env.SECRET_KEY, { expiresIn: "3d" })
        orginalpassword !== req.body.password && res.status(401).send("Wrong Credentails");
        const { password, ...others } = user._doc;
        res.status(201).send({ ...others, accessToken });
    }
    catch (err) {
        res.status(401).send(err);
    }



})
module.exports = router;
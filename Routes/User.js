const { varifyToken, varifyTokenAndAuthorization, varifyTokenAndAdmin } = require("./varifyToken");
const router = require("express").Router();
const CrytoJs = require('crypto-js');
const User = require("../models/User");

router.put('/update/:id', varifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CrytoJs.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString();
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })
        res.status(200).send(updateUser);

    }
    catch (err) {
        res.status(500).send(err);
    }

})
//Delete
router.delete("/:id", async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).send("User has been deleted")
    }
    catch (err) {
        res.status(500).json(err)
    }
})
//get all  user
router.get("/all",async(req,res)=>{
    const query=req.query.new;
    try{
        const AllUser= query ? await User.find().limit(5).sort({_id:-1}): await User.find().select("-password");
        res.status(201).send(AllUser);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
   
})
//get one User
router.get("/find/:id",async(req,res)=>{
    try{
        const AllUser=await User.findById(req.params.id);
        const {password,...others}=AllUser._doc;
        res.status(201).send(others);
    }
    catch(err)
    {
        res.status(500).send(err);
    }
   
})
router.get("/stats",varifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });
module.exports = router;
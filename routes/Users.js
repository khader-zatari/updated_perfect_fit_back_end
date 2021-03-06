const express = require("express");
const router = express.Router();
const { User } = require("../Models/User");

router.get("/", async (req, res) => {
    const UserList = await User.find().select("-password");
    if (!UserList) {
        res.status(500).json({ success: false });
    }
    res.send(UserList);
});

router.get("/:id", async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
        res.status(500).json({ message: "The User with the given ID was not found" });
    }
    res.send(user);
});
//should check if the name of the user is unique
//done
router.put("/:id", async (req, res) => {
    const UserExist = await User.findById(req.params.id);
    let newPassword;
    //update the password and take consideration that we use hash password
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    } else {
        newPassword = UserExist.passwordHash;
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            personImage: req.body.personImage,
            vtoImage: req.body.vtoImage,
        },
        { new: true }
    );
    if (!user) {
        res.status(400).send("the User cannot be updated!");
    }
    res.send(user);
});
//done
router.post("/login", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user == null) {
        res.status(400).send("the User is not found");
    }
    if (req.body.password == user.password) {
        res.status(200).send(user);
    } else {
        res.status(400).send("password is wrong!");
    }
});

//done
router.post("/register", async (req, res) => {
    //check if the name is unique over all the names in the DataBase
    const findUser = await User.find({ email: req.body.email });
    if (findUser.length == 0) {
        let user = new User({
            name: req.body.name,
            image: req.body.image,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            receiverName: req.body.name,
            receiverPhone: req.body.phone,
            isAdmin: req.body.isAdmin,
        });
        user = await user.save();
        if (!user) return res.status(400).send("can't create the User");
        res.send(user);
    } else {
        return res.status(400).send("can't create the User try another name");
    }
});

router.put("/shippingAddress/:id", async (req, res) => {
    console.log(req.body);
    //check if the name is unique over all the names in the DataBase
    const changeAddress = await User.findByIdAndUpdate(req.params.id, {
        phone: req.body.phone,
        receiverName: req.body.name,
        address: req.body.address,
        zip: req.body.zip,
        city: req.body.city,
    });
    if (!changeAddress) {
        res.status(400).send("the User address cannot be updated!");
    }
    res.send(changeAddress);
});
//done
router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found!" });
    }
    return res.status(200).json({ success: true, message: "the User is deleted!" });
});

module.exports = router; // export the router

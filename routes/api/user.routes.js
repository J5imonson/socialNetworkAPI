const router = require("express").Router();
const User = require("../../models/User");

router.get("/", async (req, res) => {
  try {
    const payload = await User.find({})
    res.status(200).json({ result: 'success', payload: payload })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

// TODO: populate thought and friend data
router.get("/:id", async (req, res) => {
  try {
    const payload = await User.findById(req.params.id)
    res.status(200).json({ result: 'success', payload: payload })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

router.post("/", async (req, res) => {
  try {
    const payload = await User.create(req.body)
    res.status(200).json({ result: 'success', payload: payload })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const payload = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true })
    res.status(200).json({ result: 'success', payload: payload })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    const payload = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ result: 'success', payload: payload })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

//friend routes
//add a new friend to a user's friend list
router.post("/:userId/friends/:friendId", async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that id!' });
      }
    } catch (err) {
      res.status(500).json({ result: 'error', msg: err.message })
    }
  }
);

//remove a friend from a user's friend list
router.delete("/:userId/friends/:friendId", async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: { friendId: req.params.friendId } } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that id!' });
      }
      res.json(student);
    } catch (err) {
      res.status(500).json({ result: 'error', msg: err.message })
    }
  }
);

module.exports = User;
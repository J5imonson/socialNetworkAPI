const router = require("express").Router();
const Thought = require("../../models/Thought");
const User = require("../../models/User");

router.get("/", async (req, res) => {
  try {
    const payload = await Thought.find({})
    res.status(200).json({ result: 'success', payload: payload })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

router.get("/:id", async (req, res) => {
  try {
    const payload = await Thought.findById(req.params.id)
    res.status(200).json({ result: 'success', payload: payload })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

//create a new thought and push the created thought's _id to the associated user's thoughts array field
router.post("/", async (req, res) => {
  try {
    const payload = await Thought.create(req.body)
    await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $addToSet: { thoughts: payload._id } },
      { runValidators: true, new: true }
    )
    res.status(200).json({ result: 'success', payload: payload })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

router.put("/:id", async (req, res) => {
  try {
    const payload = await Thought.findByIdAndUpdate(
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
    const payload = await Thought.findByIdAndDelete(req.params.id);
    res.status(200).json({ result: 'success', payload: payload })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

//reaction routes
//create a reaction stored in a single thought's reactions array
router.post("/:thoughtId/reaction", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reaction: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res
        .status(404)
        .json({ message: 'No thought found with that id!' });
    }
    res.status(200).json({ result: 'success', payload: thought })
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

//pull and remove a reaction by the reaction's reactionId value
router.delete("/:thoughtId/reaction/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reaction: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );
    if (!thought) {
      return res
        .status(404)
        .json({ message: 'No thought found with that id!' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json({ result: 'error', msg: err.message })
  }
})

module.exports = router;
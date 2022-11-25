const express = require("express");
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

const router = express.Router();

// ROUTE 1:fetching user's notes using GET '/api/auth/fetchallnotes', Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});

// ROUTE 2:Adding user's notes using POST '/api/auth/addnote', Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "title must be greater or equal to 3 latter").isLength({
      min: 3,
    }),
    body("description", "must be greater or equal to 3 latte").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, description, tag } = req.body;

      // checking for unique title
      const check = await Note.findOne({ title: req.body.title });
      if (check) {
        return res
          .status(400)
          .json({ error: "Enter uniue title" });
      }

      //   creating a new note
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      //   saveing note to the server
      const saveNote = await note.save();
      //   sending response to the user
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some Error occured");
    }
  }
);

// ROUTE 3: update a existing note PUT '/api/auth/updatenote', Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    // Create new note object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be update and update it
    let note = await Note.findById(req.params.id);
    if (!note) res.status(400).send("Note not found");

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, newNote, { new: true });

    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error);
  }
});

// ROUTE 4:delete a existing note DELETE '/api/auth/updatenote', Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be delete and delete it
    const note = await Note.findById(req.params.id);
    if (!note) res.status(400).send("Note not found");

    // Allow deletion only user own this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not allowed");
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ Sucess: "You note has been delete", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
});
module.exports = router;

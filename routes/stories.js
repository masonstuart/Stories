const express = require('express');
const { ensureAuth } = require('../middleware/auth');
const router = express.Router();

const Story = require('../models/story');

// route to add page
//GET to /stories/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('stories/add');
});

// POST request to /stories
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

// show all stories
//GET to /stories/add
router.get('/', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    res.render('error/500');
  }
});

// route to single story
//GET to /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
  let story = await Story.findById(req.params.id) 
  .populate('user')
  .lean()

  if(!story){
    res.render('error/404')
  }
  if (story.user._id != req.user.id && story.status == 'private') {
    res.render('error/404')
  } else {

  res.render('stories/show',{
    story,
  })
}
  } catch(err){
    console.error(err)
    res.render('error/404')
  }
});

// route to edit page
//GET to /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  const story = await Story.findOne({
    _id: req.params.id,
  }).lean();

  if (!story) {
    return res.render('error/404');
  }

  if (story.user != req.user.id) {
    res.redirect('/stories');
  } else {
    res.render('stories/edit', {
      story,
    });
  }
});

// route to edit story
//PUT to /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean()

    if (!story) {
      return res.render('error/404')
    }

    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// route to Delete story
//DELETE to /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Story.deleteOne({ _id:req.params.id })
    res.redirect('/dashboard')
  }catch(err) {
console.error(err)
 return res.render('error/500')
  }
});

// route to user stories 
//GET to /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try{
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public'
    })
    .populate('user')
    .lean()

    res.render('stories/index', {
      stories
    })
  } catch(err){
    console.error(err)
    res.render('error/500')
  }
});

module.exports = router;

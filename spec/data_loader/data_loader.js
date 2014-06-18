var mongoose = require('mongoose');
var faker    = require('faker');
var Q        = require('q');
var User     = require('../../server/user/user_model.js');
var Tag      = require('../../server/tag/tag_model.js');

var DB_URL = 'mongodb://jobquery:Team3van@ds061787.mongolab.com:61787/jobquery';
//var DB_URL = 'mongodb://localhost/jobquery';


mongoose.connect(DB_URL);
var tagSaves = [];
// Populate 20 tags
for(var i = 0; i < 20; i++) {
  var tag = {
    name:             faker.random.bs_noun() + i,
    label:            faker.random.catch_phrase_descriptor(),
    scaleDescription: ['None', 'Basic', 'Experienced', 'Expert'],
    category:         'Skills'
  };
  tagSaves.push(Tag.create(tag));
}


// wait till tags are populated, they are needed for creating the user
Q.all(tagSaves)
  .then(function(results) {
    Tag.find(function(err, tags) {
      var user_tags = [];
      user_tags = tags.map(function(item){
        var tag = {
          tag : item._id,
          score : Math.floor(Math.random() * 4)
        };
        return tag;
      });
      // Populate 20 users
      for(var i = 0; i < 20; i++) {
        var user = {
          email:          faker.Internet.email(),
          password:       'password',
          name:           faker.Name.findName(),
          github:         'github.com/' + faker.Name.firstName(),
          linkedin:       'linkedin.com/in/' + faker.Name.firstName(),
          isAdmin:        false,
          isRegistered:   true,
          searchStage:    'Early',
          city:           'San Francisco',
          state:          'CA',
          country:        'USA',
          tags:           user_tags
        };
        User.create(user);
      }
      console.log('Users created');
    });
  }, function (err) {
    console.log(err);
  });

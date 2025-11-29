var Sequence = require('../models/sequence');

var maxDocumentId;
var maxMessageId;
var maxContactId;
var sequenceId = null;

function SequenceGenerator() {

  Sequence.findOne()
    .exec()
    .then(function(sequence) {
      if (!sequence) {
        console.error('No sequence document found in database.');
        return;
      }

      sequenceId = sequence._id;
      maxDocumentId = sequence.maxDocumentId || 0;
      maxMessageId = sequence.maxMessageId || 0;
      maxContactId = sequence.maxContactId || 0;
    })
    .catch(function(err) {
      console.error('Error initializing sequence generator:', err);
    });
}

SequenceGenerator.prototype.nextId = function(collectionType) {

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'documents':
      maxDocumentId++;
      updateObject = {maxDocumentId: maxDocumentId};
      nextId = maxDocumentId;
      break;
    case 'messages':
      maxMessageId++;
      updateObject = {maxMessageId: maxMessageId};
      nextId = maxMessageId;
      break;
    case 'contacts':
      maxContactId++;
      updateObject = {maxContactId: maxContactId};
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  // Use promise-based updateOne (no callback)
  Sequence.updateOne({_id: sequenceId}, {$set: updateObject})
    .then(() => {
      console.log(`Updated ${collectionType} sequence to ${updateObject[Object.keys(updateObject)[0]]}`);
    })
    .catch((err) => {
      console.log("nextId error = " + err);
    });

  return nextId;
}

module.exports = new SequenceGenerator();

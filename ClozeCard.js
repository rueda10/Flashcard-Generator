var ClozeCard = function(text, cloze) {
  if (!(this instanceof ClozeCard)) {
    return new ClozeCard(text, cloze);
  }

  this.text = text;
  this.cloze = cloze;

  this.getCloze = function() {
    return this.cloze;
  }

  this.getPartial = function() {
    if (this.text.includes(this.cloze)) {
      return this.text.replace(this.cloze,'...');
    } else {
      console.log('Error: cloze \'' + this.cloze + '\' is not in full text \'' + this.text + '.\'');
    }
  }

  this.getText = function() {
    return this.text;
  }
}

module.exports = ClozeCard;

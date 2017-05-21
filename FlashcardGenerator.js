var inquirer = require('inquirer');
var fs = require('fs');

var BasicCard = require('./BasicCard.js');
var ClozeCard = require('./ClozeCard.js');

var menuOption;
const BASIC_CARDS_FILE = "basic-cards.txt";
const CLOZE_CARDS_FILE = "cloze-cards.txt";

showMainMenu();

function showMainMenu() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'menuSelection',
      message: 'Main Menu. Please make a selection',
      choices: [
        'Store a Basic flashcard',
        'Store a Cloze flashcard',
        'Go through all Basic flashcards',
        'Go through all Cloze flashcards',
        'Exit'
      ]
    }
  ]).then(function (answer) {
    switch(answer.menuSelection) {
      case 'Store a Basic flashcard':
        storeBasicFlashcard();
        break;
      case 'Store a Cloze flashcard':
        storeClozeFlashcard();
        break;
      case 'Go through all Basic flashcards':
        doBasicFlashcards();
        break;
      case 'Go through all Cloze flashcards':
        doClozeFlashcards();
        break;
      case 'Exit':
        break;
      default:
        console.log('That is not an option. Try again.');
        console.log('');
        showMainMenu();
    }
  });

}

function storeBasicFlashcard() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'front',
      message: 'Enter front of card (question):'
    }
  ]).then(function(entry) {
    var front = entry.front;
    if (front === '') {
      console.log('Front of card is empty, try again.');
      console.log('');
      storeBasicFlashcard();
    } else {
      inquirer.prompt([
        {
          type: 'input',
          name: 'back',
          message: 'Enter back of card (answer):'
        }
      ]).then(function(entry) {
        var back = entry.back;
        if (back === '') {
          console.log('Back of card is empty, try again.');
          console.log('');
          storeBasicFlashcard();
        } else {
          var cardEntry = front + "~" + back + '\n';
          fs.appendFile(BASIC_CARDS_FILE, cardEntry, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log('Card added!');
              showMainMenu();
            }
          });
        }
      });
    }
  });
}

function storeClozeFlashcard() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'fullText',
      message: 'Enter the full text:'
    }
  ]).then(function(entry) {
    var fullText = entry.fullText;
    if (fullText === '') {
      console.log('Full text is empty, try again.');
      console.log('');
      storeClozeFlashcard();
    } else {
      inquirer.prompt([
        {
          type: 'input',
          name: 'cloze',
          message: 'Enter the cloze deletion:'
        }
      ]).then(function(entry) {
        var cloze = entry.cloze;
        if (cloze === '') {
          console.log('Cloze is empty, try again.');
          console.log('');
          storeClozeFlashcard();
        } else if (!fullText.includes(cloze)) {
          console.log("Cloze must be in Full text, try again.");
          storeClozeFlashcard();
        } else {
          var cardEntry = fullText + "~" + cloze + '\n';
          fs.appendFile(CLOZE_CARDS_FILE, cardEntry, function(err) {
            if (err) {
              console.log(err);
            } else {
              console.log('Card added!');
              showMainMenu();
            }
          });
        }
      });
    }
  });
}

function doBasicFlashcards() {
  if (fs.existsSync(BASIC_CARDS_FILE)) {
    fs.readFile(BASIC_CARDS_FILE, "utf8", function(error, data) {
      if (error) {
        console.log(error);
      }

      var dataArr = data.split("\n");
      var cards = [];
      dataArr.forEach(function(pair, index) {
        if (pair != '') {
          var pairArr = pair.split("~");
          var card = new BasicCard(pairArr[0], pairArr[1]);
          cards.push(card);
        }
      });

      var questions = [];
      cards.forEach(function(card, index) {
        var question = {
          type: "input",
          name: card.front + "~" + card.back,
          message: card.front
        };
        questions.push(question);
      });

      inquirer.prompt(questions).then(function(answers) {
        for (var key in answers) {
          var pairArr = key.split("~");
          var card = new BasicCard(pairArr[0], pairArr[1]);

          console.log('Question: ' + card.front);
          console.log('\tYou answered: ' + answers[key]);
          console.log('\tCorrect answer: ' + card.back);
          console.log();
        }
        showMainMenu();
      });
    });
  } else {
    console.log("No Basic Flashcards have been created yet.");
    console.log('');
    showMainMenu();
  }
}

function doClozeFlashcards() {
  if (fs.existsSync(CLOZE_CARDS_FILE)) {
    fs.readFile(CLOZE_CARDS_FILE, "utf8", function(error, data) {
      if (error) {
        console.log(error);
      }

      var dataArr = data.split("\n");
      var cards = [];
      dataArr.forEach(function(pair, index) {
        if (pair != '') {
          var pairArr = pair.split("~");
          var card = new ClozeCard(pairArr[0], pairArr[1]);
          cards.push(card);
        }
      });

      var questions = [];
      cards.forEach(function(card, index) {
        // inquirer doesn't like dots...
        var fullText = card.getText().replace(".","");
        var question = {
          type: "input",
          name: fullText + "~" + card.getCloze(),
          message: card.getPartial()
        };
        questions.push(question);
      });

      inquirer.prompt(questions).then(function(answers) {
        for (var key in answers) {
          var pairArr = key.split("~");
          var card = new ClozeCard(pairArr[0], pairArr[1]);

          console.log('Partial: ' + card.getPartial());
          console.log('\tYou answered: ' + answers[key]);
          console.log('\tCorrect answer: ' + card.getCloze());
          console.log();
        }
        showMainMenu();
      });
    });
  } else {
    console.log("No Cloze Flashcards have been created yet.");
    console.log('');
    showMainMenu();
  }
}

const Alexa = require("alexa-sdk");
const words = require("./words");

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context, callback);

  const checkAsked = (arr, word, input) => {
    arr.splice(arr.indexOf(word), 1);
    const correct = input === word;
    return { correct: correct, avail: arr };
  };

  handlers = {
    StartIntent: function() {
      const word = words[Math.floor(Math.random() * words.length)];
      console.log('randword:', word);
      this.attributes["askedWord"] = word;
      this.attributes["avail"] = words;
      this.emit(':ask', word);
    },

    SpellIntent: function() {
      const intent = this.event.request.intent;
      const word = intent.slots.letter.value.split(" ").join("").toLowerCase();
      console.log('asked:', this.attributes.askedWord);
      console.log('word:', word);
      const result = checkAsked(
        this.attributes.avail,
        this.attributes.askedWord,
        word
      );
      const { avail } = result;
      const randWord = avail[Math.floor(Math.random() * avail.length)];
      this.attributes["askedWord"] = randWord;
      this.attributes["avail"] = avail;

      !result.correct
        ? this.emit(":tell", "incorrect")
        : avail.length > 0
          ? this.emit(":ask", randWord)
          : this.emit(":tell", "congratulations you won");
    },

    "AMAZON.HelpIntent": function() {
      this.emit(':tell', 'I will say a word and you will spell it');
      this.emit(':delegate', 'StartIntent');
    },

    Unhandled: function() {
      this.emit(':tell', 'I\'m sorry, I didn\'t get that.');
    },

    "AMAZON.CancelIntent": function() {
      this.emit(':tell', 'O.K.');
    },

    "AMAZON.StopIntent": function() {
      this.emit(':tell', 'stopping');
    }

  };

  alexa.registerHandlers(handlers);
  alexa.execute();

  callback(null, "Hello from Lambda");
};

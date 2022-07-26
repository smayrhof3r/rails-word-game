import { Controller } from "@hotwired/stimulus"
import { ContextExclusionPlugin } from "webpack";

// Connects to data-controller="games"
export default class extends Controller {
  connect() {
    console.log("welcome to games stimulus controller")
  }
  static targets = ['word', 'score', 'letters', 'formbutton']
  alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

  buttonEntry(event) {
    if (event.currentTarget.classList.contains("used")) {
      this.#removeCharFromInput(event.currentTarget.innerHTML);
    } else {
      this.#addCharToInput(event.currentTarget.innerHTML);
    }
    event.currentTarget.classList.toggle("used");
    if (this.wordTarget.value.length > 1) { validWord(); }
  }

  keyboardEntry(event) {
    if (this.alphabet.includes(event.key.toUpperCase())) {
      console.log('........keyboard event........');
      this.#markUsed(event.key);
      console.log('marked used');
    } else {
      console.log('........keyboard event delete........');
      this.#markUnused();
      console.log('mark unused');
    }

    this.#checkValid();
  }

  #removeCharFromInput(char) {
    const word = this.wordTarget.value.split('');
    word.splice(word.lastIndexOf(char), 1);
    this.wordTarget.value = word.join('');
  };

  #addCharToInput(char) {
    this.wordTarget.value += char;
  };

  #markUsed(char){
    let oneLetter = [];

    this.lettersTarget.querySelectorAll(".letter").forEach((letter) => {
      if ((!letter.classList.contains("used")) && (letter.innerHTML === char)) {
        oneLetter.push(letter);
      }
    })

    if (oneLetter.length > 0) {
      oneLetter[0].classList.add("used");
    }
  }

  #markUnused() {
    this.#letterChoicesToMarkUnused().forEach(letter => letter.classList.remove("used"))
  }

  #letterChoicesToMarkUnused() {
    const unUsedletterChoices = [];
    const word = this.wordTarget.value.split('');
    document.querySelectorAll(".used").forEach((letter) => {
      if ( word.includes(letter.innerHTML) ) {
        word.splice(word.lastIndexOf(letter.innerHTML),1);
      } else { unUsedletterChoices.push(letter); }
    });
    return unUsedletterChoices;
  }

  #checkValid() {
    console.log('check Valid')
    this.#validWord()
    console.log(`button disabled: ${this.formbuttonTarget.disabled}`);
    if (!this.formbuttonTarget.disabled) {
      console.log('checking valid selection now')
      this.#validSelection();
    }
  }

  #validSelection() {
    const availableletterChoices = this.#letterArray()
    console.log('check valid selection...');
    console.log(`available letters: ${availableletterChoices}`);
    let valid = true;
    this.wordTarget.value.split('').forEach((letter) => {
      console.log(`check letter: ${letter} in ${availableletterChoices}`);
      if (availableletterChoices.includes(letter)) {
        console.log('found');
        availableletterChoices.splice(availableletterChoices.lastIndexOf(letter), 1);
        console.log(`updated available letters: ${availableletterChoices}`)
      } else {
        console.log('not found')
        valid = false;
      }
    })
    console.log(`valid selection result: ${valid}`)
    this.#markValidity(valid);
  }

  #validWord() {
    console.log("check valid word..");
    fetch(`https://wagon-dictionary.herokuapp.com/${this.wordTarget.value}`)
      .then((response) => {
        console.log(response.json())
        response.json()
      })
      .then(result => this.#markValidity(result.found));
  }

  #letterArray() {
    console.log('in letter array')
    const letterArr = [];
    this.lettersTarget.querySelectorAll(".letter").forEach(letter => letterArr.push(letter.innerHTML));
    console.log(letterArr)
    return letterArr;
  }

  #markValidity(valid) {
    console.log(valid);
    if (valid) {
      console.log('marked valid')
      this.wordTarget.classList.remove('is-invalid');
      this.scoreTarget.value = this.wordTarget.value.length;
      this.formbuttonTarget.disabled = false;
    } else {
      this.wordTarget.classList.add('is-invalid');
      this.scoreTarget.value = 0;
      this.formbuttonTarget.disabled = true;
    }
  }
}

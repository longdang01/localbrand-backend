// Create id random format (Exp: CS342)
const generateCodeRandom = (prefix, listItem, fieldCheck, l) => {
  let randomNumber;
  let re = new RegExp(prefix, "gi");

  // let end = "9";
  // end = addZero(end, l, "after");

  randomNumber = generate(l);
  for (let i = 0; i < listItem.length; i++) {
    if (randomNumber === Number(listItem[i][fieldCheck].replace(re, ""))) {
      randomNumber = generate(l);
    }
  }

  randomNumber = addZero(randomNumber, l, "pre");
  return prefix + randomNumber;
};

function generate(n) {
  var add = 1,
    max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

  if (n > max) {
    return generate(max) + generate(n - max);
  }

  max = Math.pow(10, n + add);
  var min = max / 10; // Math.pow(10, n) basically
  var number = Math.floor(Math.random() * (max - min + 1)) + min;

  return ("" + number).substring(add);
}

// Create id sequential format (Exp: CS001, CS002)
const generateCode = (prefix, listItem, fieldCheck, l) => {
  // l: length after prefix

  let maxNumber = 0;
  let codeNumber;
  let re = new RegExp(prefix, "gi");
  for (let i = 0; i < listItem.length; i++) {
    if (maxNumber < Number(listItem[i][fieldCheck].replace(re, ""))) {
      maxNumber = Number(listItem[i][fieldCheck].replace(re, ""));
    }
  }

  codeNumber = (maxNumber + 1).toString();
  codeNumber = addZero(codeNumber, l, "pre");

  let code = prefix + codeNumber;
  return code;
};

const addZero = (codeNumber, l, choice) => {
  while (codeNumber.length < l) {
    if (choice === "pre") {
      codeNumber = "0" + codeNumber;
    } else {
      codeNumber = codeNumber + "0";
    }
  }
  return codeNumber;
};

module.exports = {
  generateCode,
  generateCodeRandom,
};

function statusTranslatorWordToNumber(status) {
  if (status === "to-do" || !status) {
    status = 0;
  } else if (status === "in progress") {
    status = 1;
  } else {
    status = 2;
  }
  return status;
}

function statusTranslatorNumberToWord(status) {
  if (status === "0") {
    status = "to-do";
  } else if (status === "1") {
    status = "in progress";
  } else {
    status = "done";
  }
  return status;
}

module.exports = { statusTranslatorWordToNumber, statusTranslatorNumberToWord };

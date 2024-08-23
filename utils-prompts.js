// LIST
export const listPrompt = (name, message, choices, pageSize) => [
  {
    type: 'list',
    name: name,
    message: message,
    choices: choices,
    pageSize: pageSize,
  },
];

// CONFIRM
export const confirmPrompt = (message) => [
  {
    type: 'confirm',
    name: 'confirmation',
    message: message,
    default: false,
  },
];

// INPUT
export const inputPrompt = (name, message) => [
  {
    type: 'input',
    name: name,
    message: message,
  },
];

// PASSWORD
export const passwordPrompt = (name, message) => [
  {
    type: 'password',
    name: name,
    message: message,
    mask: '*',
  },
];
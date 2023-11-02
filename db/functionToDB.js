import users from "./dbToTest.js";

export function addToDB(objectUser) {
  users.push(objectUser);
  return true;
}

export function inClodsDBByEmail(objectUser) {
  return users.find((item) => {
    return item.email == objectUser.email;
  });
}
export function inClodsDBByUser(objectUser) {
  return users.find((item) => {
    return item.username == objectUser.username;
  });
}

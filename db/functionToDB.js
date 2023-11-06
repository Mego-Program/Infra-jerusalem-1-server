import User from "./models/SchemaUsers.js";

export async function addToDB(objectUser) {
  // creat a object to add to do DB.
  const addUser = new User(objectUser);

  try {
    let responsAddUser = await addUser.save();
    return true;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function allDB() {
  try {
    const allUsers = await User.find({});
    console.log(allUsers);
    return allUsers;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function getOneUser(objectUser) {
  try {
    return await User.findOne(objectUser);
  } catch (error) {
    return undefined;
  }
}

export async function updeteOneUser(email, objectUpdate) {
  try {
    console.log(await User.findOne({email:email}));
    const resDB = await User.updateOne({ email: email }, { $set: objectUpdate });
    console.log(resDB);
    return true
  } catch (error) {
    return false
  }
}

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

export async function allDB(req, res) {

  try {
    const allUsers = await User.find({}, { username: 1, image: 1});
    // res.json(allUsers)
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
    const resDB = await User.updateOne({ email: email }, { $set: objectUpdate });
    return true
  } catch (error) {
    return false
  }
}

export async function getRowsfromAllUsers(stringRows){
  try {
    const resDB = await User.find({}, stringRows)
    return resDB
  } catch (error) {
    return error
  }
}

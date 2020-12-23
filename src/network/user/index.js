import firebase from "../../firebase/config";

export const AddUser = async (name, email, uid) => {
  try {
    return await firebase
      .database()
      .ref("users/" + uid)
      .set({
        name: name,
        email: email,
        uuid: uid,
      });
  } catch (error) {
    return error;
  }
};

export const UpdateUser = async (userToken, id, name, img) => {
  try {
    return await firebase
      .database() 
      .ref("users/" + userToken + "/favorite/" + id )
      .push({
        id: id,
        name: name,
        img: img
      });
      
  } catch (error) {
      console.log("FavError: ",error)
  }
};

export const DeleteBookMark = async (userToken, id, name, img) => {
  try {
    return await firebase
      .database()
      .ref("users/" + userToken + "/favorite/" + id )
      .remove();
      
  } catch (error) {
      console.log("FavError: ",error)
  }
};

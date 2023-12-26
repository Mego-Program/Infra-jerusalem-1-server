import uploadImagecloudinary from '../../cloudinary/updateImage.js'
import {updeteOneUser } from "../../db/functionToDB.js";


const ChangeProfilePicture = async (req, res) => {
    const email = req.body.email
    const image = req.files[0]
    const imageUrl = await uploadImagecloudinary(image)

    try {
        const saveDB = await updeteOneUser(email, {
            image : imageUrl,
          });
          return res.status(200).json({
            msg: "The change was successfully saved"
          });
    } catch (error) {
        console.log(error)
    }
  };
  
  export default ChangeProfilePicture;
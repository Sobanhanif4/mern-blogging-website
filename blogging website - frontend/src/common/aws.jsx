import axios from "axios";

export const uploadImage = async (img) => {

    let imgUrl = null;

    await axios.get('http://localhost:3001' + "/get-upload-url")
        .then( async ({ data: { uploadURL } }) => {

    await axios({
        method: 'PUT',
        url: uploadURL,
        headers: { 'content-Type': 'multipart/form-data' },
        data: img
    })
    .then(() => {
            imgUrl = uploadURL.split("?")[0]
        })
})
return imgUrl
}
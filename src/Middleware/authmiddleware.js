const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
        jwt.verify(token, "Secret-Key-lithium", function (err, decode) {
            if (err) { return res.status(401).send({ status: false, data: "invalid token" }) }
            req.decode = decode;
            next();
        })
    } catch (error) {
        res.status(500).send({ status: false, msg: error });

    }
}


// const authorize = function (req, res, next) {
//     try {
//         if (req.body.userId == req.decode.userId) return next();
//         else return res.status(403).send({ status: false, msg: "you are not authorised !" });
//     } catch (error) {
//         return res.status(500).send({ msg: error.message })
//     }
// }




// const bookAuthorize = async function (req, res, next) {
//     try {
//         let checkingUserId = await UserModel.findOne({ _id: userId })
//         if (!checkingUserId) {
//             return res.status(404).send({ status: false, msg: "userId is not present" })
//         }
//         if (!req.body.userId) {
//             return res.status(400).send({ status: false, msg: "provide userId" })
//         }
//         if (req.body.userId == req.decode.userId) return next();
//         else return res.status(403).send({ status: false, msg: "you are not authorised !" });

//     } catch (error) {
//         return res.status(500).send({ msg: error.message })

//     }
// }



// const authorisation = async function (req, res, next) {
//     try {
//         let book = req.params.bookId
//         let checkingBook = await BooksModel.findOne({ _id: book })
//         if (!checkingBook) {
//             return res.status(404).send({ status: false, msg: "this book  is not found"})
//         }
//         if (checkingBook.userId != req.decoded.userId) {
//             return res.status(403).send({ status: false, msg: "you are not authorized person" })
//         }
//         else {
//             next()
//         } 
//     } catch (err) {
//         return res.status(500).send({ status: false, msg: err.message })
//     }
// }


module.exports.authenticate = authenticate;
//module.exports.bookAuthorize= bookAuthorize;
//module.exports.authorisation= authorisation;


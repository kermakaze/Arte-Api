module.exports = {
    sendServerError(res) {
        res.status(500)
            .send({
                error: "An unexpected error occurred"
            })
    },

    sendGenericResponse(res) {
        res.send({
            success: true
        })
    },

    sendError(res, code, message) {
        res.status(code)
            .send({
                error: message
            })
    }


};
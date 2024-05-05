const Apierror = require("../utils/ApiError")

handelError = (err, req, res, next) => {
    if (err instanceof Apierror) {
        res.status(err.statusCode).json({ message: err.message, succses: false})

    } else {
        if (process.env.DEBUG_MODE == "true") {

            res.status(500).json(
                {
                    message: "internal server error ",
                    succses: false, error: err?.message || ""
                })
        } else {
            res.status(500)
                .json({
                    message: "internal server error ",
                    succses: false
                })

        }
        console.log(err)
    }

}

module.exports = handelError
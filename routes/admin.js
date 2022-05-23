const express = require('express')
const router = express.Router()

/**
 * @swagger
 * tags:
 *  name: admin
 *  description: admin routes
 */

/**
 * @swagger
 * /admin/test:
 *  get:
 *      summary: route to test if admin route is working
 *      tags: [admin]
 *      responses:
 *          200:
 *              description: admin route is working
*/


router.get("/test", (req, res) => {
    res.json({message:'OK'})
})

module.exports = router;
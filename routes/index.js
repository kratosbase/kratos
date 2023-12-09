import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
    res.send('Nothing much to see here... but feel free to leave a star on GitHub if you found this useful: https://github.com/lkgit1/kratos')
})

export default router
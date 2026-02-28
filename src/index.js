const express = require('express')
const cors = require('cors')
const { query } = require('./config/db.conf')

const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:3000'
}))


app.get('/health', async (_, res) => {
    try {
        const r = await query('SELECT 1')
        res.json({ ok: true, db: r.rowCount === 1 })
    } catch (error) {
        res.status(500).json({ ok: false });
    }
})

app.use('/v1/auth', require('./routes/auth'))

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
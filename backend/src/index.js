const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/sales', salesRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

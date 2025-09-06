const express = require('express');
const fileUpload = require('express-fileupload');
const pool = require('./db');
const path = require('path');
router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(fileUpload());
router.use('/public/images', express.static(path.join(__dirname, 'public', 'images')));

router.get('/', async (req, res) => {
    res.redirect('/birds')
});

router.get('/birds', async (req, res) => {
    conservation_status_data = [];
    birds_data = [];

    const db = pool.promise();
    const status_query = `SELECT * FROM ConservationStatus;`
    try {
        const [rows, fields] = await db.query(status_query);
        conservation_status_data = rows;
    } catch (err) {
        console.error("You havent set up the database yet!");
    }

    const birds_query = `
    SELECT Bird.*, Photos.filename, Photos.photographer, ConservationStatus.status_name, ConservationStatus.status_colour
    FROM Bird
    LEFT JOIN Photos ON Bird.bird_id = Photos.bird_id
    LEFT JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id;
    `;

    try {
        const [birdRows] = await db.query(birds_query);
        birds_data = birdRows;
        console.log("Birds fetched from DB:", birds_data.length);
    } catch (err) {
        console.error("Error fetching birds from the database:", err);
    }

    res.render('index', { title: 'Birds of Aotearoa', birds: birds_data, status: conservation_status_data });
});

router.get('/birds/create', async (req, res) => {
    conservation_status_data = [];

    const db = pool.promise();
    const status_query = `SELECT * FROM ConservationStatus;`
    try {
        const [rows, fields] = await db.query(status_query);
        conservation_status_data = rows;
    } catch (err) {
        console.error("You havent set up the database yet!");
    }

    res.render('create', {
        title: 'Create a Bird',
        status: conservation_status_data,
        birds: []
    });
});

router.post('/birds/create', async (req, res) => {
    const { primary_name, english_name, scientific_name, order_name, family, weight, length, status_name, filename, photographer } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const photo = req.files.photo;
    const uploadPath = path.join(__dirname, 'public', 'images', photo.name);

    photo.mv(uploadPath, async (err) => {
        if (err) {
            console.error("Error uploading file:", err);
            return res.status(500).send(err);
        }


        const db = pool.promise();

        const status_query = `SELECT status_id FROM ConservationStatus WHERE status_name = ?;`;
        let status_id;
        try {
            const [rows] = await db.query(status_query, [status_name]);
            if (rows.length > 0) {
                status_id = rows[0].status_id;
            } else {
                return res.status(400).send("Invalid conservation status.");
            }
        } catch (err) {
            console.error("Error fetching conservation status:", err);
            return res.status(500).send("Internal Server Error");
        }

        const bird_query = `
            INSERT INTO Bird (primary_name, english_name, scientific_name, order_name, family, weight, length, status_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `;
        try {
            const [result] = await db.query(bird_query, [primary_name, english_name, scientific_name, order_name, family, weight, length, status_id]);
            const bird_id = result.insertId;

            const photo_query = `INSERT INTO Photos (bird_id, filename, photographer) VALUES (?, ?, ?);`;
            await db.query(photo_query, [bird_id, photo.name, photographer]);

            res.redirect('/birds');
        } catch (err) {
            console.error("Error inserting new bird:", err);
            res.status(500).send("Internal Server Error");
        }
    });
});

router.get('/birds/:id', async (req, res) => {
    conservation_status_data = [];

    const db = pool.promise();
    const status_query = `SELECT * FROM ConservationStatus;`
    try {
        const [rows, fields] = await db.query(status_query);
        conservation_status_data = rows;
    } catch (err) {
        console.error("You havent set up the database yet!");
    }
    const birdId = parseInt(req.params.id, 10);

    if (isNaN(birdId)) {
        return res.status(404).render('404', {
            title: '404 Page Not Found',
            status: [],
            birds: []
        });
    }

    const bird_query = `
        SELECT Bird.*, Photos.filename, Photos.photographer, ConservationStatus.status_name, ConservationStatus.status_colour
        FROM Bird
        LEFT JOIN Photos ON Bird.bird_id = Photos.bird_id
        LEFT JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id
        WHERE Bird.bird_id = ?;
    `;

    try {
        const [birdRows] = await db.query(bird_query, [birdId]);
        if (birdRows.length === 0) {
            return res.status(404).render('404', {
                title: '404 Page Not Found',
                status: conservation_status_data,
                birds: []
            });
        }

        const bird = birdRows[0];
        res.render('birdpage', { title: bird.primary_name, bird: bird, status: conservation_status_data, birds: birdRows });
    } catch (err) {
        console.error("Error fetching bird from the database:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/birds/:id/update', async (req, res) => {

    conservation_status_data = [];

    const db = pool.promise();
    const status_query = `SELECT * FROM ConservationStatus;`
    try {
        const [rows, fields] = await db.query(status_query);
        conservation_status_data = rows;
    } catch (err) {
        console.error("You havent set up the database yet!");
    }
    const birdId = parseInt(req.params.id, 10);

    if (isNaN(birdId)) {
        return res.status(404).render('404', {
            title: '404 Page Not Found',
            status: [],
            birds: []
        });
    }

    const bird_query = `
        SELECT Bird.*, Photos.filename, Photos.photographer, ConservationStatus.status_name, ConservationStatus.status_colour
        FROM Bird
        LEFT JOIN Photos ON Bird.bird_id = Photos.bird_id
        LEFT JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id
        WHERE Bird.bird_id = ?;
    `;

    try {
        const [birdRows] = await db.query(bird_query, [birdId]);
        if (birdRows.length === 0) {
            return res.status(404).render('404', { title: '404 Page Not Found', status: [], birds: [] });
        }
        const bird = birdRows[0];
        const status_query = `SELECT * FROM ConservationStatus;`;
        const [statusRows] = await db.query(status_query);
        res.render('update', { title: 'Update Bird', bird, status: statusRows });
    } catch (err) {
        console.error("Error fetching bird for update:", err);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/birds/:id/update', async (req, res) => {
    const birdId = parseInt(req.params.id, 10);
    const { primary_name, english_name, scientific_name, order_name, family, weight, length, status_name, photographer } = req.body;

    const db = pool.promise();

    const status_query = `SELECT status_id FROM ConservationStatus WHERE status_name = ?;`;
    let status_id;
    try {
        const [rows] = await db.query(status_query, [status_name]);
        if (rows.length > 0) {
            status_id = rows[0].status_id;
        } else {
            return res.status(400).send("Invalid conservation status.");
        }
    } catch (err) {
        console.error("Error fetching conservation status:", err);
        return res.status(500).send("Internal Server Error");
    }

    const bird_query = `
        UPDATE Bird SET primary_name = ?, english_name = ?, scientific_name = ?, order_name = ?, family = ?, weight = ?, length = ?, status_id = ?
        WHERE bird_id = ?;
    `;

    try {
        await db.query(bird_query, [primary_name, english_name, scientific_name, order_name, family, weight, length, status_id, birdId]);
    } catch (err) {
        console.error("Error updating bird:", err);
        return res.status(500).send("Internal Server Error");
    }

    let newFilename = null;
    if (req.files && req.files.photo) {
        const photo = req.files.photo;
        newFilename = `${birdId}_${photo.name}`;

        const uploadPath = path.join(__dirname, 'public', 'images', newFilename);
        try {
            await photo.mv(uploadPath);
        } catch (err) {
            console.error("Error saving the uploaded photo:", err);
            return res.status(500).send("Error uploading photo");
        }
    }

    if (newFilename) {
        const photo_query = `
            UPDATE Photos SET filename = ?, photographer = ?
            WHERE bird_id = ?;
        `;
        try {
            await db.query(photo_query, [newFilename, photographer, birdId]);
        } catch (err) {
            console.error("Error updating photo:", err);
            return res.status(500).send("Internal Server Error");
        }
    } else {
        const photo_query = `
            UPDATE Photos SET photographer = ?
            WHERE bird_id = ?;
        `;
        try {
            await db.query(photo_query, [photographer, birdId]);
        } catch (err) {
            console.error("Error updating photographer:", err);
            return res.status(500).send("Internal Server Error");
        }
    }

    res.redirect(`/birds/${birdId}`);
});

router.post('/birds/:id/delete', async (req, res) => {
    const birdId = parseInt(req.params.id, 10);
    if (isNaN(birdId)) {
        return res.status(404).render('404', { title: '404 Page Not Found', status: [], birds: [] });
    }

    const db = pool.promise();
    const delete_bird_query = `DELETE FROM Bird WHERE bird_id = ?;`;
    const delete_photo_query = `DELETE FROM Photos WHERE bird_id = ?;`;

    try {
        await db.query(delete_photo_query, [birdId]);
        await db.query(delete_bird_query, [birdId]);
        res.redirect('/birds');
    } catch (err) {
        console.error("Error deleting bird:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Route to display the update form
router.get('/birds/:id/update', async (req, res) => {
    const birdId = parseInt(req.params.id, 10);
    if (isNaN(birdId)) {
        return res.status(404).render('404', { title: '404 Page Not Found', status: [], birds: [] });
    }

    const db = pool.promise();
    const bird_query = `
        SELECT Bird.*, Photos.filename, Photos.photographer, ConservationStatus.status_name, ConservationStatus.status_colour
        FROM Bird
        LEFT JOIN Photos ON Bird.bird_id = Photos.bird_id
        LEFT JOIN ConservationStatus ON Bird.status_id = ConservationStatus.status_id
        WHERE Bird.bird_id = ?;
    `;

    try {
        const [birdRows] = await db.query(bird_query, [birdId]);
        if (birdRows.length === 0) {
            return res.status(404).render('404', { title: '404 Page Not Found', status: [], birds: [] });
        }
        const bird = birdRows[0];
        const status_query = `SELECT * FROM ConservationStatus;`;
        const [statusRows] = await db.query(status_query);
        res.render('update', { title: 'Update Bird', bird, status: statusRows });
    } catch (err) {
        console.error("Error fetching bird for update:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle the update form submission
router.post('/birds/:id/update', async (req, res) => {
    const birdId = parseInt(req.params.id, 10);
    const { primary_name, english_name, scientific_name, order_name, family, weight, length, status_name, photographer } = req.body;

    const db = pool.promise();

    // Get the status_id based on the status_name
    const status_query = `SELECT status_id FROM ConservationStatus WHERE status_name = ?;`;
    let status_id;
    try {
        const [rows] = await db.query(status_query, [status_name]);
        if (rows.length > 0) {
            status_id = rows[0].status_id;
        } else {
            return res.status(400).send("Invalid conservation status.");
        }
    } catch (err) {
        console.error("Error fetching conservation status:", err);
        return res.status(500).send("Internal Server Error");
    }

    // Update the bird in the Bird table
    const bird_query = `
        UPDATE Bird SET primary_name = ?, english_name = ?, scientific_name = ?, order_name = ?, family = ?, weight = ?, length = ?, status_id = ?
        WHERE bird_id = ?;
    `;
    try {
        await db.query(bird_query, [primary_name, english_name, scientific_name, order_name, family, weight, length, status_id, birdId]);
        res.redirect(`/birds/${birdId}`);
    } catch (err) {
        console.error("Error updating bird:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle deletion
router.post('/birds/:id/delete', async (req, res) => {
    const birdId = parseInt(req.params.id, 10);
    if (isNaN(birdId)) {
        return res.status(404).render('404', { title: '404 Page Not Found', status: [], birds: [] });
    }

    const db = pool.promise();
    const delete_bird_query = `DELETE FROM Bird WHERE bird_id = ?;`;
    const delete_photo_query = `DELETE FROM Photos WHERE bird_id = ?;`;

    try {
        await db.query(delete_photo_query, [birdId]);
        await db.query(delete_bird_query, [birdId]);
        res.redirect('/birds');
    } catch (err) {
        console.error("Error deleting bird:", err);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;



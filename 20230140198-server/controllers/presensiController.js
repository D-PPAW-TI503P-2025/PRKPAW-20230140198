// 1. Ganti sumber data dari array ke model Sequelize
const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Format nama file: userId-timestamp.jpg
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
    }
};

exports.upload = multer({ storage: storage, fileFilter: fileFilter });

exports.CheckIn = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { latitude, longitude } = req.body;
        const now = new Date();

        const existingRecord = await Presensi.findOne({
        where: { userId, checkOut: null },
        });

        if (existingRecord) {
        return res.status(400).json({
            message: "Anda sudah check-in dan belum check-out.",
        });
        }

        // ⚡ Gunakan nama field yang sama dengan router: 'buktiFoto'
        const buktiFoto = req.file ? req.file.path : null;

        const newRecord = await Presensi.create({
        userId,
        checkIn: now,
        latitude: latitude || null,
        longitude: longitude || null,
        buktiFoto,
        });

        return res.status(201).json({
        message: `Check-in berhasil pada pukul ${format(now, "HH:mm:ss", { timeZone })} WIB`,
        data: {
            id: newRecord.id,
            userId: newRecord.userId,
            checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
            checkOut: null,
            latitude: newRecord.latitude,
            longitude: newRecord.longitude,
            buktiFoto: newRecord.buktiFoto,
        },
        });
    } catch (error) {
        console.error("Error CheckIn:", error); // ⚡ Logging supaya bisa tahu kenapa gagal
        return res.status(500).json({
        message: "Terjadi kesalahan server",
        error: error.message,
        });
    }
};


exports.CheckOut = async (req, res) => {
    try {
        const { id: userId, nama: userName } = req.user;
        const waktuSekarang = new Date();

        // Cari data di database
        const recordToUpdate = await Presensi.findOne({
        where: { userId: userId, checkOut: null },
        });

        if (!recordToUpdate) {
        return res.status(404).json({
            message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
        });
        }

        // 5. Update dan simpan perubahan ke database
        recordToUpdate.checkOut = waktuSekarang;
        await recordToUpdate.save();

        const formattedData = {
        userId: recordToUpdate.userId,
        nama: recordToUpdate.nama,
        checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
            timeZone,
        }),
        checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
            timeZone,
        }),
        };

        res.json({
        message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
            waktuSekarang,
            "HH:mm:ss",
            { timeZone }
        )} WIB`,
        data: formattedData,
        });
    } catch (error) {
        res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};


// Hapus presensiController.js
exports.deletePresensi = async (req, res) => {
    try {
        const { id: userId, role } = req.user;
        const presensiId = req.params.id;

        const record = await Presensi.findByPk(presensiId);
        if (!record)
        return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });

        if (role === "mahasiswa" && record.userId !== userId) {
        return res.status(403).json({
            message: "Akses ditolak. Anda tidak memiliki izin.",
        });
        }

        // Hapus file foto jika ada
        if (record.buktiFoto && fs.existsSync(record.buktiFoto)) fs.unlinkSync(record.buktiFoto);

        await record.destroy();

        return res.status(200).json({ message: "Data presensi berhasil dihapus." });
    } catch (error) {
        return res.status(500).json({
        message: "Terjadi kesalahan server",
        error: error.message,
        });
    }
};


// Update presensiController.js
exports.updatePresensi = async (req, res) => {
    try {
        const presensiId = req.params.id;
        const { checkIn, checkOut, nama } = req.body;

        // Tambahan: validasi format tanggal (tanpa ubah logika kamu)
        const isValidDate = (value) => !isNaN(Date.parse(value));

        if (checkIn && !isValidDate(checkIn)) {
        return res.status(400).json({
            message: "Format tanggal checkIn tidak valid.",
        });
        }

        if (checkOut && !isValidDate(checkOut)) {
        return res.status(400).json({
            message: "Format tanggal checkOut tidak valid. Gunakan format YYYY-MM-DD atau ISO8601.",
        });
        }

        if (checkIn === undefined && checkOut === undefined && nama === undefined) {
        return res.status(400).json({
            message:
            "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
        });
        }

        const recordToUpdate = await Presensi.findByPk(presensiId);
        if (!recordToUpdate) {
        return res
            .status(404)
            .json({ message: "Catatan presensi tidak ditemukan." });
        }

        recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
        recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
        recordToUpdate.nama = nama || recordToUpdate.nama;
        await recordToUpdate.save();

        res.json({
        message: "Data presensi berhasil diperbarui.",
        data: recordToUpdate,
        });
    } catch (error) {
        res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};
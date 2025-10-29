const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { Op } = require("sequelize");
const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
    try {
        const today = format(new Date(), "yyyy-MM-dd", { timeZone });

        // Ambil data dengan filter berdasarkan tanggal checkIn hari ini
        const startOfDay = new Date(`${today}T00:00:00`);
        const endOfDay = new Date(`${today}T23:59:59`);

        const dailyData = await Presensi.findAll({
            where: {
                checkIn: {
                    [Op.between]: [startOfDay, endOfDay],
                },
            },
        });

        // Format data untuk response
        const formattedData = dailyData.map((record) => ({
            userId: record.userId,
            nama: record.nama,
            checkIn: format(record.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
            checkOut: record.checkOut
                ? format(record.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
                : null,
        }));

        res.json({
            message: `Laporan presensi tanggal ${today}`,
            total: formattedData.length,
            data: formattedData,
        });
    } catch (error) {
        res.status(500).json({
            message: "Terjadi kesalahan pada server saat mengambil laporan harian",
            error: error.message,
        });
    }
};

// Middleware untuk menambahkan data user dummy
exports.addUserData = (req, res, next) => {
    console.log('Middleware: Menambahkan data user dummy...');
    req.user = {
        id: 123,
        nama: 'User Karyawan', // ✅ perbaikan tanda kutip
        role: 'karyawan'       // ubah ke 'admin' kalau mau tes route report
    };
    next();
};

// Middleware untuk cek apakah user adalah admin

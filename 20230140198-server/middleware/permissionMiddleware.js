// Middleware untuk menambahkan data user dummy
exports.addUserData = (req, res, next) => {
    console.log('Middleware: Menambahkan data user dummy...');
    req.user = {
        id: 123,
        nama: 'User Karyawan', 
        role: 'admin'       // ubah ke 'admin' kalau mau tes route report
    };
    next();
};

// Middleware untuk cek apakah user adalah admin 
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        console.log('Middleware: Izin admin diberikan.');
        next();
    } else {
        console.log('Middleware: Gagal! Pengguna bukan admin.');
        return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin' });
    }
};

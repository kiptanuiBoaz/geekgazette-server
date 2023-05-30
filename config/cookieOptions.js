const cookieOptions = {
    httpOnly: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
    secure: true
}

module.exports = cookieOptions;

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserVerification {
    // Menyimpan status verifikasi: address → bool
    mapping(address => bool) public isVerified;

    // Fungsi untuk memverifikasi user
    function verifyUser(address user) external {
        isVerified[user] = true;
    }

    // Fungsi untuk mengecek apakah user terverifikasi
    function isUserVerified(address user) external view returns (bool) {
        return isVerified[user];
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserVerification {
    // Menyimpan status verifikasi: address → bool
    mapping(address => bool) public isVerified;

    // Event untuk mencatat transfer
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Verified(address indexed user);

    // Fungsi untuk memverifikasi user
    function verifyUser(address user) external {
        isVerified[user] = true;
        emit Verified(user);
    }

    // Fungsi untuk mengecek apakah user terverifikasi
    function isUserVerified(address user) external view returns (bool) {
        return isVerified[user];
    }

    // Fungsi untuk menerima ETH (agar kontrak bisa punya saldo)
    receive() external payable {}

    // Fungsi untuk mentransfer ETH dari kontrak ke address lain (hanya jika pengirim terverifikasi)
    function transfer(address to, uint256 value) external {
        require(isVerified[msg.sender], "User not verified");
        require(address(this).balance >= value, "Insufficient contract balance");

        (bool sent, ) = to.call{value: value}("");
        require(sent, "Transfer failed");

        emit Transfer(msg.sender, to, value);
    }
}
